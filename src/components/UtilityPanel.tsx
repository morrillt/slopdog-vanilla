'use client';

import React from 'react';
import { Layout, X, Settings, Github, HelpCircle } from 'lucide-react';
import { useSnapshot } from 'valtio';
import { appStore } from '@/stores/appStore';

interface UtilityPanelProps {
  onClose?: () => void;
}

export const UtilityPanel: React.FC<UtilityPanelProps> = ({ onClose }) => {
  const snap = useSnapshot(appStore);

  return (
    <div className="h-full flex flex-col bg-mocha-mantle border-r border-mocha-surface1 w-80 overflow-hidden shadow-2xl p-4 space-y-6">
      <div className="p-2 border-b border-mocha-surface1 bg-mocha-crust -m-4 mb-2 px-4 py-4 relative">
        <h2 className="text-xl font-black text-mocha-blue flex items-center gap-2 uppercase tracking-tighter">
          <Layout className="w-6 h-6" />
          UTILITY PANEL
        </h2>
        <p className="text-[10px] text-mocha-subtext1 font-medium mt-1 uppercase tracking-widest opacity-70">
          Core Tools & Config
        </p>
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 bg-mocha-surface0 hover:bg-mocha-surface1 text-mocha-text rounded-full shadow-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-2 py-2 custom-scrollbar">
        {/* Settings */}
        <button
          onClick={() => appStore.isSettingsOpen = true}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-mocha-subtext1 hover:text-mocha-text hover:bg-mocha-surface0 transition-colors text-left"
        >
          <Settings className="w-5 h-5 text-mocha-lavender" />
          <span className="font-medium">Settings</span>
        </button>

        {/* Repository */}
        {snap.repositoryUrl && (
          <a
            href={snap.repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-mocha-subtext1 hover:text-mocha-text hover:bg-mocha-surface0 transition-colors"
          >
            <Github className="w-5 h-5 text-mocha-blue" />
            <span className="font-medium">Repository</span>
          </a>
        )}

        {/* What is this app? */}
        {snap.appInfoUrl && (
          <a
            href={snap.appInfoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-mocha-subtext1 hover:text-mocha-text hover:bg-mocha-surface0 transition-colors"
          >
            <HelpCircle className="w-5 h-5 text-mocha-green" />
            <span className="font-medium">What is this app?</span>
          </a>
        )}
      </div>

      <div className="pt-4 border-t border-mocha-surface1">
        <p className="text-[10px] text-mocha-subtext1 text-center italic opacity-50 uppercase tracking-widest">
          Powered by Slopdog
        </p>
      </div>
    </div>
  );
};
