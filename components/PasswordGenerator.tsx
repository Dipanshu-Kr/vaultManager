'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Copy, RefreshCw } from 'lucide-react';

interface PasswordGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (password: string) => void;
}

export const PasswordGenerator: React.FC<PasswordGeneratorProps> = ({ isOpen, onClose, onSelect }) => {
  const [length, setLength] = useState(16);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let chars = '';
    if (useLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (useUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useNumbers) chars += '0123456789';
    if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) {
      setGeneratedPassword('');
      return;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(password);
    setCopied(false);
  };

  React.useEffect(() => {
    if (isOpen) {
      generatePassword();
    }
  }, [isOpen, length, useUppercase, useLowercase, useNumbers, useSymbols]);

  const handleCopyAndSelect = () => {
    navigator.clipboard.writeText(generatedPassword);
    setCopied(true);
    onSelect(generatedPassword);
    setTimeout(() => onClose(), 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Password Generator</DialogTitle>
          <DialogDescription>Create a strong password with customizable options</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-slate-100 rounded-lg">
            <p className="text-sm text-slate-600 mb-2">Generated Password:</p>
            <p className="font-mono text-lg text-slate-900 break-all">{generatedPassword}</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Length: {length}</label>
              <Input
                type="range"
                min="4"
                max="32"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="mt-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="uppercase"
                  checked={useUppercase}
                  onCheckedChange={(checked) => setUseUppercase(checked as boolean)}
                />
                <label htmlFor="uppercase" className="text-sm cursor-pointer">
                  Uppercase (A-Z)
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="lowercase"
                  checked={useLowercase}
                  onCheckedChange={(checked) => setUseLowercase(checked as boolean)}
                />
                <label htmlFor="lowercase" className="text-sm cursor-pointer">
                  Lowercase (a-z)
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="numbers"
                  checked={useNumbers}
                  onCheckedChange={(checked) => setUseNumbers(checked as boolean)}
                />
                <label htmlFor="numbers" className="text-sm cursor-pointer">
                  Numbers (0-9)
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="symbols"
                  checked={useSymbols}
                  onCheckedChange={(checked) => setUseSymbols(checked as boolean)}
                />
                <label htmlFor="symbols" className="text-sm cursor-pointer">
                  Symbols (!@#$%...)
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={generatePassword}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
            <Button
              className="flex-1"
              onClick={handleCopyAndSelect}
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied ? 'Copied!' : 'Use Password'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
