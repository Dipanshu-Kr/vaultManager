import { NextRequest, NextResponse } from 'next/server';
import { hashMasterPassword } from '@/lib/encryption';
import { createVault } from '@/lib/vault';

// Simple in-memory master password store (for demo purposes)
const MASTER_PASSWORD_HASH = hashMasterPassword('password123');

// Store valid sessions in a global Set
const validSessions = new Set<string>();

export async function POST(request: NextRequest) {
  const { masterPassword } = await request.json();

  if (!masterPassword) {
    return NextResponse.json({ error: 'Master password is required' }, { status: 400 });
  }

  const hash = hashMasterPassword(masterPassword);

  if (hash !== MASTER_PASSWORD_HASH) {
    return NextResponse.json({ error: 'Invalid master password' }, { status: 401 });
  }

  const sessionToken = `session_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
  validSessions.add(sessionToken);
  createVault(sessionToken);

  return NextResponse.json({ sessionToken }, { status: 200 });
}

// Export the sessions set so other routes can access it
export { validSessions };

