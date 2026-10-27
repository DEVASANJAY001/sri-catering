import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Inbox,
  Clock,
  CheckCircle2,
  FileText,
  Download,
  ArrowRight,
  TrendingUp,
  Calendar,
  Phone,
  Sparkles,
  Activity,
  Globe,
  Smartphone,
  Monitor,
  Check,
  RefreshCw,
  MessageCircle,
  Flame,
  Award,
  RotateCcw,
} from 'lucide-react';
import { enquiryService, DashboardStats } from '../../services/enquiries';
import { firebaseTrafficService, TrafficStats } from '../../services/analytics/FirebaseTrafficService';
import { StatsCard } from '../../components/cards/StatsCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { getStatusBadgeVariant, formatEventDate } from '../../utils/formatters';
import { downloadCsv } from '../../utils/exportCsv';
import { useAuth } from '../../hooks/useAuth';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [traffic, setTraffic] = useState<TrafficStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isResettingTraffic, setIsResettingTraffic] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>(new Date().toLocaleTimeString());

  const handleResetTraffic = async () => {
    if (!window.confirm('Reset website analytics to 0 authentic clean state?')) return;
    setIsResettingTraffic(true);
    try {
      await firebaseTrafficService.resetAnalytics();
      await loadDashboardData(false);
    } catch (err: any) {
      alert(`Could not reset analytics: ${err.message}`);
    } finally {
      setIsResettingTraffic(false);
    }
  };

  useEffect(() => {
    loadDashboardData();

    // Subscribe to real-time website traffic metrics
    const unsubTraffic = firebaseTrafficService.subscribeToTraffic((data) => {
      setTraffic(data);
    });

    // Subscribe to live incoming customer enquiries
    let unsubEnquiries: (() => void) | undefined;
    if (enquiryService.subscribeToEnquiries) {
      unsubEnquiries = enquiryService.subscribeToEnquiries(() => {
        loadDashboardData(false);
      });
    }

    return () => {
      unsubTraffic();
      if (unsubEnquiries) unsubEnquiries();
    };
  }, []);

  const loadDashboardData = async (showMainSpinner = true) => {
    if (showMainSpinner) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const data = await enquiryService.getDashboardStats();
      setStats(data);
      setLastSyncTime(new Date().toLocaleTimeString());
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      const csv = await enquiryService.exportEnquiriesToCsv();
      downloadCsv(csv, `sri_caterers_all_enquiries_${new Date().toISOString().split('T')[0]}.csv`);
    } finally {
      setIsExporting(false);
    }
  };

  // Helper to format page paths into customer-friendly labels
  const formatPageLabel = (rawKey: string): { name: string; url: string } => {
    const clean = rawKey
      .replace(/^page_/, '')
      .replace(/^_+/, '')
      .replace(/\//g, '_')
      .toLowerCase();

    if (!clean || clean === 'home') return { name: 'Homepage (முக்கிய பக்கம்)', url: '/' };
    if (clean.includes('tamil_wedding') || clean.includes('tamil-wedding')) return { name: 'Tamil Wedding Catering', url: '/services/tamil-wedding-catering' };
    if (clean.includes('a_to_z') || clean.includes('a-to-z')) return { name: 'A to Z Wedding Service', url: '/services/a-to-z-wedding-service' };
    if (clean.includes('ac_wedding') || clean.includes('ac-wedding')) return { name: 'A/C Wedding Hall Booking', url: '/services/ac-wedding-hall' };
    if (clean.includes('traditional_family') || clean.includes('traditional-family')) return { name: 'Traditional Family Functions', url: '/services/traditional-family-functions' };
    if (clean.includes('housewarming')) return { name: 'Housewarming Ceremonies', url: '/services/housewarming-ceremonies' };
    if (clean.includes('temple')) return { name: 'Temple & Religious Annadhanam', url: '/services/temple-religious-functions' };
    if (clean.includes('birthday')) return { name: 'Birthday & Anniversary', url: '/services/birthday-anniversary-catering' };
    if (clean.includes('bulk')) return { name: 'Bulk Meal & Live Stalls', url: '/services/bulk-meal-orders-live-stalls' };
    if (clean.includes('corporate')) return { name: 'Corporate Catering', url: '/services/corporate-catering' };
    if (clean.includes('festival')) return { name: 'Festival Catering Feasts', url: '/services/festival-catering' };
    if (clean.includes('menu')) return { name: 'Menu Card & Tariff Packages', url: '/menu' };
    if (clean.includes('gallery')) return { name: 'Photo & Video Gallery', url: '/gallery' };
    if (clean.includes('contact')) return { name: 'Contact & Location Window', url: '/contact' };
    if (clean.includes('enquiry')) return { name: 'Online Booking & Enquiry', url: '/enquiry' };
    if (clean.includes('about')) return { name: 'About Sri Caterers', url: '/about' };
    return { name: clean.replace(/_/g, ' '), url: `/${clean.replace(/_/g, '/')}` };
  };

  if (isLoading || !stats) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner size="lg" text="Connecting to Cloud Firestore & Live Visitor Stream..." />
      </div>
    );
  }

  // Calculate authentic live conversion rate
  const totalLeads = (stats.totalEnquiries || 0) + (traffic?.conversions?.whatsappClicks || 0) + (traffic?.conversions?.callClicks || 0);
  const totalUniqueVisits = traffic?.totalVisits ?? 0;
  const conversionRate = totalUniqueVisits > 0
    ? Math.min(100, Math.round((totalLeads / totalUniqueVisits) * 1000) / 10)
    : 0;

  // Extract Top 5 Visited Catering Pages from real Firestore analytics
  const sortedPages = traffic?.pageViews
    ? Object.entries(traffic.pageViews)
        .map(([key, count]) => ({ key, count: Number(count) || 0, ...formatPageLabel(key) }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
    : [];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome & Live Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-xs font-bold text-gold-dark uppercase tracking-wider block">
              Administrative Control Center
            </span>
            <span className="text-stone-300">•</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Firebase Live Database: sricatering-64043
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-[11px] text-stone-500 font-medium flex items-center">
              Synced {lastSyncTime}
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-maroon-950 mt-0.5">
            Vanakkam, {user?.displayName || 'Admin'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Real-time status of catering enquiries, client bookings, and active website visitor sessions.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={() => loadDashboardData(false)}
            disabled={isRefreshing}
            title="Refresh real-time data from Firestore"
            className="inline-flex items-center px-3.5 py-2.5 rounded-xl border border-stone-200 hover:border-maroon-800 bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-stone-700 transition-colors shadow-2xs cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 text-stone-600 ${isRefreshing ? 'animate-spin text-maroon-800' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Data'}</span>
          </button>

          <button
            onClick={handleExportCsv}
            disabled={isExporting}
            className="inline-flex items-center px-3.5 py-2.5 rounded-xl border border-stone-300 hover:border-maroon-800 bg-white text-xs font-semibold text-stone-700 hover:text-maroon-900 transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-stone-500" />
            <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
          </button>

          <Link
            to="/admin/enquiries"
            className="inline-flex items-center px-4 py-2.5 rounded-xl bg-maroon-800 hover:bg-maroon-900 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
          >
            <Inbox className="w-4 h-4 mr-2 text-gold" />
            <span>Manage All Enquiries</span>
          </Link>
        </div>
      </div>

      {/* Real-Time Live Traffic & Website Monitoring System (Firebase Synchronized) */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-maroon-950 text-white rounded-3xl p-6 sm:p-8 border border-amber-500/25 shadow-xl relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
        
        {/* Header with Live Heartbeat */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-center space-x-3">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
            </span>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-black text-white flex items-center">
                Firebase Real-Time Analytics &amp; Visitor Stream
              </h2>
              <p className="text-xs text-amber-300/80">
                100% authentic visitor sessions, real-time presence, and lead conversion metrics
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 font-semibold shadow-xs">
              <Activity className="w-3.5 h-3.5 mr-1.5 text-emerald-400 animate-pulse" />
              Live Presence Stream Active
            </span>
            <button
              onClick={handleResetTraffic}
              disabled={isResettingTraffic}
              title="Reset analytics data to authentic zero state"
              className="inline-flex items-center px-3 py-1 rounded-full bg-stone-800/90 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer text-[11px] disabled:opacity-50"
            >
              <RotateCcw className={`w-3 h-3 mr-1 text-amber-400 ${isResettingTraffic ? 'animate-spin' : ''}`} />
              <span>{isResettingTraffic ? 'Resetting...' : 'Reset to Clean 0'}</span>
            </button>
          </div>
        </div>

        {/* Primary Traffic Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          {/* Active Now */}
          <div className="bg-stone-950/70 border border-stone-800/80 rounded-2xl p-4 space-y-1 hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center justify-between text-xs text-stone-400 font-medium">
              <span>Active Right Now</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 flex items-center">
              {traffic?.activeNow ?? 0}
              {(traffic?.activeNow ?? 0) > 0 && (
                <span className="ml-2 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              )}
            </p>
            <p className="text-[11px] text-stone-400">Live users active in last 2 mins</p>
          </div>

          {/* Today's Visits */}
          <div className="bg-stone-950/70 border border-stone-800/80 rounded-2xl p-4 space-y-1 hover:border-amber-500/40 transition-colors">
            <div className="flex items-center justify-between text-xs text-stone-400 font-medium">
              <span>Today&apos;s Traffic</span>
              <Globe className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-amber-300">
              {(traffic?.todayVisits ?? 0).toLocaleString()}
            </p>
            <p className="text-[11px] text-stone-400">
              {(traffic?.todayPageViews ?? 0).toLocaleString()} page views today
            </p>
          </div>

          {/* Total Lifetime Visits */}
          <div className="bg-stone-950/70 border border-stone-800/80 rounded-2xl p-4 space-y-1 hover:border-gold/40 transition-colors">
            <div className="flex items-center justify-between text-xs text-stone-400 font-medium">
              <span>All-Time Sessions</span>
              <TrendingUp className="w-4 h-4 text-gold" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">
              {(traffic?.totalVisits ?? 0).toLocaleString()}
            </p>
            <p className="text-[11px] text-stone-400">
              {(traffic?.totalPageViews ?? 0).toLocaleString()} lifetime page views
            </p>
          </div>

          {/* Device Breakdown */}
          <div className="bg-stone-950/70 border border-stone-800/80 rounded-2xl p-4 space-y-2 hover:border-blue-500/40 transition-colors">
            <div className="flex items-center justify-between text-xs text-stone-400 font-medium">
              <span>Traffic by Device</span>
              <Smartphone className="w-4 h-4 text-blue-400" />
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-[11px] font-semibold">
                <span className="text-stone-300 flex items-center">
                  <Smartphone className="w-3 h-3 mr-1 text-amber-400" /> Mobile
                </span>
                <span className="text-amber-400 font-bold">
                  {traffic && (traffic.deviceBreakdown.mobile + traffic.deviceBreakdown.desktop > 0)
                    ? Math.round((traffic.deviceBreakdown.mobile / (traffic.deviceBreakdown.mobile + traffic.deviceBreakdown.desktop + (traffic.deviceBreakdown.tablet || 0))) * 100)
                    : 0}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-stone-800 overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{
                    width: `${traffic && (traffic.deviceBreakdown.mobile + traffic.deviceBreakdown.desktop > 0)
                      ? Math.round((traffic.deviceBreakdown.mobile / (traffic.deviceBreakdown.mobile + traffic.deviceBreakdown.desktop + (traffic.deviceBreakdown.tablet || 0))) * 100)
                      : 0}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-stone-400">
                <span className="flex items-center">
                  <Monitor className="w-2.5 h-2.5 mr-1 text-stone-400" /> Desktop
                </span>
                <span>
                  {traffic && (traffic.deviceBreakdown.mobile + traffic.deviceBreakdown.desktop > 0)
                    ? Math.round((traffic.deviceBreakdown.desktop / (traffic.deviceBreakdown.mobile + traffic.deviceBreakdown.desktop + (traffic.deviceBreakdown.tablet || 0))) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Traffic Sources Attribution Row */}
        {traffic?.sourcesBreakdown && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-stone-800/60 relative z-10 text-xs">
            <div className="bg-stone-950/50 rounded-xl px-3 py-2 border border-stone-800/50 flex items-center justify-between">
              <span className="text-stone-400 text-[11px]">Direct / Bookmark</span>
              <span className="font-bold text-amber-300">{traffic.sourcesBreakdown.direct ?? 0}</span>
            </div>
            <div className="bg-stone-950/50 rounded-xl px-3 py-2 border border-stone-800/50 flex items-center justify-between">
              <span className="text-stone-400 text-[11px]">Google Search</span>
              <span className="font-bold text-emerald-400">{traffic.sourcesBreakdown.google ?? 0}</span>
            </div>
            <div className="bg-stone-950/50 rounded-xl px-3 py-2 border border-stone-800/50 flex items-center justify-between">
              <span className="text-stone-400 text-[11px]">WhatsApp Shares</span>
              <span className="font-bold text-emerald-300">{traffic.sourcesBreakdown.whatsapp ?? 0}</span>
            </div>
            <div className="bg-stone-950/50 rounded-xl px-3 py-2 border border-stone-800/50 flex items-center justify-between">
              <span className="text-stone-400 text-[11px]">Instagram / Social</span>
              <span className="font-bold text-purple-300">{traffic.sourcesBreakdown.instagram ?? 0}</span>
            </div>
          </div>
        )}

        {/* Real-time Lead & Conversion Performance Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-stone-800/80 relative z-10">
          <div className="bg-stone-950/60 rounded-xl p-3 border border-stone-800/60 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-950/80 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-stone-400 font-semibold uppercase">WhatsApp Leads</p>
              <p className="text-base sm:text-lg font-black text-emerald-300">
                {traffic?.conversions?.whatsappClicks ?? 0}
              </p>
            </div>
          </div>

          <div className="bg-stone-950/60 rounded-xl p-3 border border-stone-800/60 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-amber-950/80 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-stone-400 font-semibold uppercase">Phone Call Leads</p>
              <p className="text-base sm:text-lg font-black text-amber-300">
                {traffic?.conversions?.callClicks ?? 0}
              </p>
            </div>
          </div>

          <div className="bg-stone-950/60 rounded-xl p-3 border border-stone-800/60 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-purple-950/80 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/30">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-stone-400 font-semibold uppercase">Online Enquiries</p>
              <p className="text-base sm:text-lg font-black text-purple-300">
                {stats.totalEnquiries}
              </p>
            </div>
          </div>

          <div className="bg-stone-950/60 rounded-xl p-3 border border-stone-800/60 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-rose-950/80 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-stone-400 font-semibold uppercase">Conversion Rate</p>
              <p className="text-base sm:text-lg font-black text-rose-300">
                {conversionRate}%
              </p>
            </div>
          </div>
        </div>

        {/* Live Visitor Activity Stream */}
        {traffic?.recentVisitors && traffic.recentVisitors.length > 0 && (
          <div className="pt-3 border-t border-stone-800/80 relative z-10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-300/90 uppercase tracking-wider flex items-center">
                <Flame className="w-3.5 h-3.5 mr-1 text-gold" />
                Live Visitor Activity Stream (Real-Time Sessions):
              </span>
              <span className="text-[10px] text-stone-400">Synchronized via Cloud Firestore</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {traffic.recentVisitors.slice(0, 8).map((vis) => (
                <div
                  key={vis.id}
                  className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-stone-950/90 border border-stone-800 text-xs shadow-xs"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      vis.action && vis.action !== 'Page View' ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'
                    }`}
                  />
                  <span className="font-mono text-amber-200 font-semibold">{vis.page}</span>
                  {vis.action && vis.action !== 'Page View' && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {vis.action}
                    </span>
                  )}
                  <span className="text-stone-400 text-[10px]">
                    {vis.deviceType} {vis.os ? `• ${vis.os}` : ''}
                  </span>
                  {vis.referrerSource && vis.referrerSource !== 'Internal Navigation' && (
                    <span className="text-[9px] text-stone-500 font-mono">[{vis.referrerSource}]</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Total Inquiries"
          count={stats.totalEnquiries}
          icon={<FileText className="w-6 h-6" />}
          variant="stone"
          subtitle="All recorded events in database"
          onClick={() => navigate('/admin/enquiries')}
        />
        <StatsCard
          title="New Inquiries"
          count={stats.newEnquiries}
          icon={<Sparkles className="w-6 h-6" />}
          variant="blue"
          subtitle="Awaiting first contact"
          onClick={() => navigate('/admin/enquiries?status=New')}
        />
        <StatsCard
          title="Confirmed Bookings"
          count={stats.confirmedEnquiries}
          icon={<CheckCircle2 className="w-6 h-6" />}
          variant="emerald"
          subtitle="Advance token received"
          onClick={() => navigate('/admin/enquiries?status=Confirmed')}
        />
        <StatsCard
          title="Follow-up Required"
          count={stats.followUpEnquiries}
          icon={<Clock className="w-6 h-6" />}
          variant="amber"
          subtitle="Needs active phone follow-up"
          onClick={() => navigate('/admin/enquiries?status=Follow-up Required')}
        />
      </div>

      {/* Secondary Status Pipeline Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-xs transition-shadow">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wide">Contacted</span>
          <p className="text-xl sm:text-2xl font-black text-amber-700 mt-1">{stats.contactedEnquiries}</p>
          <span className="text-[10px] text-stone-400">Discussion in progress</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-xs transition-shadow">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wide">Quotation Sent</span>
          <p className="text-xl sm:text-2xl font-black text-purple-700 mt-1">{stats.quotationSentEnquiries}</p>
          <span className="text-[10px] text-stone-400">Menu breakdown delivered</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-xs transition-shadow">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wide">Closed Feasts</span>
          <p className="text-xl sm:text-2xl font-black text-emerald-800 mt-1">{stats.closedEnquiries}</p>
          <span className="text-[10px] text-stone-400">Feast completed successfully</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-xs transition-shadow">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wide">Cancelled</span>
          <p className="text-xl sm:text-2xl font-black text-rose-700 mt-1">{stats.cancelledEnquiries}</p>
          <span className="text-[10px] text-stone-400">Date unavailable or dropped</span>
        </div>
      </div>

      {/* Middle Section: Status Pipeline & Event Type Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Status Pipeline Progress Bars */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-maroon-950 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-gold-dark" />
              Inquiries Pipeline by Status
            </h3>
            <span className="text-xs text-stone-500 font-semibold bg-stone-100 px-2.5 py-1 rounded-full">
              {stats.totalEnquiries} Active Records
            </span>
          </div>

          <div className="space-y-3.5">
            {Object.entries(stats.enquiriesByStatus).map(([statusName, count]) => {
              const num = count || 0;
              const percent = stats.totalEnquiries > 0 ? Math.round((num / stats.totalEnquiries) * 100) : 0;
              const badgeStyle = getStatusBadgeVariant(statusName);

              return (
                <div key={statusName} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-stone-700">
                    <span className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${badgeStyle.dot}`} />
                      {statusName}
                    </span>
                    <span>
                      {num} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${badgeStyle.dot}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Breakdown by Event Type & Top Visited Catering Sections */}
        <div className="lg:col-span-6 space-y-6">
          {/* Event Types Distribution */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-maroon-950 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-maroon-700" />
                Inquiries by Event Type
              </h3>
              <span className="text-xs text-stone-400 font-medium">Real Distribution</span>
            </div>

            <div className="space-y-3">
              {Object.entries(stats.enquiriesByEventType).length === 0 ? (
                <p className="text-xs text-stone-500 py-4 text-center">No event data available yet.</p>
              ) : (
                Object.entries(stats.enquiriesByEventType).map(([eventType, count]) => {
                  const percent = stats.totalEnquiries > 0 ? Math.round((count / stats.totalEnquiries) * 100) : 0;
                  return (
                    <div key={eventType} className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between hover:bg-stone-100/70 transition-colors">
                      <div>
                        <p className="text-xs font-bold text-charcoal">{eventType}</p>
                        <p className="text-[11px] text-stone-500">{percent}% of enquiries</p>
                      </div>
                      <span className="text-sm font-black text-maroon-900 bg-white px-2.5 py-1 rounded-lg border border-stone-200 shadow-2xs">
                        {count}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Top Visited Catering Sections from Real Analytics */}
          {sortedPages.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-serif font-bold text-base text-maroon-950 flex items-center">
                  <Flame className="w-4 h-4 mr-1.5 text-gold-dark" />
                  Most Viewed Catering Services &amp; Menus
                </h4>
                <span className="text-[11px] text-stone-500">Live Traffic Hits</span>
              </div>
              <div className="space-y-2">
                {sortedPages.map((page, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-xs">
                    <div className="flex items-center space-x-2 truncate">
                      <span className="w-5 h-5 rounded-full bg-maroon-100 text-maroon-900 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-charcoal truncate">{page.name}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-maroon-900 bg-white px-2 py-0.5 rounded border border-stone-200 ml-2 shrink-0">
                      {page.count} views
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Enquiries Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif font-bold text-lg text-maroon-950">
              Recent Customer Inquiries
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Live customer leads synchronized from Cloud Firestore database.
            </p>
          </div>

          <Link
            to="/admin/enquiries"
            className="inline-flex items-center text-xs sm:text-sm font-bold text-maroon-800 hover:text-maroon-950 transition-colors"
          >
            <span>View All Inquiries in Full Table</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-stone-50 text-stone-500 font-bold uppercase text-[11px] tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Enquiry ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Event &amp; Date</th>
                <th className="py-3 px-4">Guests</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {stats.recentEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-500 text-xs">
                    No customer enquiries found in database.
                  </td>
                </tr>
              ) : (
                stats.recentEnquiries.map((enq) => {
                  const badge = getStatusBadgeVariant(enq.status);
                  return (
                    <tr key={enq.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-maroon-900">
                        {enq.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          <p className="font-bold text-charcoal">{enq.customerName}</p>
                          {enq.isViewed ? (
                            <span className="inline-flex items-center text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-medium">
                              <Check className="w-2.5 h-2.5 mr-0.5" /> Viewed
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 animate-pulse font-bold">
                              <Sparkles className="w-2.5 h-2.5 mr-0.5" /> New
                            </span>
                          )}
                        </div>
                        <a
                          href={`tel:${enq.mobileNumber}`}
                          className="text-stone-500 hover:text-maroon-800 flex items-center text-xs mt-0.5"
                        >
                          <Phone className="w-3 h-3 mr-1 text-gold-dark" />
                          {enq.mobileNumber}
                        </a>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-charcoal font-medium">{enq.eventType}</p>
                        <p className="text-stone-500 text-xs">
                          {enq.eventDate && enq.eventDate.trim() ? (
                            formatEventDate(enq.eventDate)
                          ) : (
                            <span className="text-stone-400 italic">Date pending</span>
                          )}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-stone-700">
                        {enq.guestCount && enq.guestCount > 0 ? (
                          `${enq.guestCount} pax`
                        ) : (
                          <span className="text-stone-400 font-normal italic text-xs">Not specified</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${badge.dot}`} />
                          {enq.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/admin/enquiries/${enq.id}`}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-maroon-800 hover:text-white text-stone-700 text-xs font-bold transition-all"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
