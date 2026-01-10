'use client';

import React from 'react';
import { Layout, X } from 'lucide-react';

interface UtilityPanelProps {
  onClose?: () => void;
}

export const UtilityPanel: React.FC<UtilityPanelProps> = ({ onClose }) => {
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

      <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-6 py-2 custom-scrollbar">
        {/* Content goes here in the future */}
        <div className="flex flex-col items-center justify-center h-full opacity-20 italic text-sm">
          No utilities active
        </div>
      </div>

      <div className="pt-4 border-t border-mocha-surface1">
        <p className="text-[10px] text-mocha-subtext1 text-center italic opacity-50 uppercase tracking-widest">
          Slopdog RPG Scaffold
        </p>
      </div>
    </div>
  );
};
