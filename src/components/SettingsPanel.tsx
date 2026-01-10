'use client';

import React from 'react';
import { Button } from './ui/Button';
import { Settings as SettingsIcon, X } from 'lucide-react';

interface SettingsPanelProps {
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md h-full bg-mocha-mantle border-l border-mocha-surface1 p-6 shadow-2xl overflow-y-auto overflow-x-hidden custom-scrollbar animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-mocha-lavender" />
            <h2 className="text-2xl font-bold text-mocha-text">Settings</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="space-y-6">
          <section>
            <label className="block text-sm font-medium text-mocha-subtext1 mb-2">
              Project Name
            </label>
            <input
              type="text"
              className="w-full p-3 bg-mocha-surface0 border border-mocha-surface1 rounded-md text-mocha-text focus:outline-none focus:ring-2 focus:ring-mocha-blue"
              defaultValue="NEW PROJECT"
            />
          </section>

          <section>
            <label className="block text-sm font-medium text-mocha-subtext1 mb-2">
              Theme
            </label>
            <select className="w-full p-3 bg-mocha-surface0 border border-mocha-surface1 rounded-md text-mocha-text focus:outline-none focus:ring-2 focus:ring-mocha-blue">
              <option>Catppuccin Mocha</option>
              <option>Catppuccin Latte</option>
              <option>Catppuccin Frappé</option>
              <option>Catppuccin Macchiato</option>
            </select>
          </section>

          <section>
            <label className="block text-sm font-medium text-mocha-subtext1 mb-2">
              Description
            </label>
            <textarea
              className="w-full h-32 p-3 bg-mocha-surface0 border border-mocha-surface1 rounded-md text-mocha-text focus:outline-none focus:ring-2 focus:ring-mocha-blue"
              placeholder="Project description..."
            />
          </section>

          <div className="pt-6 border-t border-mocha-surface1">
            <Button className="w-full" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
