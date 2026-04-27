// Simple in-memory vault storage
interface PasswordEntry {
  id: string;
  title: string;
  username: string;
  password: string; // encrypted
  url: string;
  notes: string;
  createdAt: number;
  updatedAt: number;
}

interface Vault {
  sessionToken: string;
  passwords: PasswordEntry[];
}

// Map to store vaults by session token
const vaults: Map<string, Vault> = new Map();

export const createVault = (sessionToken: string): Vault => {
  const vault: Vault = {
    sessionToken,
    passwords: [],
  };
  vaults.set(sessionToken, vault);
  return vault;
};

export const getVault = (sessionToken: string): Vault | undefined => {
  return vaults.get(sessionToken);
};

export const addPassword = (sessionToken: string, entry: Omit<PasswordEntry, 'id' | 'createdAt' | 'updatedAt'>): PasswordEntry | null => {
  const vault = vaults.get(sessionToken);
  if (!vault) return null;

  const now = Date.now();
  const newEntry: PasswordEntry = {
    ...entry,
    id: Math.random().toString(36).substring(2, 11),
    createdAt: now,
    updatedAt: now,
  };

  vault.passwords.push(newEntry);
  return newEntry;
};

export const updatePassword = (sessionToken: string, id: string, updates: Partial<Omit<PasswordEntry, 'id' | 'createdAt'>>): PasswordEntry | null => {
  const vault = vaults.get(sessionToken);
  if (!vault) return null;

  const entry = vault.passwords.find(p => p.id === id);
  if (!entry) return null;

  Object.assign(entry, updates, { updatedAt: Date.now() });
  return entry;
};

export const deletePassword = (sessionToken: string, id: string): boolean => {
  const vault = vaults.get(sessionToken);
  if (!vault) return false;

  const index = vault.passwords.findIndex(p => p.id === id);
  if (index === -1) return false;

  vault.passwords.splice(index, 1);
  return true;
};

export const getPasswords = (sessionToken: string): PasswordEntry[] | null => {
  const vault = vaults.get(sessionToken);
  if (!vault) return null;

  return vault.passwords;
};
