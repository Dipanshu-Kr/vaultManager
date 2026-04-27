'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { PasswordForm } from './PasswordForm';
import { PasswordCard } from './PasswordCard';
import { Navbar } from './Navbar';
import { Plus, Search, Loader2 } from 'lucide-react';

interface PasswordEntry {
  id: string;
  website: string;
  username: string;
  password: string;
  url: string;
  user_id: number;
}

interface DashboardProps {
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<PasswordEntry | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPasswords = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId || userId === "null" || userId === "undefined") {
      onLogout(); // Security check: if somehow reached here without userId, logout
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/vault?userId=${userId}`);
      const data = await response.json();
      
      // FIX: Ensure data is an array to avoid .map error
      if (Array.isArray(data)) {
        setPasswords(data);
      } else {
        console.error("API did not return an array:", data);
        setPasswords([]);
      }
    } catch (err) {
      console.error('Error fetching passwords:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPasswords();
  }, []);

  const handleAddOrUpdate = async (formData: any) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const apiUrl = editingEntry ? `/api/vault/${editingEntry.id}` : '/api/vault';
      const method = editingEntry ? 'PUT' : 'POST';

      const response = await fetch(apiUrl, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId
        }),
      });

      if (!response.ok) throw new Error("Failed to save");

      setFormOpen(false);
      setEditingEntry(null);
      
      // Refresh data without page reload
      fetchPasswords();

    } catch (err) {
      console.error('Error saving password:', err);
      alert('Failed to save password');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      const response = await fetch(`/api/vault/${id}`, { method: "DELETE" });
      const data = await response.json();

      if (data.success) {
        // Update state directly for smooth UI
        setPasswords(prev => prev.filter(p => p.id !== id));
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      console.error(err);
      alert("Delete error");
    }
  };

  const filteredPasswords = passwords.filter(p =>
    (p.website || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.username || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.url || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onLogout={onLogout} />

      <main className="max-w-6xl mx-auto p-6">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Your Vault</h1>
              <p className="text-slate-500 mt-1">Securely manage your credentials</p>
            </div>
            <Button
              onClick={() => {
                setEditingEntry(null);
                setFormOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 h-11 px-6 font-semibold shadow-lg shadow-blue-500/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Password
            </Button>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <Input
              type="text"
              placeholder="Search by website, username, or URL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 bg-white border-slate-200 focus:ring-2 focus:ring-blue-500/10 transition-all text-lg"
            />
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              <p className="text-slate-500 mt-4 font-medium">Loading your vault...</p>
            </div>
          ) : filteredPasswords.length === 0 ? (
            <Card className="p-16 text-center border-dashed border-2 bg-slate-50/50">
              <div className="max-w-xs mx-auto">
                <p className="text-slate-500 mb-6 text-lg">
                  {passwords.length === 0
                    ? 'Your vault is empty. Start by adding your first password.'
                    : 'No credentials found matching your search.'}
                </p>
                {passwords.length === 0 && (
                  <Button
                    onClick={() => {
                      setEditingEntry(null);
                      setFormOpen(true);
                    }}
                    variant="outline"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold"
                  >
                    Create First Entry
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPasswords.map(password => (
                <PasswordCard
                  key={password.id}
                  // Map the backend structure to what PasswordCard expects if different
                  entry={{
                    id: password.id,
                    title: password.website,
                    username: password.username,
                    password: password.password,
                    url: password.url,
                    notes: "", // Adding empty notes to satisfy common entry types
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                  }}
                  onEdit={(entry) => {
                    // Pre-fill form with correct fields
                    setEditingEntry({
                      id: entry.id,
                      website: entry.title,
                      username: entry.username,
                      password: entry.password,
                      url: entry.url,
                      user_id: parseInt(localStorage.getItem("userId") || "0")
                    });
                    setFormOpen(true);
                  }}
                  onDelete={() => handleDelete(password.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <PasswordForm
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingEntry(null);
        }}
        onSubmit={handleAddOrUpdate}
        initialData={editingEntry ? {
          id: editingEntry.id,
          title: editingEntry.website,
          username: editingEntry.username,
          password: editingEntry.password,
          url: editingEntry.url,
          notes: ""
        } : undefined}
      />
    </div>
  );
};
