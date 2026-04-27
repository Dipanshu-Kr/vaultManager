'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface SetupPageProps {
  onSetupComplete: () => void;
}

export const SetupPage: React.FC<SetupPageProps> = ({ onSetupComplete }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || (isLogin ? 'Login failed' : 'Signup failed'));
      }

      if (isLogin) {
        localStorage.setItem("userId", data.userId.toString());
        onSetupComplete();
      } else {
        setSuccess(true);
        setTimeout(() => {
          setIsLogin(true);
          setSuccess(false);
          setFormData({ email: formData.email, password: '', confirmPassword: '' });
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="space-y-1 text-center pb-8">
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </CardTitle>
          <CardDescription className="text-slate-500">
            {isLogin ? 'Login to your secure vault' : 'Start managing your passwords securely'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <p className="text-sm font-medium text-emerald-800">Account created! Redirecting to login...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <Input
                type="email"
                placeholder="name@example.com"
                className="h-11 bg-slate-50/50 border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                className="h-11 bg-slate-50/50 border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={loading}
                required
              />
            </div>

            {!isLogin && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                <label className="text-sm font-semibold text-slate-700">Confirm Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="h-11 bg-slate-50/50 border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  disabled={loading}
                  required
                />
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-3.5 bg-rose-50 border border-rose-100 rounded-xl animate-in shake">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <p className="text-sm font-medium text-rose-800">{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all active:scale-[0.98]" 
              disabled={loading}
            >
              {loading ? (isLogin ? 'Logging in...' : 'Creating Account...') : (isLogin ? 'Login' : 'Create Account')}
            </Button>
          </form>

          <div className="mt-8 text-center border-t pt-6">
            <p className="text-sm text-slate-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                {isLogin ? 'Sign up here' : 'Login here'}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
