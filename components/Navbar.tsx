'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Lock, LogOut } from 'lucide-react';

interface NavbarProps {
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-blue-600" />
          <h1 className="text-xl font-bold text-slate-900">passManager</h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onLogout}
          className="flex items-center gap-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </nav>
  );
};
