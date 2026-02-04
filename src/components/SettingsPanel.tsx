'use client';

import React from 'react';
import { Button } from './ui/Button';
import { Settings as SettingsIcon, X } from 'lucide-react';
import { useSnapshot } from 'valtio';
import { appStore } from '@/stores/appStore';

interface SettingsPanelProps {
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  onClose,
}) => {
  const snap = useSnapshot(appStore);

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
              value={snap.projectName}
              onChange={(e) => appStore.projectName = e.target.value}
              placeholder="Enter project name"
            />
            <p className="text-xs text-mocha-subtext0 mt-1">
              Displayed in the header
            </p>
          </section>

          <section>
            <label className="block text-sm font-medium text-mocha-subtext1 mb-2">
              Repository URL
            </label>
            <input
              type="url"
              className="w-full p-3 bg-mocha-surface0 border border-mocha-surface1 rounded-md text-mocha-text focus:outline-none focus:ring-2 focus:ring-mocha-blue"
              value={snap.repositoryUrl}
              onChange={(e) => appStore.repositoryUrl = e.target.value}
              placeholder="https://github.com/your/repo"
            />
            <p className="text-xs text-mocha-subtext0 mt-1">
              Link shown in utility panel
            </p>
          </section>

          <section>
            <label className="block text-sm font-medium text-mocha-subtext1 mb-2">
              App Info URL
            </label>
            <input
              type="url"
              className="w-full p-3 bg-mocha-surface0 border border-mocha-surface1 rounded-md text-mocha-text focus:outline-none focus:ring-2 focus:ring-mocha-blue"
              value={snap.appInfoUrl}
              onChange={(e) => appStore.appInfoUrl = e.target.value}
              placeholder="https://example.com/about"
            />
            <p className="text-xs text-mocha-subtext0 mt-1">
              "What is this app?" link in utility panel
            </p>
          </section>

          <section>
            <label className="block text-sm font-medium text-mocha-subtext1 mb-2">
              Orientation Video URL
            </label>
            <input
              type="url"
              className="w-full p-3 bg-mocha-surface0 border border-mocha-surface1 rounded-md text-mocha-text focus:outline-none focus:ring-2 focus:ring-mocha-blue"
              value={snap.orientationVideoUrl}
              onChange={(e) => appStore.orientationVideoUrl = e.target.value}
              placeholder="https://youtube.com/watch?v=..."
            />
            <p className="text-xs text-mocha-subtext0 mt-1">
              Video link shown in header navigation
            </p>
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
