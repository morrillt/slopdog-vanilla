'use client';

import React, { useEffect } from 'react';
import { useSnapshot } from 'valtio';
import { appStore } from '@/stores/appStore';
import { UtilityPanel } from '@/components/UtilityPanel';
import { LogDrawer } from '@slopdog-vanilla/logger';
import { loggerState, loggerActions, getLogger } from '@/stores/loggerStore';

const log = getLogger('vanilla').main('LayoutWrapper');

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const snap = useSnapshot(appStore);

  useEffect(() => {
    log.info("LayoutWrapper mounted - app shell ready");
    log.debug("LogDrawer component loaded", { 
      logEntries: loggerState.entries.length,
      drawerOpen: loggerState.drawerOpen 
    });
  }, []);

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
      <LogDrawer state={loggerState} actions={loggerActions} />
    </div>
  );
}
