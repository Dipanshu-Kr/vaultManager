'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye, EyeOff, Wand2 } from 'lucide-react';
import { PasswordGenerator } from './PasswordGenerator';

interface PasswordFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    username: string;
    password: string;
    url: string;
    notes: string;
  }) => Promise<void>;
  initialData?: {
    id: string;
    title: string;
    username: string;
    password: string;
    url: string;
    notes: string;
  };
}

export const PasswordForm: React.FC<PasswordFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatorOpen, setGeneratorOpen] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setUsername(initialData.username);
      setPassword(initialData.password);
      setUrl(initialData.url);
      setNotes(initialData.notes);
    } else {
      setTitle('');
      setUsername('');
      setPassword('');
      setUrl('');
      setNotes('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !username || !password) {
      alert('Please fill in title, username, and password');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ title, username, password, url, notes });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratedPassword = (newPassword: string) => {
    setPassword(newPassword);
    setGeneratorOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{initialData ? 'Edit Password' : 'Add New Password'}</DialogTitle>
            <DialogDescription>
              {initialData ? 'Update your password entry' : 'Create a new password entry'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="text-sm font-medium">
                Service Name *
              </label>
              <Input
                id="title"
                placeholder="e.g., Gmail, GitHub, Netflix"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="username" className="text-sm font-medium">
                Username/Email *
              </label>
              <Input
                id="username"
                placeholder="Your username or email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium">
                Password *
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setGeneratorOpen(true)}
                  disabled={loading}
                >
                  <Wand2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <label htmlFor="url" className="text-sm font-medium">
                Website URL
              </label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="notes" className="text-sm font-medium">
                Notes
              </label>
              <textarea
                id="notes"
                placeholder="Additional notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20" 
                disabled={loading}
              >
                {loading ? 'Saving...' : initialData ? 'Update' : 'Add Password'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <PasswordGenerator
        isOpen={generatorOpen}
        onClose={() => setGeneratorOpen(false)}
        onSelect={handleGeneratedPassword}
      />
    </>
  );
};
