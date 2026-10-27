import React, { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Download,
  Trash2,
  Phone,
  Eye,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  UserCheck,
  Check,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Bell,
  BellRing,
  Volume2,
  VolumeX,
  X,
  Flame,
} from 'lucide-react';
import { enquiryService } from '../../services/enquiries';
import { authService } from '../../services/auth';
import {
  Enquiry,
  EnquiryFilterOptions,
  EnquiryStatus,
} from '../../types/enquiry';
import { AdminUser } from '../../types/admin';
import { siteConfig } from '../../config/siteConfig';
import { useAuth } from '../../hooks/useAuth';
import {
  getStatusBadgeVariant,
  formatEventDate,
  formatDateTime,
} from '../../utils/formatters';
import { downloadCsv } from '../../utils/exportCsv';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';

export const AdminEnquiriesPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [allRawEnquiries, setAllRawEnquiries] = useState<Enquiry[]>([]);
  const [availableAdmins, setAvailableAdmins] = useState<AdminUser[]>(user ? [user] : []);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // Real-Time Notification & Sound State
  const [incomingAlert, setIncomingAlert] = useState<{
    id: string;
    customerName: string;
    eventType: string;
    guestCount: number;
    timestamp: string;
  } | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const previousIdsRef = useRef<Set<string>>(new Set());

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(
    searchParams.get('status') || 'All'
  );
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('All');
  const [adminFilter, setAdminFilter] = useState<string>('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Sorting & Pagination
  const [sortField, setSortField] = useState<'createdAt' | 'eventDate' | 'guestCount'>('createdAt');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Deletion Modal State
  const [deletingEnquiry, setDeletingEnquiry] = useState<Enquiry | null>(null);

  // Play subtle web audio notification chime
  const playChimeSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio autoplay policy handled safely
    }
  };

  useEffect(() => {
    if (authService.getAdmins) {
      authService.getAdmins().then((admins) => {
        if (admins && admins.length > 0) {
          setAvailableAdmins(admins);
        } else if (user) {
          setAvailableAdmins([user]);
        }
      });
    } else if (user) {
      setAvailableAdmins([user]);
    }
  }, [user]);

  useEffect(() => {
    loadEnquiries();

    // Real-time synchronization with Firestore enquiries
    if (enquiryService.subscribeToEnquiries) {
      const unsubscribe = enquiryService.subscribeToEnquiries((incomingList) => {
        if (incomingList && incomingList.length > 0) {
          const prevIds = previousIdsRef.current;
          if (prevIds.size > 0) {
            // Find newly arrived inquiry that is status 'New'
            const newlyCreated = incomingList.find(
              (item) => !prevIds.has(item.id) && item.status === 'New'
            );
            if (newlyCreated) {
              setIncomingAlert({
                id: newlyCreated.id,
                customerName: newlyCreated.customerName,
                eventType: newlyCreated.eventType,
                guestCount: newlyCreated.guestCount,
                timestamp: new Date().toLocaleTimeString(),
              });
              if (soundEnabled) {
                playChimeSound();
              }
            }
          }
          previousIdsRef.current = new Set(incomingList.map((i) => i.id));
        }
        loadEnquiries(true);
      });
      return () => unsubscribe();
    }
  }, [statusFilter, eventTypeFilter, adminFilter, dateFrom, dateTo, soundEnabled]);

  const loadEnquiries = async (skipLoading = false) => {
    if (!skipLoading) setIsLoading(true);
    try {
      // Fetch global unfiltered list to calculate accurate status tab notification counts
      const allItems = await enquiryService.getEnquiries();
      setAllRawEnquiries(allItems);
      if (previousIdsRef.current.size === 0 && allItems.length > 0) {
        previousIdsRef.current = new Set(allItems.map((i) => i.id));
      }

      const filters: EnquiryFilterOptions = {
        searchQuery: searchQuery.trim() || undefined,
        status: statusFilter === 'All' ? undefined : (statusFilter as EnquiryStatus),
        eventType: eventTypeFilter === 'All' ? undefined : eventTypeFilter,
        assignedAdminUid: adminFilter === 'All' ? undefined : adminFilter,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      };

      const items = await enquiryService.getEnquiries(filters);
      setEnquiries(items);
      setCurrentPage(1);
    } finally {
      if (!skipLoading) setIsLoading(false);
    }
  };

  const handleMarkAsViewed = async (enquiryId: string) => {
    try {
      await enquiryService.markAsViewed(
        enquiryId,
        user?.uid || 'admin',
        user?.displayName || 'Admin'
      );
      setEnquiries((prev) =>
        prev.map((item) =>
          item.id === enquiryId
            ? {
                ...item,
                isViewed: true,
                viewedAt: new Date().toISOString(),
                viewedByAdminName: user?.displayName || 'Admin',
              }
            : item
        )
      );
    } catch (err) {
      console.warn('Could not mark enquiry as viewed:', err);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadEnquiries();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setEventTypeFilter('All');
    setAdminFilter('All');
    setDateFrom('');
    setDateTo('');
    loadEnquiries();
  };

  // Inline Quick Status Change
  const handleInlineStatusChange = async (enquiryId: string, newStatus: EnquiryStatus) => {
    try {
      await enquiryService.updateEnquiryStatus(
        enquiryId,
        newStatus,
        user?.uid || 'admin',
        user?.displayName || 'Admin'
      );
      // Update local state
      setEnquiries((prev) =>
        prev.map((item) =>
          item.id === enquiryId ? { ...item, status: newStatus } : item
        )
      );
    } catch (err) {
      alert(`Could not update status: ${err instanceof Error ? err.message : 'Error'}`);
    }
  };

  // Inline Quick Admin Assignment
  const handleInlineAssignAdmin = async (enquiryId: string, adminUid: string) => {
    try {
      if (!adminUid) {
        await enquiryService.assignEnquiry(
          enquiryId,
          '',
          '',
          user?.displayName || 'Admin',
          user?.uid
        );
        setEnquiries((prev) =>
          prev.map((item) =>
            item.id === enquiryId
              ? {
                  ...item,
                  assignedAdminUid: undefined,
                  assignedAdminName: undefined,
                }
              : item
          )
        );
        return;
      }
      const assignedUser = availableAdmins.find((a) => a.uid === adminUid) || (user?.uid === adminUid ? user : null);
      const adminName = assignedUser?.displayName || 'Admin';
      await enquiryService.assignEnquiry(
        enquiryId,
        adminUid,
        adminName,
        user?.displayName || 'Admin',
        user?.uid
      );
      setEnquiries((prev) =>
        prev.map((item) =>
          item.id === enquiryId
            ? {
                ...item,
                assignedAdminUid: adminUid,
                assignedAdminName: adminName,
              }
            : item
        )
      );
    } catch (err) {
      alert(`Could not assign admin: ${err instanceof Error ? err.message : 'Error'}`);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingEnquiry) return;
    try {
      await enquiryService.deleteEnquiry(
        deletingEnquiry.id,
        user?.uid || 'admin',
        user?.displayName || 'Admin'
      );
      setEnquiries((prev) => prev.filter((i) => i.id !== deletingEnquiry.id));
      setDeletingEnquiry(null);
    } catch (err) {
      alert(`Could not delete enquiry: ${err instanceof Error ? err.message : 'Error'}`);
    }
  };

  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      const csv = await enquiryService.exportEnquiriesToCsv({
        searchQuery: searchQuery.trim() || undefined,
        status: statusFilter === 'All' ? undefined : (statusFilter as EnquiryStatus),
        eventType: eventTypeFilter === 'All' ? undefined : eventTypeFilter,
        assignedAdminUid: adminFilter === 'All' ? undefined : adminFilter,
      });
      downloadCsv(csv, `sri_caterers_filtered_enquiries_${new Date().toISOString().split('T')[0]}.csv`);
    } finally {
      setIsExporting(false);
    }
  };

  // Sorting
  const sortedEnquiries = [...enquiries].sort((a, b) => {
    if (sortField === 'guestCount') {
      const aCount = a.guestCount ?? 0;
      const bCount = b.guestCount ?? 0;
      return sortAsc ? aCount - bCount : bCount - aCount;
    }
    if (sortField === 'eventDate') {
      const aDate = a.eventDate || '';
      const bDate = b.eventDate || '';
      return sortAsc
        ? aDate.localeCompare(bDate)
        : bDate.localeCompare(aDate);
    }
    const aCreated = a.createdAt || '';
    const bCreated = b.createdAt || '';
    return sortAsc
      ? aCreated.localeCompare(bCreated)
      : bCreated.localeCompare(aCreated);
  });

  // Pagination
  const totalPages = Math.ceil(sortedEnquiries.length / pageSize) || 1;
  const paginatedEnquiries = sortedEnquiries.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const statuses: (EnquiryStatus | 'All')[] = [
    'All',
    'New',
    'Contacted',
    'Follow-up Required',
    'Quotation Sent',
    'Confirmed',
    'Closed',
    'Cancelled',
  ];

  const newEnquiriesCount = allRawEnquiries.filter((e) => e.status === 'New').length;
  const unviewedCount = allRawEnquiries.filter((e) => !e.isViewed).length;

  return (
    <div className="space-y-6">
      {/* Real-time Arrival Alert Banner / Floating Toast */}
      {incomingAlert && (
        <div className="fixed top-5 right-5 z-50 max-w-sm w-full bg-stone-900 text-white border-2 border-amber-400 p-4 rounded-2xl shadow-2xl flex items-start space-x-3 animate-bounce">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 flex items-center justify-center shrink-0 border border-amber-400/30">
            <BellRing className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                Just Received Now!
              </span>
              <button
                type="button"
                onClick={() => setIncomingAlert(null)}
                className="text-stone-400 hover:text-white"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="font-bold text-sm text-white truncate mt-1">
              {incomingAlert.customerName}
            </p>
            <p className="text-xs text-stone-300">
              {incomingAlert.eventType} • {incomingAlert.guestCount && incomingAlert.guestCount > 0 ? `${incomingAlert.guestCount} pax` : 'Guests pending'}
            </p>
            <div className="mt-2.5 flex items-center space-x-2">
              <Link
                to={`/admin/enquiries/${incomingAlert.id}`}
                onClick={() => setIncomingAlert(null)}
                className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs transition-colors"
              >
                Open Enquiry
              </Link>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('New');
                  setCurrentPage(1);
                  setIncomingAlert(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs transition-colors"
              >
                Filter New
              </button>
            </div>
          </div>
        </div>
      )}

      {/* High-Visibility New Enquiries Notification Banner */}
      {newEnquiriesCount > 0 && (
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-4 sm:p-5 rounded-3xl shadow-lg border border-amber-300/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 shadow-inner">
              <BellRing className="w-6 h-6 text-white animate-bounce" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-white text-amber-900 uppercase tracking-wider shadow-xs">
                  🔔 Action Required
                </span>
                <span className="text-xs font-bold text-amber-100 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  Live Firestore Pulse
                </span>
              </div>
              <p className="font-serif font-black text-base sm:text-xl text-white mt-0.5">
                {newEnquiriesCount} New {newEnquiriesCount === 1 ? 'Customer Enquiry' : 'Customer Enquiries'} Awaiting Contact!
              </p>
              <p className="text-xs text-amber-100/90">
                {unviewedCount > 0 ? `${unviewedCount} unread queries.` : 'All marked viewed.'} Fast response within 15 minutes boosts event booking rate.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 shrink-0 w-full sm:w-auto justify-end">
            {statusFilter !== 'New' ? (
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('New');
                  setCurrentPage(1);
                }}
                className="px-4 py-2 rounded-xl bg-white hover:bg-amber-50 text-amber-950 font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                Filter: View New ({newEnquiriesCount})
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('All');
                  setCurrentPage(1);
                }}
                className="px-4 py-2 rounded-xl bg-amber-950/60 hover:bg-amber-950 text-white font-bold text-xs transition-all cursor-pointer"
              >
                Clear Filter (Show All)
              </button>
            )}

            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute new enquiry alert chime' : 'Enable new enquiry alert chime'}
              className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Quick Status Tabs with Live Notification Badges */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {statuses.map((st) => {
          const isSelected = statusFilter === st;
          const count =
            st === 'All'
              ? allRawEnquiries.length
              : allRawEnquiries.filter((e) => e.status === st).length;
          const isNewTab = st === 'New';

          return (
            <button
              key={st}
              type="button"
              onClick={() => {
                setStatusFilter(st);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-maroon-900 text-white shadow-md'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 shadow-2xs'
              }`}
            >
              <span>{st}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                  isNewTab && count > 0
                    ? 'bg-rose-500 text-white animate-pulse'
                    : isSelected
                    ? 'bg-maroon-800 text-amber-200'
                    : 'bg-stone-100 text-stone-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Firebase Firestore: sricatering-64043
            </span>
            <span className="text-xs text-stone-400">•</span>
            <span className="text-xs font-semibold text-stone-600">
              {enquiries.length} {enquiries.length === 1 ? 'Record' : 'Records'}
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-maroon-950">
            Customer Inquiries Management
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Real-time Firestore synchronizer. Track statuses, assign admins, and manage event orders.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => loadEnquiries()}
            disabled={isLoading}
            title="Force refresh from Firestore"
            className="inline-flex items-center px-3.5 py-2.5 rounded-xl border border-stone-200 hover:border-maroon-800 bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-stone-700 transition-colors shadow-2xs cursor-pointer disabled:opacity-60"
          >
            <RotateCcw className={`w-3.5 h-3.5 mr-1.5 text-stone-600 ${isLoading ? 'animate-spin text-maroon-800' : ''}`} />
            <span>{isLoading ? 'Syncing...' : 'Sync Firestore'}</span>
          </button>

          <button
            onClick={handleExportCsv}
            disabled={isExporting}
            className="inline-flex items-center px-4 py-2.5 rounded-xl border border-stone-300 hover:border-maroon-800 bg-white text-xs sm:text-sm font-semibold text-stone-700 hover:text-maroon-950 transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4 mr-2 text-stone-500" />
            <span>{isExporting ? 'Exporting...' : 'Export Filtered CSV'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, phone, ID, or hall location..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
            />
          </div>

          {/* Status Dropdown */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 bg-white"
            >
              {statuses.map((st) => (
                <option key={st} value={st}>
                  Status: {st}
                </option>
              ))}
            </select>
          </div>

          {/* Event Type Dropdown */}
          <div className="md:col-span-4">
            <select
              value={eventTypeFilter}
              onChange={(e) => setEventTypeFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 bg-white"
            >
              <option value="All">All Event Types</option>
              {siteConfig.eventTypes.map((evt) => (
                <option key={evt.id} value={evt.name}>
                  {evt.name}
                </option>
              ))}
            </select>
          </div>
        </form>

        {/* Secondary Filters: Admin & Date Range */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-3 border-t border-stone-100 items-center text-xs">
          {/* Assigned Admin Filter */}
          <div className="sm:col-span-4">
            <select
              value={adminFilter}
              onChange={(e) => setAdminFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-1 focus:ring-maroon-800 bg-white"
            >
              <option value="All">Assigned Admin: All</option>
              {availableAdmins.map((a) => (
                <option key={a.uid} value={a.uid}>
                  {a.displayName} {a.roleTitle ? `(${a.roleTitle})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div className="sm:col-span-3 flex items-center space-x-1">
            <span className="text-stone-400 shrink-0">From:</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-2 py-1.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-1 focus:ring-maroon-800 bg-white"
            />
          </div>

          {/* Date To */}
          <div className="sm:col-span-3 flex items-center space-x-1">
            <span className="text-stone-400 shrink-0">To:</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-2 py-1.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-1 focus:ring-maroon-800 bg-white"
            />
          </div>

          {/* Reset Filters */}
          <div className="sm:col-span-2 text-right">
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center text-xs text-stone-500 hover:text-maroon-800 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset All
            </button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-24 flex justify-center">
            <LoadingSpinner size="lg" text="Filtering customer enquiries..." />
          </div>
        ) : paginatedEnquiries.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <Filter className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="font-serif font-bold text-lg text-charcoal">
              No Matching Inquiries Found
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              No enquiries match the current search or status filters. Try clearing your filters or creating a new enquiry on the website.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-2 px-4 py-2 rounded-xl bg-maroon-800 text-white text-xs font-bold hover:bg-maroon-900 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-stone-50 text-stone-500 font-bold uppercase text-[11px] tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3.5 px-4">
                    <button
                      onClick={() => {
                        setSortField('createdAt');
                        setSortAsc(!sortAsc);
                      }}
                      className="flex items-center font-bold hover:text-maroon-800"
                    >
                      <span>Enquiry ID</span>
                      <ArrowUpDown className="w-3 h-3 ml-1" />
                    </button>
                  </th>
                  <th className="py-3.5 px-4">Customer Details</th>
                  <th className="py-3.5 px-4">
                    <button
                      onClick={() => {
                        setSortField('eventDate');
                        setSortAsc(!sortAsc);
                      }}
                      className="flex items-center font-bold hover:text-maroon-800"
                    >
                      <span>Event &amp; Date</span>
                      <ArrowUpDown className="w-3 h-3 ml-1" />
                    </button>
                  </th>
                  <th className="py-3.5 px-4">
                    <button
                      onClick={() => {
                        setSortField('guestCount');
                        setSortAsc(!sortAsc);
                      }}
                      className="flex items-center font-bold hover:text-maroon-800"
                    >
                      <span>Guests</span>
                      <ArrowUpDown className="w-3 h-3 ml-1" />
                    </button>
                  </th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Current Status</th>
                  <th className="py-3.5 px-4">Assigned Admin</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {paginatedEnquiries.map((enq) => {
                  const badge = getStatusBadgeVariant(enq.status);
                  return (
                    <tr key={enq.id} className="hover:bg-stone-50/70 transition-colors">
                      {/* ID */}
                      <td className="py-4 px-4 font-mono font-bold text-maroon-900 whitespace-nowrap">
                        <Link
                          to={`/admin/enquiries/${enq.id}`}
                          className="hover:underline flex items-center"
                        >
                          {enq.id}
                        </Link>
                        <span className="text-[10px] text-stone-400 block font-sans">
                          {formatDateTime(enq.createdAt)}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <p className="font-bold text-charcoal">{enq.customerName}</p>
                          {enq.isViewed ? (
                            <span
                              title={`Viewed by ${enq.viewedByAdminName || 'Admin'}`}
                              className="inline-flex items-center text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-medium"
                            >
                              <Check className="w-2.5 h-2.5 mr-0.5" /> Viewed
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleMarkAsViewed(enq.id)}
                              title="Click to mark as viewed"
                              className="inline-flex items-center text-[10px] text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-full border border-blue-200 font-bold transition-colors cursor-pointer"
                            >
                              <Sparkles className="w-2.5 h-2.5 mr-0.5" /> Mark Viewed
                            </button>
                          )}
                        </div>
                        <a
                          href={`tel:${enq.mobileNumber}`}
                          className="text-stone-500 hover:text-maroon-800 flex items-center text-xs mt-0.5 font-medium"
                        >
                          <Phone className="w-3 h-3 mr-1 text-gold-dark" />
                          {enq.mobileNumber}
                        </a>
                        {enq.email && enq.email.trim() ? (
                          <span className="text-[11px] text-stone-400 block truncate max-w-[170px]">
                            {enq.email}
                          </span>
                        ) : (
                          <span className="text-[10px] text-stone-400 italic block">
                            No email provided
                          </span>
                        )}
                      </td>

                      {/* Event & Date */}
                      <td className="py-4 px-4">
                        <p className="text-charcoal font-medium">{enq.eventType}</p>
                        <span className="text-stone-500 text-xs flex items-center mt-0.5">
                          <Calendar className="w-3 h-3 mr-1 text-maroon-700" />
                          {enq.eventDate && enq.eventDate.trim() ? (
                            formatEventDate(enq.eventDate)
                          ) : (
                            <span className="text-stone-400 italic">Date not finalized</span>
                          )}
                        </span>
                      </td>

                      {/* Guest Count */}
                      <td className="py-4 px-4 font-semibold text-stone-700 whitespace-nowrap">
                        {enq.guestCount && enq.guestCount > 0 ? (
                          `${enq.guestCount} pax`
                        ) : (
                          <span className="text-stone-400 font-normal italic text-xs">
                            Not specified
                          </span>
                        )}
                      </td>

                      {/* Location */}
                      <td className="py-4 px-4 text-xs text-stone-600 max-w-xs truncate">
                        {enq.eventLocation && enq.eventLocation.trim() ? (
                          <span>{enq.eventLocation}</span>
                        ) : (
                          <span className="text-stone-400 font-normal italic">
                            Not specified
                          </span>
                        )}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <select
                          value={enq.status}
                          onChange={(e) =>
                            handleInlineStatusChange(
                              enq.id,
                              e.target.value as EnquiryStatus
                            )
                          }
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          {statuses
                            .filter((s) => s !== 'All')
                            .map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                        </select>
                      </td>

                      {/* Assigned Admin */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <select
                          value={enq.assignedAdminUid || ''}
                          onChange={(e) =>
                            handleInlineAssignAdmin(enq.id, e.target.value)
                          }
                          className="text-xs text-stone-700 bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 max-w-[150px] truncate"
                        >
                          <option value="">Unassigned</option>
                          {availableAdmins.map((a) => (
                            <option key={a.uid} value={a.uid}>
                              {a.displayName.split('(')[0].trim()}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Action buttons */}
                      <td className="py-4 px-4 text-right whitespace-nowrap space-x-1.5">
                        <Link
                          to={`/admin/enquiries/${enq.id}`}
                          className="p-1.5 rounded-lg text-stone-600 hover:text-maroon-900 hover:bg-stone-100 inline-flex items-center"
                          title="View Complete Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => setDeletingEnquiry(enq)}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 inline-flex items-center"
                          title="Delete Enquiry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {!isLoading && paginatedEnquiries.length > 0 && (
          <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
            <div>
              Showing{' '}
              <strong className="text-stone-800">
                {(currentPage - 1) * pageSize + 1}
              </strong>{' '}
              to{' '}
              <strong className="text-stone-800">
                {Math.min(currentPage * pageSize, sortedEnquiries.length)}
              </strong>{' '}
              of <strong className="text-stone-800">{sortedEnquiries.length}</strong> enquiries
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white border border-stone-200 hover:bg-stone-100 disabled:opacity-40 disabled:pointer-events-none"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="font-semibold text-stone-700 px-2">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white border border-stone-200 hover:bg-stone-100 disabled:opacity-40 disabled:pointer-events-none"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingEnquiry && (
        <Modal
          isOpen={Boolean(deletingEnquiry)}
          onClose={() => setDeletingEnquiry(null)}
          title="Confirm Enquiry Deletion"
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="flex items-start space-x-3 text-sm text-stone-700">
              <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p>
                  Are you sure you want to delete inquiry{' '}
                  <strong className="text-maroon-900">{deletingEnquiry.id}</strong> submitted by{' '}
                  <strong className="text-charcoal">{deletingEnquiry.customerName}</strong>?
                </p>
                <p className="text-xs text-stone-500 mt-2">
                  This action will permanently delete the inquiry record and its notes from the database.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex justify-end space-x-3">
              <button
                onClick={() => setDeletingEnquiry(null)}
                className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
              >
                Cancel
              </button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmDelete}
              >
                Delete Enquiry
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
