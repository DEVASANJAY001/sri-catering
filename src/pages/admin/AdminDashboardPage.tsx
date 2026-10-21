import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Inbox,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  ArrowRight,
  TrendingUp,
  Calendar,
  Users,
  Phone,
  Sparkles,
  Activity,
  Globe,
  Smartphone,
  Monitor,
  Eye,
  Check,
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
  const [isExporting, setIsExporting] = useState(false);

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
        loadDashboardData();
      });
    }

    return () => {
      unsubTraffic();
      if (unsubEnquiries) unsubEnquiries();
    };
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const data = await enquiryService.getDashboardStats();
      setStats(data);
    } finally {
      setIsLoading(false);
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

  if (isLoading || !stats) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner size="lg" text="Loading Real-Time Enquiries & Metrics..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome & Quick Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-gold-dark uppercase tracking-wider block">
            Administrative Control Center
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-maroon-950 mt-0.5">
            Vanakkam, {user?.displayName || 'Admin'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Real-time status of catering enquiries, bookings, and active customer requests.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCsv}
            disabled={isExporting}
            className="inline-flex items-center px-4 py-2.5 rounded-xl border border-stone-300 hover:border-maroon-800 bg-white text-xs sm:text-sm font-semibold text-stone-700 hover:text-maroon-900 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 mr-2 text-stone-500" />
            <span>{isExporting ? 'Exporting...' : 'Export to CSV'}</span>
          </button>

          <Link
            to="/admin/enquiries"
            className="inline-flex items-center px-4 py-2.5 rounded-xl bg-maroon-800 hover:bg-maroon-900 text-white text-xs sm:text-sm font-bold shadow-md transition-all"
          >
            <Inbox className="w-4 h-4 mr-2 text-gold" />
            <span>Manage Enquiries</span>
          </Link>
        </div>
      </div>

      {/* Real-Time Live Traffic & Website Usage Analytics (Firebase Synchronized) */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-maroon-950 text-white rounded-3xl p-6 sm:p-8 border border-amber-500/20 shadow-xl relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-center space-x-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-black text-white flex items-center">
                Firebase Real-Time Website Visits &amp; Traffic
              </h2>
              <p className="text-xs text-amber-300/80">
                Live visitor tracking synchronized across website sessions
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-semibold">
              <Activity className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              Live Stream Active
            </span>
          </div>
        </div>

        {/* Traffic KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          {/* Active Now */}
          <div className="bg-stone-950/60 border border-stone-800/80 rounded-2xl p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-stone-400 font-medium">
              <span>Active Right Now</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400">
              {traffic?.activeNow ?? 0}
            </p>
            <p className="text-[11px] text-stone-400">Visitors actively browsing</p>
          </div>

          {/* Today's Visits */}
          <div className="bg-stone-950/60 border border-stone-800/80 rounded-2xl p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-stone-400 font-medium">
              <span>Today&apos;s Website Visits</span>
              <Globe className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-amber-300">
              {(traffic?.todayVisits ?? 0).toLocaleString()}
            </p>
            <p className="text-[11px] text-stone-400">Total page views today</p>
          </div>

          {/* Total Lifetime Visits */}
          <div className="bg-stone-950/60 border border-stone-800/80 rounded-2xl p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-stone-400 font-medium">
              <span>Total Website Traffic</span>
              <TrendingUp className="w-4 h-4 text-gold" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">
              {(traffic?.totalVisits ?? 0).toLocaleString()}
            </p>
            <p className="text-[11px] text-stone-400">All-time portal visits</p>
          </div>

          {/* Device Breakdown */}
          <div className="bg-stone-950/60 border border-stone-800/80 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-400 font-medium">
              <span>Traffic by Device</span>
              <Smartphone className="w-4 h-4 text-blue-400" />
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-[11px] font-semibold">
                <span className="text-stone-300 flex items-center">
                  <Smartphone className="w-3 h-3 mr-1 text-amber-400" /> Mobile
                </span>
                <span className="text-amber-400">
                  {traffic && (traffic.deviceBreakdown.mobile + traffic.deviceBreakdown.desktop > 0)
                    ? Math.round((traffic.deviceBreakdown.mobile / (traffic.deviceBreakdown.mobile + traffic.deviceBreakdown.desktop + (traffic.deviceBreakdown.tablet || 0))) * 100)
                    : 0}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-stone-800 overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full"
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

        {/* Live Visitor Activity Feed */}
        {traffic?.recentVisitors && traffic.recentVisitors.length > 0 && (
          <div className="pt-3 border-t border-stone-800/80 relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-amber-300/80 uppercase tracking-wider">
                Live Visitor Page Stream:
              </span>
              <span className="text-[10px] text-stone-400">Updated in real-time</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {traffic.recentVisitors.slice(0, 6).map((vis) => (
                <div
                  key={vis.id}
                  className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-stone-950/80 border border-stone-800 text-xs"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-mono text-amber-300 font-bold">{vis.page}</span>
                  <span className="text-stone-500 text-[10px]">({vis.device})</span>
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
          subtitle="All recorded events"
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
          subtitle="Needs active follow-up"
          onClick={() => navigate('/admin/enquiries?status=Follow-up Required')}
        />
      </div>

      {/* Secondary Status Pipeline Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200">
          <span className="text-[11px] font-bold text-stone-400 uppercase">Contacted</span>
          <p className="text-xl font-black text-amber-700 mt-1">{stats.contactedEnquiries}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-stone-200">
          <span className="text-[11px] font-bold text-stone-400 uppercase">Quotation Sent</span>
          <p className="text-xl font-black text-purple-700 mt-1">{stats.quotationSentEnquiries}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-stone-200">
          <span className="text-[11px] font-bold text-stone-400 uppercase">Closed Feasts</span>
          <p className="text-xl font-black text-stone-700 mt-1">{stats.closedEnquiries}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-stone-200">
          <span className="text-[11px] font-bold text-stone-400 uppercase">Cancelled</span>
          <p className="text-xl font-black text-rose-700 mt-1">{stats.cancelledEnquiries}</p>
        </div>
      </div>

      {/* Middle Section: Breakdown by Event Type & Breakdown by Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Status Pipeline Progress Bars */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-maroon-950 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-gold-dark" />
              Inquiries Pipeline by Status
            </h3>
            <span className="text-xs text-stone-400 font-medium">
              {stats.totalEnquiries} Total
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

        {/* Breakdown by Event Type */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-maroon-950 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-maroon-700" />
              Inquiries by Event Type
            </h3>
            <span className="text-xs text-stone-400 font-medium">Event Distribution</span>
          </div>

          <div className="space-y-3">
            {Object.entries(stats.enquiriesByEventType).length === 0 ? (
              <p className="text-xs text-stone-500 py-4 text-center">No event data available yet.</p>
            ) : (
              Object.entries(stats.enquiriesByEventType).map(([eventType, count]) => {
                const percent = stats.totalEnquiries > 0 ? Math.round((count / stats.totalEnquiries) * 100) : 0;
                return (
                  <div key={eventType} className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-charcoal">{eventType}</p>
                      <p className="text-[11px] text-stone-500">{percent}% of total enquiries</p>
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
      </div>

      {/* Recent Enquiries Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif font-bold text-lg text-maroon-950">
              Recent Customer Inquiries
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Latest requests logged across website booking channels.
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
                    No customer enquiries received yet. When visitors submit an enquiry on the website, it will appear here in real time.
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
                      <p className="text-stone-500 text-xs">{formatEventDate(enq.eventDate)}</p>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-stone-700">
                      {enq.guestCount} pax
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
              }))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
