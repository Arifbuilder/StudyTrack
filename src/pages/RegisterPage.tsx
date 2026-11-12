import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, UserPlus, Lock, Mail, User, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const invitedBy = searchParams.get('invitedBy');

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim() || !username.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields including a password.');
      return;
    }
    if (password.trim().length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await register({
        displayName: displayName.trim(),
        username: username.trim().toLowerCase().replace(/\s+/g, '_'),
        email: email.trim().toLowerCase(),
        password: password.trim(),
        role: 'user',
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-bold text-2xl text-slate-900 dark:text-white">SyllabusSync</span>
          </Link>
          <p className="text-xs text-slate-500">
            Create your personal KTU S7 study account
          </p>
        </div>

        {invitedBy && (
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs text-indigo-800 dark:text-indigo-200 text-center font-medium">
            You were invited by classmate <strong>@{invitedBy}</strong>!
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Create Student Account</CardTitle>
            <CardDescription>
              Start with fresh 0% progress and track all 15 modules independently.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                placeholder="e.g. Rahul Varma"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                icon={<User className="w-4 h-4" />}
                required
              />

              <Input
                label="Unique Username"
                placeholder="e.g. rahul_ktu"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                icon={<span className="text-xs font-mono">@</span>}
                required
              />

              <Input
                label="College Email Address"
                type="email"
                placeholder="e.g. rahul@cet.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-4 h-4" />}
                required
              />

              <Input
                label="Account Password"
                type="password"
                placeholder="Choose a password (min. 4 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                required
              />

              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800 flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Account Security:</strong> Anyone can view your syllabus progress freely without a password, but only you can check or edit topics using your password.
                </span>
              </div>

              {error && <p className="text-xs text-rose-500 font-semibold">{error}</p>}

              <Button type="submit" variant="primary" size="md" className="w-full" loading={loading}>
                <UserPlus className="w-4 h-4 mr-1.5" />
                Register Account
              </Button>
            </form>

            <div className="text-center pt-4 text-xs text-slate-500">
              Already registered?{' '}
              <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
