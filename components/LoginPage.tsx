'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [masterPassword, setMasterPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(masterPassword);
    } catch (err) {
      setError('Invalid master password. Try "password123"');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Password Manager</CardTitle>
          <CardDescription>Enter your master password to unlock your vault</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Master Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter master password"
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Unlocking...' : 'Unlock Vault'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <p className="text-xs text-slate-500 text-center">Demo password: <span className="font-mono">password123</span></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
