'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';

interface PasswordEntry {
  id: string;
  title: string;
  username: string;
  password: string;
  url: string;
  notes: string;
  createdAt: number;
  updatedAt: number;
}

interface PasswordCardProps {
  entry: PasswordEntry;
  onEdit: (entry: PasswordEntry) => void;
  onDelete: (id: string) => Promise<void>;
}

export const PasswordCard: React.FC<PasswordCardProps> = ({ entry, onEdit, onDelete }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleCopyPassword = async () => {
    try {
      await navigator.clipboard.writeText(entry.password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${entry.title}"?`)) {
      setDeleting(true);
      try {
        await onDelete(entry.id);
      } finally {
        setDeleting(false);
      }
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-slate-900">{entry.title}</h3>
            {entry.url && (
              <p className="text-xs text-slate-500">{entry.url}</p>
            )}
          </div>

          <div className="space-y-2">
            <div>
              <p className="text-xs font-medium text-slate-500">Username</p>
              <p className="text-sm text-slate-700">{entry.username}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">Password</p>
              <div className="flex items-center gap-2 mt-1">
                <code className="flex-1 text-sm bg-slate-100 px-2 py-1 rounded font-mono">
                  {showPassword ? entry.password : '•'.repeat(entry.password.length)}
                </code>
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-2 hover:bg-slate-100 rounded transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-slate-600" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-600" />
                  )}
                </button>
              </div>
            </div>

            {entry.notes && (
              <div>
                <p className="text-xs font-medium text-slate-500">Notes</p>
                <p className="text-sm text-slate-600">{entry.notes}</p>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-3 border-t border-slate-200">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={handleCopyPassword}
            >
              <Copy className="w-4 h-4 mr-1" />
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(entry)}
              disabled={deleting}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDelete}
              disabled={deleting}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
