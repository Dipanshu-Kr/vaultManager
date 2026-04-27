'use client';

import { useEffect, useState } from "react";
import { SetupPage } from "@/components/SetupPage";
import { Dashboard } from "@/components/Dashboard";

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // 1. Mark as mounted to prevent hydration errors
    setIsMounted(true);
    
    // 2. Check for existing session
    const storedId = localStorage.getItem("userId");
    if (storedId && storedId !== "null" && storedId !== "undefined") {
      setUserId(storedId);
    }
  }, []);

  const handleLoginSuccess = () => {
    const id = localStorage.getItem("userId");
    setUserId(id);
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setUserId(null);
  };

  // Wait for client-side mount
  if (!isMounted) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
  }

  // If no user, show login/signup
  if (!userId) {
    return <SetupPage onSetupComplete={handleLoginSuccess} />;
  }

  // If user exists, show dashboard
  return <Dashboard onLogout={handleLogout} />;
}