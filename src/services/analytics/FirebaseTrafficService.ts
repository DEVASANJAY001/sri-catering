import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../../config/firebase';

export interface TrafficStats {
  totalVisits: number;
  todayVisits: number;
  todayDate: string;
  activeNow: number;
  pageViews: Record<string, number>;
  deviceBreakdown: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  recentVisitors: Array<{
    id: string;
    page: string;
    timestamp: string;
    device: string;
    referrer?: string;
  }>;
}

const TRAFFIC_DOC_PATH = 'analytics';
const TRAFFIC_DOC_ID = 'traffic';
const LOCAL_STORAGE_CACHE_KEY = 'sri_traffic_cache';

const DEFAULT_TRAFFIC_STATS: TrafficStats = {
  totalVisits: 0,
  todayVisits: 0,
  todayDate: new Date().toISOString().split('T')[0],
  activeNow: 0,
  pageViews: {},
  deviceBreakdown: {
    mobile: 0,
    desktop: 0,
    tablet: 0,
  },
  recentVisitors: [],
};

class FirebaseTrafficService {
  private cachedStats: TrafficStats = DEFAULT_TRAFFIC_STATS;

  constructor() {
    this.initLocalCache();
  }

  private initLocalCache() {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Clear any old mock stats (e.g. 1420 visits or dummy ids)
        if (
          parsed.totalVisits === 1420 ||
          parsed.recentVisitors?.some((v: { id?: string }) => v.id === 'vis-1')
        ) {
          localStorage.removeItem(LOCAL_STORAGE_CACHE_KEY);
          this.cachedStats = DEFAULT_TRAFFIC_STATS;
          return;
        }
        this.cachedStats = parsed;
      }
    } catch {
      this.cachedStats = DEFAULT_TRAFFIC_STATS;
    }
  }

  private saveLocalCache(stats: TrafficStats) {
    this.cachedStats = stats;
    try {
      localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(stats));
    } catch {
      // ignore quota limits
    }
  }

  /**
   * Records a page view / website visit in Firestore in real-time
   * Every record is authentic visitor data from real browsing sessions
   */
  async recordPageView(pathname: string): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    const deviceType = isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop';

    const newVisitEntry = {
      id: `vis-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      page: pathname || '/',
      timestamp: new Date().toISOString(),
      device: deviceType,
      referrer: document.referrer
        ? new URL(document.referrer, window.location.origin).pathname
        : 'Direct',
    };

    // Update local cache immediately
    const local = { ...this.cachedStats };
    local.totalVisits += 1;
    if (local.todayDate === today) {
      local.todayVisits += 1;
    } else {
      local.todayDate = today;
      local.todayVisits = 1;
    }
    const pathKey = pathname || '/';
    local.pageViews[pathKey] = (local.pageViews[pathKey] || 0) + 1;
    if (isMobile) local.deviceBreakdown.mobile += 1;
    else if (isTablet) local.deviceBreakdown.tablet += 1;
    else local.deviceBreakdown.desktop += 1;

    local.recentVisitors = [newVisitEntry, ...(local.recentVisitors || []).slice(0, 9)];
    // Active now: visitors within last 5 minutes
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    local.activeNow = local.recentVisitors.filter(
      (v) => new Date(v.timestamp).getTime() >= fiveMinutesAgo
    ).length;

    this.saveLocalCache(local);

    // Sync to Cloud Firestore
    try {
      const ref = doc(db, TRAFFIC_DOC_PATH, TRAFFIC_DOC_ID);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        await setDoc(ref, {
          totalVisits: local.totalVisits,
          todayVisits: local.todayVisits,
          todayDate: today,
          pageViews: local.pageViews,
          deviceBreakdown: local.deviceBreakdown,
          recentVisitors: local.recentVisitors,
          lastUpdatedAt: new Date().toISOString(),
        });
      } else {
        const data = snap.data();
        const docToday = data.todayDate;
        const resetToday = docToday !== today;
        const currentVisitors = Array.isArray(data.recentVisitors) ? data.recentVisitors : [];
        // Filter out any legacy dummy records
        const cleanVisitors = currentVisitors.filter((v: { id?: string }) => v.id !== 'vis-1');

        await updateDoc(ref, {
          totalVisits: increment(1),
          todayVisits: resetToday ? 1 : increment(1),
          todayDate: today,
          [`pageViews.${pathname.replace(/\//g, '_') || 'home'}`]: increment(1),
          [`deviceBreakdown.${deviceType.toLowerCase()}`]: increment(1),
          recentVisitors: [newVisitEntry, ...cleanVisitors.slice(0, 9)],
          lastUpdatedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn('Firestore traffic tracking non-blocking warning:', err);
    }
  }

  /**
   * Real-time subscription to authentic traffic and visitor metrics
   */
  subscribeToTraffic(callback: (stats: TrafficStats) => void): () => void {
    // Deliver local cache first
    callback(this.cachedStats);

    try {
      const ref = doc(db, TRAFFIC_DOC_PATH, TRAFFIC_DOC_ID);
      const unsubscribe = onSnapshot(
        ref,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            const rawVisitors = Array.isArray(data.recentVisitors) ? data.recentVisitors : [];
            // Remove any legacy mock visitor entries
            const cleanVisitors = rawVisitors.filter((v: { id?: string }) => v.id !== 'vis-1');

            // Calculate real active users from actual hits within the last 5 minutes
            const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
            const activeNowReal = cleanVisitors.filter(
              (v: { timestamp: string }) => new Date(v.timestamp).getTime() >= fiveMinutesAgo
            ).length;

            const normalized: TrafficStats = {
              totalVisits: data.totalVisits || 0,
              todayVisits: data.todayVisits || 0,
              todayDate: data.todayDate || new Date().toISOString().split('T')[0],
              activeNow: activeNowReal,
              pageViews: data.pageViews || {},
              deviceBreakdown: data.deviceBreakdown || { mobile: 0, desktop: 0, tablet: 0 },
              recentVisitors: cleanVisitors,
            };
            this.saveLocalCache(normalized);
            callback(normalized);
          } else {
            callback(this.cachedStats);
          }
        },
        (error) => {
          console.warn('Traffic onSnapshot warning, using cached:', error);
          callback(this.cachedStats);
        }
      );

      return unsubscribe;
    } catch (err) {
      console.warn('Could not establish traffic onSnapshot listener:', err);
      callback(this.cachedStats);
      return () => {};
    }
  }

  getStats(): TrafficStats {
    return this.cachedStats;
  }
}

export const firebaseTrafficService = new FirebaseTrafficService();
