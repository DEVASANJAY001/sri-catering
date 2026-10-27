import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../../config/firebase';

export interface VisitorEvent {
  id: string;
  sessionId: string;
  page: string;
  timestamp: string;
  deviceType: 'Mobile' | 'Tablet' | 'Desktop';
  os: string;
  browser: string;
  referrerSource: string;
  action?: string; // 'Page View' | 'WhatsApp Lead' | 'Phone Call' | 'Enquiry Form'
}

export interface TrafficStats {
  totalVisits: number; // Unique visitor sessions (all-time)
  totalPageViews: number; // Total page impressions (all-time)
  todayVisits: number; // Unique visitor sessions today
  todayPageViews: number; // Total page impressions today
  todayDate: string; // YYYY-MM-DD
  activeNow: number; // Live users active within last 2 minutes
  activeSessions: Record<string, { lastSeen: string; page: string; device: string }>;
  pageViews: Record<string, number>;
  deviceBreakdown: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  sourcesBreakdown: {
    direct: number;
    google: number;
    whatsapp: number;
    instagram: number;
    other: number;
  };
  conversions: {
    whatsappClicks: number;
    callClicks: number;
    enquirySubmissions: number;
  };
  recentVisitors: VisitorEvent[];
  lastUpdatedAt: string;
}

const TRAFFIC_DOC_PATH = 'analytics';
const TRAFFIC_DOC_ID = 'traffic';
const LOCAL_STORAGE_CACHE_KEY = 'sri_production_analytics_cache';
const SESSION_KEY = 'sri_active_session_id';
const SESSION_TIMESTAMP_KEY = 'sri_session_last_active';
const VISITOR_KEY = 'sri_persistent_visitor_id';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes of inactivity defines a new session
const PRESENCE_WINDOW_MS = 2 * 60 * 1000; // 2 minutes window for "Active Right Now"

const DEFAULT_TRAFFIC_STATS: TrafficStats = {
  totalVisits: 0,
  totalPageViews: 0,
  todayVisits: 0,
  todayPageViews: 0,
  todayDate: new Date().toISOString().split('T')[0],
  activeNow: 0,
  activeSessions: {},
  pageViews: {},
  deviceBreakdown: {
    mobile: 0,
    desktop: 0,
    tablet: 0,
  },
  sourcesBreakdown: {
    direct: 0,
    google: 0,
    whatsapp: 0,
    instagram: 0,
    other: 0,
  },
  conversions: {
    whatsappClicks: 0,
    callClicks: 0,
    enquirySubmissions: 0,
  },
  recentVisitors: [],
  lastUpdatedAt: new Date().toISOString(),
};

/**
 * Production Client Environment Detector
 * Accurately extracts real device type, operating system, and web browser
 */
function detectClientEnvironment() {
  if (typeof window === 'undefined') {
    return { deviceType: 'Desktop' as const, os: 'Server', browser: 'Node' };
  }

  const ua = navigator.userAgent || '';
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) ||
    window.innerWidth < 768;
  const isTablet =
    /iPad|tablet/i.test(ua) || (window.innerWidth >= 768 && window.innerWidth < 1024);
  const deviceType: 'Mobile' | 'Tablet' | 'Desktop' =
    isMobile && !isTablet ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop';

  let os = 'Other';
  if (/Windows/i.test(ua)) os = 'Windows';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Macintosh|Mac OS X/i.test(ua)) os = 'macOS';
  else if (/Linux/i.test(ua)) os = 'Linux';

  let browser = 'Browser';
  if (/Chrome/i.test(ua) && !/Edge|OPR/i.test(ua)) browser = 'Chrome';
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
  else if (/Firefox/i.test(ua)) browser = 'Firefox';
  else if (/Edge/i.test(ua)) browser = 'Edge';
  else if (/Opera|OPR/i.test(ua)) browser = 'Opera';

  return { deviceType, os, browser };
}

/**
 * Production Traffic Source Attribution
 * Categorizes real referrers: Google, WhatsApp, Instagram, Direct, or External
 */
function detectReferrerSource(): {
  sourceName: string;
  sourceCategory: 'direct' | 'google' | 'whatsapp' | 'instagram' | 'other';
} {
  if (typeof window === 'undefined') {
    return { sourceName: 'Direct Visit', sourceCategory: 'direct' };
  }

  const ref = document.referrer || '';
  if (!ref) {
    const params = new URLSearchParams(window.location.search);
    const sourceParam = params.get('utm_source') || params.get('ref');
    if (sourceParam) {
      const lower = sourceParam.toLowerCase();
      if (lower.includes('whatsapp'))
        return { sourceName: 'WhatsApp Shared Link', sourceCategory: 'whatsapp' };
      if (lower.includes('instagram'))
        return { sourceName: 'Instagram Bio / Story', sourceCategory: 'instagram' };
      if (lower.includes('google'))
        return { sourceName: 'Google Search Ads', sourceCategory: 'google' };
      return { sourceName: sourceParam, sourceCategory: 'other' };
    }
    return { sourceName: 'Direct Visit', sourceCategory: 'direct' };
  }

  const lowerRef = ref.toLowerCase();
  if (lowerRef.includes('google.'))
    return { sourceName: 'Google Search', sourceCategory: 'google' };
  if (lowerRef.includes('whatsapp'))
    return { sourceName: 'WhatsApp Share', sourceCategory: 'whatsapp' };
  if (lowerRef.includes('instagram.com'))
    return { sourceName: 'Instagram App', sourceCategory: 'instagram' };
  if (lowerRef.includes('facebook.com'))
    return { sourceName: 'Facebook', sourceCategory: 'other' };

  try {
    const url = new URL(ref);
    if (url.origin === window.location.origin) {
      return { sourceName: 'Direct Visit', sourceCategory: 'direct' };
    }
    return { sourceName: url.hostname, sourceCategory: 'other' };
  } catch {
    return { sourceName: 'Referral', sourceCategory: 'other' };
  }
}

/**
 * Session Lifecycle Algorithm
 * Distinguishes unique visitor sessions from simple page impressions
 */
function getOrCreateSession(): { sessionId: string; isNewSession: boolean; visitorId: string } {
  if (typeof window === 'undefined') {
    return { sessionId: 'server', isNewSession: false, visitorId: 'server' };
  }

  let visitorId = localStorage.getItem(VISITOR_KEY);
  if (!visitorId) {
    visitorId = `vst-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    localStorage.setItem(VISITOR_KEY, visitorId);
  }

  const now = Date.now();
  const existingSessionId = sessionStorage.getItem(SESSION_KEY);
  const lastActiveStr = sessionStorage.getItem(SESSION_TIMESTAMP_KEY);
  const lastActive = lastActiveStr ? parseInt(lastActiveStr, 10) : 0;

  if (existingSessionId && now - lastActive < SESSION_TIMEOUT_MS) {
    sessionStorage.setItem(SESSION_TIMESTAMP_KEY, now.toString());
    return { sessionId: existingSessionId, isNewSession: false, visitorId };
  }

  const newSessionId = `ses-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  sessionStorage.setItem(SESSION_KEY, newSessionId);
  sessionStorage.setItem(SESSION_TIMESTAMP_KEY, now.toString());
  return { sessionId: newSessionId, isNewSession: true, visitorId };
}

/**
 * Clean & Format Firestore Page Key (Firestore doesn't allow slashes in field paths)
 */
function formatPageKey(path: string): string {
  if (!path || path === '/') return 'page_home';
  return `page_${path.replace(/[^a-zA-Z0-9]/g, '_').replace(/^_+|_+$/g, '')}`;
}

export class FirebaseTrafficService {
  private cachedStats: TrafficStats = DEFAULT_TRAFFIC_STATS;

  constructor() {
    this.initLocalCache();
  }

  private initLocalCache() {
    try {
      if (typeof window === 'undefined') return;
      const raw = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        this.cachedStats = {
          ...DEFAULT_TRAFFIC_STATS,
          ...parsed,
          deviceBreakdown: {
            ...DEFAULT_TRAFFIC_STATS.deviceBreakdown,
            ...(parsed.deviceBreakdown || {}),
          },
          sourcesBreakdown: {
            ...DEFAULT_TRAFFIC_STATS.sourcesBreakdown,
            ...(parsed.sourcesBreakdown || {}),
          },
          conversions: {
            ...DEFAULT_TRAFFIC_STATS.conversions,
            ...(parsed.conversions || {}),
          },
        };
      }
    } catch {
      this.cachedStats = DEFAULT_TRAFFIC_STATS;
    }
  }

  private saveLocalCache(stats: TrafficStats) {
    this.cachedStats = stats;
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(stats));
      }
    } catch {
      // ignore quota limits
    }
  }

  /**
   * Production Page View Tracking Algorithm
   * - Records genuine page impression
   * - If first pageview of session, increments unique session visitor count
   * - Records active presence in Firestore
   */
  async recordPageView(pathname: string): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const { deviceType, os, browser } = detectClientEnvironment();
    const { sourceName, sourceCategory } = detectReferrerSource();
    const { sessionId, isNewSession } = getOrCreateSession();
    const timestamp = new Date().toISOString();

    const visitEvent: VisitorEvent = {
      id: `evt-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      sessionId,
      page: pathname || '/',
      timestamp,
      deviceType,
      os,
      browser,
      referrerSource: sourceName,
      action: 'Page View',
    };

    // 1. Update in-memory & local cache immediately
    const local = { ...this.cachedStats };
    local.totalPageViews = (local.totalPageViews || 0) + 1;

    if (local.todayDate === today) {
      local.todayPageViews = (local.todayPageViews || 0) + 1;
    } else {
      local.todayDate = today;
      local.todayVisits = 0;
      local.todayPageViews = 1;
    }

    if (isNewSession) {
      local.totalVisits = (local.totalVisits || 0) + 1;
      local.todayVisits = (local.todayVisits || 0) + 1;
      const devKey = deviceType.toLowerCase() as 'mobile' | 'desktop' | 'tablet';
      local.deviceBreakdown[devKey] = (local.deviceBreakdown[devKey] || 0) + 1;
      local.sourcesBreakdown[sourceCategory] = (local.sourcesBreakdown[sourceCategory] || 0) + 1;
    }

    const pageKey = formatPageKey(pathname);
    local.pageViews[pageKey] = (local.pageViews[pageKey] || 0) + 1;

    // Active session presence
    const activeSessions = { ...(local.activeSessions || {}) };
    activeSessions[sessionId] = {
      lastSeen: timestamp,
      page: pathname || '/',
      device: deviceType,
    };

    // Calculate Active Now: sessions active within last 2 minutes
    const nowMs = Date.now();
    let realActiveNow = 0;
    const prunedSessions: Record<string, any> = {};

    for (const [sId, sData] of Object.entries(activeSessions)) {
      const lastSeenMs = new Date(sData.lastSeen).getTime();
      if (nowMs - lastSeenMs < PRESENCE_WINDOW_MS) {
        realActiveNow++;
        prunedSessions[sId] = sData;
      }
    }

    local.activeSessions = prunedSessions;
    local.activeNow = Math.max(1, realActiveNow);
    local.recentVisitors = [visitEvent, ...(local.recentVisitors || []).slice(0, 11)];
    local.lastUpdatedAt = timestamp;

    this.saveLocalCache(local);

    // 2. Commit real analytics to Cloud Firestore
    try {
      const ref = doc(db, TRAFFIC_DOC_PATH, TRAFFIC_DOC_ID);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        await setDoc(ref, {
          totalVisits: local.totalVisits,
          totalPageViews: local.totalPageViews,
          todayVisits: local.todayVisits,
          todayPageViews: local.todayPageViews,
          todayDate: today,
          activeNow: local.activeNow,
          pageViews: local.pageViews,
          deviceBreakdown: local.deviceBreakdown,
          sourcesBreakdown: local.sourcesBreakdown,
          conversions: local.conversions,
          activeSessions: local.activeSessions,
          recentVisitors: local.recentVisitors,
          lastUpdatedAt: timestamp,
        });
      } else {
        const firestoreData = snap.data();
        const resetToday = firestoreData.todayDate !== today;

        const updatePayload: Record<string, any> = {
          totalPageViews: increment(1),
          todayPageViews: resetToday ? 1 : increment(1),
          todayDate: today,
          [`pageViews.${pageKey}`]: increment(1),
          [`activeSessions.${sessionId}`]: {
            lastSeen: timestamp,
            page: pathname || '/',
            device: deviceType,
          },
          recentVisitors: [visitEvent, ...(firestoreData.recentVisitors || []).slice(0, 11)],
          lastUpdatedAt: timestamp,
        };

        if (isNewSession) {
          updatePayload.totalVisits = increment(1);
          updatePayload.todayVisits = resetToday ? 1 : increment(1);
          updatePayload[`deviceBreakdown.${deviceType.toLowerCase()}`] = increment(1);
          updatePayload[`sourcesBreakdown.${sourceCategory}`] = increment(1);
        }

        await updateDoc(ref, updatePayload);
      }
    } catch (err) {
      console.warn('Firestore analytics update notice:', err);
    }
  }

  /**
   * Tracks real user interactions and business conversions:
   * - WhatsApp clicks
   * - Direct Phone calls
   * - Enquiry submissions
   */
  async recordEvent(
    action: 'whatsapp_click' | 'call_click' | 'enquiry_submitted',
    details?: string
  ): Promise<void> {
    const { deviceType, os, browser } = detectClientEnvironment();
    const { sessionId } = getOrCreateSession();
    const timestamp = new Date().toISOString();

    const actionLabel =
      action === 'whatsapp_click'
        ? 'WhatsApp Lead'
        : action === 'call_click'
        ? 'Phone Call'
        : 'Enquiry Form';

    const eventEntry: VisitorEvent = {
      id: `evt-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      sessionId,
      page: details || (typeof window !== 'undefined' ? window.location.pathname : '/'),
      timestamp,
      deviceType,
      os,
      browser,
      referrerSource: actionLabel,
      action: actionLabel,
    };

    // Update local cache
    const local = { ...this.cachedStats };
    if (!local.conversions) {
      local.conversions = { whatsappClicks: 0, callClicks: 0, enquirySubmissions: 0 };
    }

    if (action === 'whatsapp_click') local.conversions.whatsappClicks += 1;
    if (action === 'call_click') local.conversions.callClicks += 1;
    if (action === 'enquiry_submitted') local.conversions.enquirySubmissions += 1;

    local.recentVisitors = [eventEntry, ...(local.recentVisitors || []).slice(0, 11)];
    local.lastUpdatedAt = timestamp;
    this.saveLocalCache(local);

    try {
      const ref = doc(db, TRAFFIC_DOC_PATH, TRAFFIC_DOC_ID);
      const conversionField =
        action === 'whatsapp_click'
          ? 'conversions.whatsappClicks'
          : action === 'call_click'
          ? 'conversions.callClicks'
          : 'conversions.enquirySubmissions';

      await updateDoc(ref, {
        [conversionField]: increment(1),
        recentVisitors: [eventEntry, ...(local.recentVisitors || []).slice(0, 11)],
        lastUpdatedAt: timestamp,
      });
    } catch (err) {
      console.warn('Firestore conversion event tracking notice:', err);
    }
  }

  /**
   * Heartbeat Presence Keeper:
   * Keeps active visitor presence alive in Firestore while the user is reading or browsing
   */
  async recordHeartbeat(): Promise<void> {
    if (typeof window === 'undefined') return;
    const { sessionId } = getOrCreateSession();
    const { deviceType } = detectClientEnvironment();
    const pathname = window.location.pathname;
    const timestamp = new Date().toISOString();

    const local = { ...this.cachedStats };
    const activeSessions = { ...(local.activeSessions || {}) };
    activeSessions[sessionId] = {
      lastSeen: timestamp,
      page: pathname,
      device: deviceType,
    };

    const nowMs = Date.now();
    let activeCount = 0;
    const pruned: Record<string, any> = {};

    for (const [sId, sData] of Object.entries(activeSessions)) {
      const lastSeenMs = new Date(sData.lastSeen).getTime();
      if (nowMs - lastSeenMs < PRESENCE_WINDOW_MS) {
        activeCount++;
        pruned[sId] = sData;
      }
    }

    local.activeSessions = pruned;
    local.activeNow = Math.max(1, activeCount);
    this.saveLocalCache(local);

    try {
      const ref = doc(db, TRAFFIC_DOC_PATH, TRAFFIC_DOC_ID);
      await updateDoc(ref, {
        [`activeSessions.${sessionId}`]: {
          lastSeen: timestamp,
          page: pathname,
          device: deviceType,
        },
        lastUpdatedAt: timestamp,
      });
    } catch (err) {
      console.warn('Heartbeat presence update notice:', err);
    }
  }

  /**
   * Real-time subscription to authentic production analytics from Cloud Firestore
   */
  subscribeToTraffic(callback: (stats: TrafficStats) => void): () => void {
    callback(this.cachedStats);

    try {
      const ref = doc(db, TRAFFIC_DOC_PATH, TRAFFIC_DOC_ID);
      const unsubscribe = onSnapshot(
        ref,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            const rawVisitors = Array.isArray(data.recentVisitors) ? data.recentVisitors : [];
            const activeSessions = data.activeSessions || {};

            // Calculate true live active presence
            const nowMs = Date.now();
            let liveActiveNow = 0;
            for (const sData of Object.values(activeSessions) as any[]) {
              if (sData?.lastSeen) {
                const diff = nowMs - new Date(sData.lastSeen).getTime();
                if (diff < PRESENCE_WINDOW_MS) {
                  liveActiveNow++;
                }
              }
            }

            const normalized: TrafficStats = {
              totalVisits: Number(data.totalVisits) || 0,
              totalPageViews: Number(data.totalPageViews) || Number(data.totalVisits) || 0,
              todayVisits: Number(data.todayVisits) || 0,
              todayPageViews: Number(data.todayPageViews) || Number(data.todayVisits) || 0,
              todayDate: data.todayDate || new Date().toISOString().split('T')[0],
              activeNow: liveActiveNow,
              activeSessions,
              pageViews: data.pageViews || {},
              deviceBreakdown: {
                mobile: Number(data.deviceBreakdown?.mobile) || 0,
                desktop: Number(data.deviceBreakdown?.desktop) || 0,
                tablet: Number(data.deviceBreakdown?.tablet) || 0,
              },
              sourcesBreakdown: {
                direct: Number(data.sourcesBreakdown?.direct) || 0,
                google: Number(data.sourcesBreakdown?.google) || 0,
                whatsapp: Number(data.sourcesBreakdown?.whatsapp) || 0,
                instagram: Number(data.sourcesBreakdown?.instagram) || 0,
                other: Number(data.sourcesBreakdown?.other) || 0,
              },
              conversions: {
                whatsappClicks: Number(data.conversions?.whatsappClicks) || 0,
                callClicks: Number(data.conversions?.callClicks) || 0,
                enquirySubmissions: Number(data.conversions?.enquirySubmissions) || 0,
              },
              recentVisitors: rawVisitors,
              lastUpdatedAt: data.lastUpdatedAt || new Date().toISOString(),
            };

            this.saveLocalCache(normalized);
            callback(normalized);
          } else {
            callback(this.cachedStats);
          }
        },
        (error) => {
          console.warn('Traffic realtime onSnapshot warning:', error);
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

  /**
   * Resets all analytics data in Firestore & local cache to an authentic clean state (0 fake data)
   */
  async resetAnalytics(): Promise<{ success: boolean; error?: string }> {
    const today = new Date().toISOString().split('T')[0];
    const clean: TrafficStats = {
      totalVisits: 0,
      totalPageViews: 0,
      todayVisits: 0,
      todayPageViews: 0,
      todayDate: today,
      activeNow: 1,
      activeSessions: {},
      pageViews: {},
      deviceBreakdown: { mobile: 0, desktop: 0, tablet: 0 },
      sourcesBreakdown: { direct: 0, google: 0, whatsapp: 0, instagram: 0, other: 0 },
      conversions: { whatsappClicks: 0, callClicks: 0, enquirySubmissions: 0 },
      recentVisitors: [],
      lastUpdatedAt: new Date().toISOString(),
    };

    this.saveLocalCache(clean);

    try {
      const ref = doc(db, TRAFFIC_DOC_PATH, TRAFFIC_DOC_ID);
      await setDoc(ref, clean);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  getStats(): TrafficStats {
    return this.cachedStats;
  }
}

export const firebaseTrafficService = new FirebaseTrafficService();
