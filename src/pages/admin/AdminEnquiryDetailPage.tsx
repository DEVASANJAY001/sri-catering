import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  Mail,
  Calendar,
  Users,
  MapPin,
  Utensils,
  Clock,
  Send,
  Trash2,
  Lock,
  UserCheck,
  History,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  Check,
  Sparkles,
} from 'lucide-react';
import { enquiryService } from '../../services/enquiries';
import { authService } from '../../services/auth';
import { Enquiry, EnquiryStatus } from '../../types/enquiry';
import { AdminUser } from '../../types/admin';
import { useAuth } from '../../hooks/useAuth';
import {
  getStatusBadgeVariant,
  formatEventDate,
  formatDateTime,
} from '../../utils/formatters';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export const AdminEnquiryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const [availableAdmins, setAvailableAdmins] = useState<AdminUser[]>(user ? [user] : []);
  const [isLoading, setIsLoading] = useState(true);
  const [newNoteText, setNewNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
    if (id) loadEnquiry(id);
  }, [id]);

  const loadEnquiry = async (enquiryId: string) => {
    setIsLoading(true);
    try {
      const data = await enquiryService.getEnquiryById(enquiryId);
      if (data) {
        setEnquiry(data);
        // Automatically mark as viewed if not yet marked
        if (!data.isViewed && enquiryService.markAsViewed) {
          try {
            const viewed = await enquiryService.markAsViewed(
              enquiryId,
              user?.uid || 'admin',
              user?.displayName || 'Admin'
            );
            setEnquiry(viewed);
          } catch (err) {
            console.warn('Could not mark enquiry as viewed:', err);
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: EnquiryStatus) => {
    if (!enquiry || !user) return;
    setIsUpdatingStatus(true);
    try {
      const updated = await enquiryService.updateEnquiryStatus(
        enquiry.id,
        newStatus,
        user.uid,
        user.displayName
      );
      setEnquiry(updated);
    } catch (err) {
      alert(`Status update failed: ${err instanceof Error ? err.message : 'Error'}`);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiry || !user || !newNoteText.trim()) return;
    setIsAddingNote(true);
    try {
      const updated = await enquiryService.addInternalNote(
        enquiry.id,
        newNoteText,
        user.uid,
        user.displayName
      );
      setEnquiry(updated);
      setNewNoteText('');
    } catch (err) {
      alert(`Could not add note: ${err instanceof Error ? err.message : 'Error'}`);
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleAssignAdmin = async (adminUid: string) => {
    if (!enquiry || !user) return;
    if (!adminUid) {
      try {
        const updated = await enquiryService.assignEnquiry(
          enquiry.id,
          '',
          '',
          user.displayName,
          user.uid
        );
        setEnquiry(updated);
      } catch (err) {
        alert(`Could not unassign admin: ${err instanceof Error ? err.message : 'Error'}`);
      }
      return;
    }
    const targetAdmin = availableAdmins.find((a) => a.uid === adminUid) || (user.uid === adminUid ? user : null);
    const targetName = targetAdmin?.displayName || 'Administrator';
    try {
      const updated = await enquiryService.assignEnquiry(
        enquiry.id,
        adminUid,
        targetName,
        user.displayName,
        user.uid
      );
      setEnquiry(updated);
    } catch (err) {
      alert(`Could not assign admin: ${err instanceof Error ? err.message : 'Error'}`);
    }
  };

  const handleDeleteEnquiry = async () => {
    if (!enquiry || !user) return;
    try {
      await enquiryService.deleteEnquiry(enquiry.id, user.uid, user.displayName);
      navigate('/admin/enquiries');
    } catch (err) {
      alert(`Delete failed: ${err instanceof Error ? err.message : 'Error'}`);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 flex justify-center">
        <LoadingSpinner size="lg" text="Loading customer enquiry record..." />
      </div>
    );
  }

  if (!enquiry) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="font-serif text-2xl font-bold text-charcoal">Enquiry Record Not Found</h2>
        <p className="text-sm text-stone-500">
          The enquiry ID &quot;{id}&quot; does not exist or has been removed.
        </p>
        <Link
          to="/admin/enquiries"
          className="inline-flex items-center px-4 py-2 rounded-xl bg-maroon-800 text-white text-xs font-bold"
        >
          Return to Enquiries Table
        </Link>
      </div>
    );
  }

  const badge = getStatusBadgeVariant(enquiry.status);
  const statuses: EnquiryStatus[] = [
    'New',
    'Contacted',
    'Follow-up Required',
    'Quotation Sent',
    'Confirmed',
    'Closed',
    'Cancelled',
  ];

  return (
    <div className="space-y-8">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/admin/enquiries"
          className="inline-flex items-center text-xs sm:text-sm font-semibold text-stone-600 hover:text-maroon-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Back to All Inquiries</span>
        </Link>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center px-3 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold border border-rose-200 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            <span>Delete Inquiry</span>
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5 flex-wrap gap-y-2">
            <span className="font-mono text-xl sm:text-2xl font-black text-maroon-900">
              {enquiry.id}
            </span>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${badge.dot}`} />
              {enquiry.status}
            </span>
            {enquiry.isViewed ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <FileCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                Viewed {enquiry.viewedByAdminName ? `by ${enquiry.viewedByAdminName}` : ''}
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                Unviewed Visitor Enquiry
              </span>
            )}
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-charcoal">
            {enquiry.customerName}
          </h1>
          <p className="text-xs text-stone-500">
            Submitted via Web Portal on {formatDateTime(enquiry.createdAt)} • Last updated:{' '}
            {formatDateTime(enquiry.updatedAt)}
          </p>
        </div>

        {/* Quick Customer Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`tel:${enquiry.mobileNumber}`}
            className="inline-flex items-center px-4 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors shadow-xs"
          >
            <Phone className="w-4 h-4 mr-1.5 text-gold" />
            <span>Call Customer</span>
          </a>

          <a
            href={`https://wa.me/91${enquiry.mobileNumber}?text=Vanakkam%20${encodeURIComponent(enquiry.customerName)},%20this%20is%20Sri%20Caterers%20Chennai%20regarding%20your%20catering%20inquiry%20(${enquiry.id}).`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <MessageCircle className="w-4 h-4 mr-1.5" />
            <span>WhatsApp Chat</span>
          </a>

          {enquiry.email && (
            <a
              href={`mailto:${enquiry.email}?subject=Sri%20Caterers%20Quotation%20-%20${enquiry.id}`}
              className="inline-flex items-center px-4 py-2.5 rounded-xl bg-stone-100 text-stone-800 text-xs font-semibold hover:bg-stone-200 transition-colors"
            >
              <Mail className="w-4 h-4 mr-1.5" />
              <span>Email</span>
            </a>
          )}
        </div>
      </div>

      {/* Main Grid: Details + Internal Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Event & Customer Specifications */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer & Event Details Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <h2 className="font-serif font-bold text-lg text-maroon-950 border-b border-stone-200 pb-3">
              Event &amp; Service Specifications
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                  Event Occasion
                </span>
                <p className="font-extrabold text-charcoal">{enquiry.eventType}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                  Auspicious Planned Date
                </span>
                <p className="font-extrabold text-maroon-900">
                  {formatEventDate(enquiry.eventDate)} ({enquiry.eventDate})
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                  Estimated Guest Count
                </span>
                <p className="font-extrabold text-charcoal flex items-center">
                  <Users className="w-4 h-4 mr-1.5 text-leaf-700" />
                  {enquiry.guestCount} Guests
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                  Preferred Contact Method
                </span>
                <p className="font-semibold text-charcoal">
                  {enquiry.preferredContactMethod}
                </p>
              </div>
            </div>

            {/* Venue Location */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                Venue Location or Marriage Hall
              </span>
              <p className="text-sm font-bold text-charcoal flex items-start">
                <MapPin className="w-4 h-4 mr-1.5 text-maroon-800 shrink-0 mt-0.5" />
                <span>{enquiry.eventLocation}</span>
              </p>
            </div>

            {/* Catering Preferences */}
            <div className="space-y-3 pt-2 border-t border-stone-100">
              <h3 className="font-serif font-bold text-base text-maroon-950">
                Culinary Preferences
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase block">
                    Catering Service
                  </span>
                  <p className="font-semibold text-charcoal mt-0.5">
                    {enquiry.cateringService || 'General Consultation'}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase block">
                    Meal Preference
                  </span>
                  <p className="font-semibold text-charcoal mt-0.5">
                    {enquiry.mealPreference || 'Both / Unspecified'}
                  </p>
                </div>
              </div>

              {enquiry.message && (
                <div className="pt-3">
                  <span className="text-[11px] font-bold text-stone-400 uppercase block mb-1">
                    Customer Special Message / Notes
                  </span>
                  <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs text-stone-700 leading-relaxed italic">
                    &quot;{enquiry.message}&quot;
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Audit History Timeline */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
            <h2 className="font-serif font-bold text-lg text-maroon-950 flex items-center">
              <History className="w-5 h-5 mr-2 text-stone-500" />
              Administrative Audit History
            </h2>

            <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-stone-200">
              {enquiry.auditLogs.map((log) => (
                <div key={log.id} className="relative pl-8 text-xs">
                  <span className="absolute left-2 top-1.5 w-3 h-3 rounded-full bg-maroon-800 border-2 border-white shadow-xs" />
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-charcoal">{log.action}</span>
                      <span className="text-[10px] text-stone-400">
                        {formatDateTime(log.timestamp)}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Author: <strong className="text-stone-700">{log.adminName}</strong>
                      {log.details ? ` — ${log.details}` : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Status Control, Assign Admin, & Internal Notes */}
        <div className="lg:col-span-5 space-y-6">
          {/* Status & Assignment Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
            <h2 className="font-serif font-bold text-lg text-maroon-950 border-b border-stone-200 pb-3">
              Enquiry Operations
            </h2>

            {/* Status Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider">
                Update Status
              </label>
              <select
                value={enquiry.status}
                disabled={isUpdatingStatus}
                onChange={(e) => handleStatusChange(e.target.value as EnquiryStatus)}
                className={`w-full px-4 py-2.5 rounded-xl border font-bold text-xs sm:text-sm focus:outline-none ${badge.bg} ${badge.text} ${badge.border}`}
              >
                {statuses.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>

              {/* Quick 1-Click Status Progression */}
              <div className="pt-2">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
                  One-Click Status Change:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    disabled={isUpdatingStatus || enquiry.status === 'Contacted'}
                    onClick={() => handleStatusChange('Contacted')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold text-left flex items-center justify-between border transition-all ${
                      enquiry.status === 'Contacted'
                        ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-xs'
                        : 'bg-stone-50 hover:bg-amber-50 text-stone-700 hover:text-amber-900 border-stone-200'
                    }`}
                  >
                    <span className="flex items-center">
                      <Phone className="w-3 h-3 mr-1.5 text-amber-600" />
                      Contacted
                    </span>
                    {enquiry.status === 'Contacted' && <Check className="w-3 h-3 text-amber-700" />}
                  </button>

                  <button
                    type="button"
                    disabled={isUpdatingStatus || enquiry.status === 'Follow-up Required'}
                    onClick={() => handleStatusChange('Follow-up Required')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold text-left flex items-center justify-between border transition-all ${
                      enquiry.status === 'Follow-up Required'
                        ? 'bg-blue-100 border-blue-400 text-blue-900 shadow-xs'
                        : 'bg-stone-50 hover:bg-blue-50 text-stone-700 hover:text-blue-900 border-stone-200'
                    }`}
                  >
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1.5 text-blue-600" />
                      Follow-up
                    </span>
                    {enquiry.status === 'Follow-up Required' && <Check className="w-3 h-3 text-blue-700" />}
                  </button>

                  <button
                    type="button"
                    disabled={isUpdatingStatus || enquiry.status === 'Quotation Sent'}
                    onClick={() => handleStatusChange('Quotation Sent')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold text-left flex items-center justify-between border transition-all ${
                      enquiry.status === 'Quotation Sent'
                        ? 'bg-purple-100 border-purple-400 text-purple-900 shadow-xs'
                        : 'bg-stone-50 hover:bg-purple-50 text-stone-700 hover:text-purple-900 border-stone-200'
                    }`}
                  >
                    <span className="flex items-center">
                      <Send className="w-3 h-3 mr-1.5 text-purple-600" />
                      Quotation
                    </span>
                    {enquiry.status === 'Quotation Sent' && <Check className="w-3 h-3 text-purple-700" />}
                  </button>

                  <button
                    type="button"
                    disabled={isUpdatingStatus || enquiry.status === 'Confirmed'}
                    onClick={() => handleStatusChange('Confirmed')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold text-left flex items-center justify-between border transition-all ${
                      enquiry.status === 'Confirmed'
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-900 shadow-xs'
                        : 'bg-stone-50 hover:bg-emerald-50 text-stone-700 hover:text-emerald-900 border-stone-200'
                    }`}
                  >
                    <span className="flex items-center">
                      <CheckCircle2 className="w-3 h-3 mr-1.5 text-emerald-600" />
                      Confirmed
                    </span>
                    {enquiry.status === 'Confirmed' && <Check className="w-3 h-3 text-emerald-700" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Assign Admin */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider">
                Assign Responsible Admin
              </label>
              <select
                value={enquiry.assignedAdminUid || ''}
                onChange={(e) => handleAssignAdmin(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 bg-white"
              >
                <option value="">-- Unassigned --</option>
                {availableAdmins.map((a) => (
                  <option key={a.uid} value={a.uid}>
                    {a.displayName} {a.roleTitle ? `(${a.roleTitle})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Private Internal Notes Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h2 className="font-serif font-bold text-lg text-maroon-950 flex items-center">
                <Lock className="w-4 h-4 mr-2 text-gold-dark" />
                Internal Admin Notes
              </h2>
              <span className="text-[10px] uppercase font-bold text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
                Admin-Only
              </span>
            </div>

            <p className="text-xs text-stone-500">
              Private notes are never shown on the customer website and are only accessible by authorized administrators.
            </p>

            {/* Add note input */}
            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                rows={3}
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Add meeting notes, tasting feedback, quotation breakdown, or discount details..."
                className="w-full p-3 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-maroon-800"
              />
              <Button
                type="submit"
                size="sm"
                variant="primary"
                isLoading={isAddingNote}
                disabled={!newNoteText.trim()}
                className="w-full"
              >
                <Send className="w-3.5 h-3.5 mr-1.5 text-gold" />
                <span>Save Private Note</span>
              </Button>
            </form>

            {/* Notes List */}
            <div className="space-y-3 pt-2">
              {enquiry.internalNotes.length === 0 ? (
                <p className="text-xs text-stone-400 text-center py-4 italic">
                  No internal notes recorded yet.
                </p>
              ) : (
                enquiry.internalNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-maroon-900">{note.adminName}</span>
                      <span className="text-stone-400">{formatDateTime(note.createdAt)}</span>
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-wrap">
                      {note.note}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Enquiry Record"
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="flex items-start space-x-3 text-sm text-stone-700">
              <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p>
                  Are you sure you want to permanently delete inquiry{' '}
                  <strong className="text-maroon-900">{enquiry.id}</strong>?
                </p>
                <p className="text-xs text-stone-500 mt-2">
                  This will erase all customer details, internal notes, and audit history.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
              >
                Cancel
              </button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteEnquiry}
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
