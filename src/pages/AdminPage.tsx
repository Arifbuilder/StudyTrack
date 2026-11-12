import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  Users,
  Trash2,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  Lock,
  Layers,
  History,
  Download,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { api } from '../services/api';
import { UserProfile, AuditLog } from '../types';

export const AdminPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());

  // Deletion loading state
  const [isDeleting, setIsDeleting] = useState(false);

  // Individual deletion modal
  const [singleDeleteUser, setSingleDeleteUser] = useState<UserProfile | null>(null);

  // Bulk deletion modal
  const [bulkModalOpen, setBulkModalOpen] = useState(false);

  // Super-admin Delete All Users modal
  const [deleteAllModalOpen, setDeleteAllModalOpen] = useState(false);
  const [confirmPhrase, setConfirmPhrase] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');

  const loadData = async () => {
    const allUsers = await api.admin.getAllUsers();
    setUsers(allUsers);
    const logs = await api.admin.getAuditLogs();
    setAuditLogs(logs);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Access control check
  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return (
      <div className="p-12 text-center space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          Access Restricted: Administrator Credentials Required
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          The administrative control panel is restricted to verified curriculum administrators and super-administrators.
        </p>
        <Button variant="primary" onClick={() => navigate('/dashboard')}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  const isSuperAdmin = user.role === 'super_admin';

  // Toggle user selection for bulk actions
  const toggleSelectUser = (id: string) => {
    if (id === user.id) return; // Cannot select self for bulk delete
    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllExceptSelf = () => {
    const selectable = users.filter((u) => u.id !== user.id).map((u) => u.id);
    setSelectedUserIds(new Set(selectable));
  };

  const handleConfirmSingleDelete = async () => {
    if (!singleDeleteUser) return;
    setIsDeleting(true);
    try {
      const deletedId = singleDeleteUser.id;
      await api.admin.deleteUser(deletedId, user.id);
      setUsers((prev) => prev.filter((u) => u.id !== deletedId));
      setSingleDeleteUser(null);
      await loadData();
      refreshUser();
    } catch (err: any) {
      alert(err.message || 'Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmBulkDelete = async () => {
    if (!isSuperAdmin || selectedUserIds.size === 0) return;
    setIsDeleting(true);
    try {
      const idsToDelete = Array.from(selectedUserIds);
      await api.admin.bulkDeleteUsers(idsToDelete, user.id);
      setUsers((prev) => prev.filter((u) => !selectedUserIds.has(u.id)));
      setSelectedUserIds(new Set());
      setBulkModalOpen(false);
      await loadData();
      refreshUser();
    } catch (err: any) {
      alert(err.message || 'Bulk deletion failed');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmDeleteAll = async () => {
    if (!isSuperAdmin) return;
    setIsDeleting(true);
    setDeleteError('');
    setDeleteSuccess('');

    try {
      const count = await api.admin.deleteAllUsers(user.id, confirmPhrase.trim());
      setUsers((prev) => prev.filter((u) => u.id === user.id));
      setDeleteSuccess(`Successfully deleted ${count} student accounts. Super Admin preserved.`);
      setTimeout(() => {
        setDeleteAllModalOpen(false);
        setConfirmPhrase('');
        setDeleteSuccess('');
      }, 2000);
      await loadData();
      refreshUser();
    } catch (err: any) {
      setDeleteError(err.message || 'Mass deletion failed.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Export audit logs as CSV
  const handleExportAuditLogs = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Timestamp,Actor,Action,EntityType,EntityId'].join(',') +
      '\n' +
      auditLogs
        .map((l) => `${l.createdAt},${l.actorUsername},${l.action},${l.entityType},${l.entityId || ''}`)
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `syllabussync_audit_log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="danger" size="sm">
              <ShieldAlert className="w-3.5 h-3.5 mr-1" />
              Administrative Control Unit
            </Badge>
            <span className="text-xs font-mono text-slate-500">
              Role: <strong>{user.role.toUpperCase()}</strong>
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            System Administration & Security
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Protected management of student accounts, official syllabus layers, audit logging, and bulk account operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportAuditLogs}>
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export Audit Log (CSV)
          </Button>
        </div>
      </div>

      {/* Admin KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-white">{users.length}</span>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Total Accounts
            </p>
            <span className="text-[10px] text-slate-400">Registered users in database</span>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-white">15</span>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Official Modules
            </p>
            <span className="text-[10px] text-slate-400">AI, BMI, SIC KTU S7</span>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/60 flex items-center justify-center text-violet-600 shrink-0">
            <History className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-white">{auditLogs.length}</span>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Audit Logs
            </p>
            <span className="text-[10px] text-slate-400">Logged security operations</span>
          </div>
        </Card>
      </div>

      {/* User Management Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" />
                User Account Management
              </CardTitle>
              <CardDescription>
                View registered students, inspect roles, and execute safe account deletions.
              </CardDescription>
            </div>

            {/* Bulk Action Controls */}
            {isSuperAdmin && (
              <div className="flex items-center gap-2">
                {selectedUserIds.size > 0 && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setBulkModalOpen(true)}
                    className="text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Delete Selected ({selectedUserIds.size})
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectAllExceptSelf}
                  className="text-xs"
                >
                  Select All
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setDeleteAllModalOpen(true)}
                  className="text-xs bg-rose-700 hover:bg-rose-800"
                >
                  <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                  Delete All Users (Super-Admin)
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  {isSuperAdmin && <th className="p-3 w-8"></th>}
                  <th className="p-3 font-semibold">User</th>
                  <th className="p-3 font-semibold">Username</th>
                  <th className="p-3 font-semibold">Role</th>
                  <th className="p-3 font-semibold">University / College</th>
                  <th className="p-3 font-semibold">Registered</th>
                  <th className="p-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {users.map((u) => {
                  const isSelf = u.id === user.id;
                  const isSuperAdminAccount = u.role === 'super_admin';

                  return (
                    <tr
                      key={u.id}
                      className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/40 ${
                        isSelf ? 'bg-indigo-50/20 dark:bg-indigo-950/20' : ''
                      }`}
                    >
                      {isSuperAdmin && (
                        <td className="p-3">
                          {!isSelf && (
                            <input
                              type="checkbox"
                              checked={selectedUserIds.has(u.id)}
                              onChange={() => toggleSelectUser(u.id)}
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                          )}
                        </td>
                      )}
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={u.avatarUrl}
                            alt={u.displayName}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {u.displayName}
                            </span>
                            {isSelf && (
                              <span className="ml-1 text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                                (You)
                              </span>
                            )}
                            <p className="text-[10px] text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-slate-600 dark:text-slate-300">
                        @{u.username}
                      </td>
                      <td className="p-3">
                        <Badge
                          variant={
                            u.role === 'super_admin'
                              ? 'danger'
                              : u.role === 'admin'
                              ? 'warning'
                              : 'default'
                          }
                          size="sm"
                        >
                          {u.role.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-3 text-slate-500 max-w-[180px] truncate">
                        {u.collegeName || u.university}
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-400">
                        {u.createdAt.split('T')[0]}
                      </td>
                      <td className="p-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isSuperAdminAccount && !isSelf}
                          onClick={() => setSingleDeleteUser(u)}
                          className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 p-1.5"
                          title={
                            isSuperAdminAccount && !isSelf
                              ? 'Super Admin accounts cannot be deleted'
                              : 'Delete account'
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <History className="w-4 h-4 text-violet-500" />
            Administrative Audit Trail
          </CardTitle>
          <CardDescription>
            Immutable event logs recording account creations, deletions, and administrative actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto max-h-72 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 sticky top-0">
                <tr>
                  <th className="p-2.5 font-semibold">Timestamp</th>
                  <th className="p-2.5 font-semibold">Actor</th>
                  <th className="p-2.5 font-semibold">Action</th>
                  <th className="p-2.5 font-semibold">Entity</th>
                  <th className="p-2.5 font-semibold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-mono text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-2.5 text-slate-400">{log.createdAt.replace('T', ' ').substring(0, 19)}</td>
                    <td className="p-2.5 font-bold text-indigo-600 dark:text-indigo-400">@{log.actorUsername}</td>
                    <td className="p-2.5">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-semibold">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-500">{log.entityType} ({log.entityId})</td>
                    <td className="p-2.5 text-slate-400 truncate max-w-[200px]">
                      {JSON.stringify(log.details || {})}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal: Single Account Deletion Confirmation */}
      <Modal
        isOpen={Boolean(singleDeleteUser)}
        onClose={() => setSingleDeleteUser(null)}
        title="Confirm Account Deletion"
        description="Irreversible destructive action."
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-300 space-y-2">
            <p className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Warning: Permanent Data Cascade
            </p>
            <p>
              Deleting <strong>{singleDeleteUser?.displayName}</strong> (@{singleDeleteUser?.username}) will permanently erase:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li>All topic completion records & revision logs</li>
              <li>Personal study tasks and private topic notes</li>
              <li>Custom syllabus layers and group memberships</li>
              <li>Active friendships and pending invitations</li>
            </ul>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setSingleDeleteUser(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" loading={isDeleting} onClick={handleConfirmSingleDelete}>
              Permanently Delete Account
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Bulk Account Deletion (Super-Admin) */}
      <Modal
        isOpen={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        title="Bulk Account Deletion"
        description="Super-Admin privileged operation."
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-300 space-y-2">
            <p className="font-bold">
              You have selected {selectedUserIds.size} student accounts for deletion.
            </p>
            <p>
              This action cannot be undone. All selected study progress and associated relational records will be purged immediately.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setBulkModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" loading={isDeleting} onClick={handleConfirmBulkDelete}>
              Delete {selectedUserIds.size} Accounts
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Super-Admin "DELETE ALL USERS" Special Safeguarded Operation */}
      <Modal
        isOpen={deleteAllModalOpen}
        onClose={() => {
          setDeleteAllModalOpen(false);
          setConfirmPhrase('');
          setDeleteError('');
        }}
        title="DANGER: Delete All Registered Accounts"
        description="Destructive Super-Admin system purge."
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-rose-600 text-white space-y-2">
            <div className="flex items-center gap-2 font-black text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>SUPER-ADMIN LEVEL SAFEGUARD</span>
            </div>
            <p className="text-xs leading-relaxed opacity-95">
              This will permanently purge <strong>{users.filter((u) => u.id !== user.id).length}</strong> registered student accounts.
              The Super-Admin account will be safely preserved.
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Type the exact phrase below to confirm:
            </label>
            <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-xs font-bold text-slate-800 dark:text-slate-200 select-all border border-slate-200 dark:border-slate-700">
              DELETE ALL USERS PERMANENTLY
            </div>
            <input
              type="text"
              value={confirmPhrase}
              onChange={(e) => setConfirmPhrase(e.target.value)}
              placeholder="Type phrase here..."
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {deleteError && <p className="text-xs text-rose-500 font-semibold">{deleteError}</p>}
          {deleteSuccess && <p className="text-xs text-emerald-600 font-semibold">{deleteSuccess}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteAllModalOpen(false)}>
              Abort
            </Button>
            <Button
              variant="danger"
              size="sm"
              loading={isDeleting}
              disabled={confirmPhrase.trim() !== 'DELETE ALL USERS PERMANENTLY'}
              onClick={handleConfirmDeleteAll}
              className="bg-rose-700 hover:bg-rose-800"
            >
              Confirm and Purge All Accounts
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
