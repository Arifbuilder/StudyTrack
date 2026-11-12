import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogIn, Lock, Mail, Eye, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const LoginPage: React.FC = () => {
  const { login, allUsers, viewUserProgress } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    if (!password.trim()) {
      setError('Please enter your account password to sign in. (Or click "View Progress" below to view without a password).');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await login(identifier.trim(), password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickView = (userId: string) => {
    viewUserProgress(userId);
    navigate('/dashboard');
  };

  const handleSelectAccountForLogin = (username: string) => {
    setIdentifier(username);
    const passInput = document.getElementById('login-password-input');
    passInput?.focus();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-bold text-2xl text-slate-900 dark:text-white">SyllabusSync</span>
          </Link>
          <p className="text-xs text-slate-500">Sign in to your university study dashboard</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sign In to Edit</CardTitle>
            <CardDescription>
              Enter your password to check or edit topics. View-only access requires no password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Username or Email"
                placeholder="e.g. your_username or student@ktu.edu"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                icon={<Mail className="w-4 h-4" />}
                required
              />

              <Input
                id="login-password-input"
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                required
              />

              {error && <p className="text-xs text-rose-500 font-semibold">{error}</p>}

              <Button type="submit" variant="primary" size="md" className="w-full" loading={loading}>
                <LogIn className="w-4 h-4 mr-1.5" />
                Sign In to Edit Progress
              </Button>
            </form>

            {/* Existing Accounts with Instant View & Quick Login */}
            {allUsers.length > 0 && (
              <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Accounts ({allUsers.length})
                  </p>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Eye className="w-3 h-3 text-indigo-500" /> View is password-free
                  </span>
                </div>

                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-0.5">
                  {allUsers.map((u) => (
                    <div
                      key={u.id}
                      className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between gap-2 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => handleSelectAccountForLogin(u.username)}
                        className="flex items-center gap-2 min-w-0 text-left flex-1 hover:opacity-80 transition-opacity"
                        title="Click to sign in with password"
                      >
                        <img src={u.avatarUrl} alt={u.displayName} className="w-7 h-7 rounded-full shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 dark:text-white truncate text-xs">
                            {u.displayName}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">@{u.username}</p>
                        </div>
                      </button>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* View Progress without password */}
                        <button
                          type="button"
                          onClick={() => handleQuickView(u.id)}
                          className="px-2 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md flex items-center gap-1 transition-colors"
                          title="View progress freely (no password required)"
                        >
                          <Eye className="w-3 h-3 text-indigo-500" />
                          <span>View</span>
                        </button>

                        {/* Sign in with password */}
                        <button
                          type="button"
                          onClick={() => handleSelectAccountForLogin(u.username)}
                          className="px-2 py-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-md flex items-center gap-1 transition-colors"
                          title="Sign in with password to edit"
                        >
                          <Lock className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-center pt-4 text-xs text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
                Register as Student
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
