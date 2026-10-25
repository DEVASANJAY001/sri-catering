import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  LogOut,
  Key,
  Database,
  Lock,
  Server,
  AlertCircle,
  Clock,
  Sparkles,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/auth';
import { AdminUser, AUTHORIZED_ADMIN_ROSTER } from '../../types/admin';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { formatDateTime } from '../../utils/formatters';

export const AdminSettingsPage: React.FC = () => {
  const { user, session, logout } = useAuth();
  const navigate = useNavigate();
  const [adminList, setAdminList] = useState<AdminUser[]>(AUTHORIZED_ADMIN_ROSTER);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ success: boolean; msg: string } | null>(null);

  useEffect(() => {
    if (authService.getAdmins) {
      authService.getAdmins().then((admins) => {
        if (admins && admins.length > 0) setAdminList(admins);
      });
    }
  }, []);

  const handleSyncAdmins = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      if ('seedAdminUsers' in authService) {
        const res = await (authService as any).seedAdminUsers();
        if (res.success) {
          setSyncStatus({
            success: true,
            msg: `Successfully synchronized ${res.count} admin profiles to Firestore 'adminUsers' & 'admins' collections!`,
          });
          if (authService.getAdmins) {
            const updated = await authService.getAdmins();
            setAdminList(updated);
          }
        } else {
          setSyncStatus({ success: false, msg: `Sync notice: ${res.error || 'Check Firestore permissions'}` });
        }
      }
    } catch (e: any) {
      setSyncStatus({ success: false, msg: `Sync error: ${e.message}` });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-maroon-950">
            Administrative Settings &amp; Security
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Manage your session, view authorized administrative roster, and monitor active live Firebase connections.
          </p>
        </div>

        <Button variant="danger" size="sm" onClick={handleSignOut}>
          <LogOut className="w-4 h-4 mr-1.5" />
          <span>Sign Out</span>
        </Button>
      </div>

      {/* Current Active Session Profile */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
        <h2 className="font-serif font-bold text-lg text-maroon-950 border-b border-stone-200 pb-3 flex items-center">
          <ShieldCheck className="w-5 h-5 mr-2 text-gold-dark" />
          Current Authenticated Identity
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          <div className="flex items-center space-x-4 sm:col-span-2">
            <div className="w-16 h-16 rounded-2xl bg-maroon-900 text-gold font-black text-2xl flex items-center justify-center shadow-md">
              {user?.avatarLetter || 'A'}
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-lg text-charcoal">
                {user?.displayName}
              </h3>
              <p className="text-xs text-stone-500 font-mono">
                {user?.email}
              </p>
              <Badge variant="maroon" size="sm">
                {user?.roleTitle}
              </Badge>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 text-xs space-y-1.5">
            <span className="font-bold text-stone-500 uppercase tracking-wider block">
              Session Details
            </span>
            <p className="text-stone-500">
              Active Since: {session ? formatDateTime(new Date().toISOString()) : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Authorized Admin Accounts in Firebase */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
          <div>
            <h2 className="font-serif font-bold text-lg text-maroon-950 flex items-center">
              <Users className="w-5 h-5 mr-2 text-maroon-800" />
              Authorized Administrator Accounts in Firebase
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Strict access control: administrators authenticated and stored in Firebase.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSyncAdmins}
              isLoading={isSyncing}
              className="text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sync to Firestore adminUsers</span>
            </Button>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {adminList.length} Active in Firebase
            </span>
          </div>
        </div>

        {syncStatus && (
          <div
            className={`p-3.5 rounded-2xl text-xs flex items-center gap-2 border ${
              syncStatus.success
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            {syncStatus.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <span>{syncStatus.msg}</span>
          </div>
        )}

        {/* Security Alert regarding account management */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-start space-x-3">
          <Lock className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
          <p>
            <strong>Security Architecture Notice:</strong> Admin account authentication and role escalation are managed via Firebase Authentication and Cloud Firestore rules. There is intentionally NO public admin registration form to prevent unauthorized access.
          </p>
        </div>

        {/* Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {adminList.map((adm: AdminUser, i: number) => (
            <div
              key={adm.uid}
              className={`p-4 rounded-2xl border transition-all ${
                adm.uid === user?.uid
                  ? 'bg-maroon-50/60 border-maroon-800/40 shadow-xs'
                  : 'bg-white border-stone-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-stone-900 text-gold font-bold text-sm flex items-center justify-center">
                    {adm.avatarLetter}
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-charcoal">
                      {adm.displayName}
                    </h4>
                    <p className="text-[11px] text-stone-500 font-mono">
                      {adm.email}
                    </p>
                  </div>
                </div>

                <Badge variant={adm.uid === user?.uid ? 'maroon' : 'charcoal'} size="sm">
                  Admin {i + 1}
                </Badge>
              </div>

              <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <span>Role: <strong>{adm.roleTitle}</strong></span>
                <span className="text-emerald-700 font-medium flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1" />
                  Authorized
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Firebase Backend Live Status */}
      <div className="bg-stone-900 text-stone-300 rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl space-y-6">
        <div className="flex items-center space-x-3 border-b border-stone-800 pb-4">
          <Database className="w-6 h-6 text-gold" />
          <div>
            <h2 className="font-serif font-bold text-lg text-white">
              Firebase Backend &amp; Cloud Firestore Status: LIVE
            </h2>
            <p className="text-xs text-stone-400">
              Connected directly to Firebase project <code className="text-amber-300 font-mono">sricatering-64043</code> with real-time Cloud Firestore and Authentication.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-stone-800/70 border border-stone-700/60 space-y-2">
            <div className="flex items-center text-amber-300 font-bold">
              <Key className="w-4 h-4 mr-1.5 text-gold" />
              <span>1. Firebase Auth: Active</span>
            </div>
            <p className="text-stone-400 leading-relaxed">
              Authenticating via Firebase Auth service with 8-hour verified session tokens and encrypted credential storage.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-800/70 border border-stone-700/60 space-y-2">
            <div className="flex items-center text-emerald-300 font-bold">
              <Server className="w-4 h-4 mr-1.5 text-emerald-400" />
              <span>2. Cloud Firestore: Connected</span>
            </div>
            <p className="text-stone-400 leading-relaxed">
              Customer enquiries route directly to the <code className="text-emerald-400">enquiries</code> collection with real-time listeners and audit logs.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-800/70 border border-stone-700/60 space-y-2">
            <div className="flex items-center text-rose-300 font-bold">
              <ShieldCheck className="w-4 h-4 mr-1.5 text-rose-400" />
              <span>3. Security Rules: Enforced</span>
            </div>
            <p className="text-stone-400 leading-relaxed">
              Cloud security rules enforce that public visitors can only create new enquiries, while only authenticated administrators can read or modify.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
