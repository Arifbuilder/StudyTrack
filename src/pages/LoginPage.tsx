import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogIn, Lock, Mail, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const LoginPage: React.FC = () => {
  const { login, allUsers, switchUser } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;
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
            <CardTitle className="text-lg">Log In to Account</CardTitle>
            <CardDescription>Enter your username or email address</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Username or Email"
                placeholder="e.g. arif_ktu or arif@ktu.edu"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                icon={<Mail className="w-4 h-4" />}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
              />

              {error && <p className="text-xs text-rose-500 font-semibold">{error}</p>}

              <Button type="submit" variant="primary" size="md" className="w-full" loading={loading}>
                <LogIn className="w-4 h-4 mr-1.5" />
                Sign In
              </Button>
            </form>

            {/* Quick Demo Switcher */}
            <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center">
                One-Click Quick Sign In
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {allUsers.slice(0, 4).map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchUser(u.id);
                      navigate('/dashboard');
                    }}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 bg-slate-50 dark:bg-slate-800/60 text-left transition-colors flex items-center gap-2"
                  >
                    <img src={u.avatarUrl} alt={u.displayName} className="w-6 h-6 rounded-full" />
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-white truncate text-[11px]">
                        {u.displayName.split(' ')[0]}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">@{u.username}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

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
