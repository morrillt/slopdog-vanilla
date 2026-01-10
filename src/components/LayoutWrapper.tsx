'use client';

import React from 'react';
import { useSnapshot } from 'valtio';
import { appStore } from '@/stores/appStore';
import { UtilityPanel } from '@/components/UtilityPanel';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const snap = useSnapshot(appStore);

  return (
    <div className="flex-1 flex overflow-hidden">
      {snap.isUtilityPanelOpen && (
        <div className="h-full animate-in slide-in-from-left duration-300">
          <UtilityPanel onClose={() => appStore.isUtilityPanelOpen = false} />
        </div>
      )}
      <main className="flex-1 relative overflow-y-auto custom-scrollbar">
        {children}
      </main>
    </div>
  );
}
