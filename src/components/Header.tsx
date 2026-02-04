'use client';

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Palette, Route, Navigation, PanelLeftOpen, PanelLeftClose, FileText, Play, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SettingsPanel } from './SettingsPanel';
import { useSnapshot } from 'valtio';
import { appStore } from '@/stores/appStore';

const VideoModal = ({ isOpen, onClose, videoUrl }: { isOpen: boolean; onClose: () => void; videoUrl: string }) => {
  if (!isOpen) return null;
  
  // Convert YouTube watch URL to embed URL
  const getEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
    }
    return url;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-5xl bg-mocha-crust rounded-2xl overflow-hidden border border-mocha-surface1 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 bg-mocha-mantle border-b border-mocha-surface1">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-mocha-yellow/20 border border-mocha-yellow/60 rounded rotate-45 flex items-center justify-center">
              <Play className="w-4 h-4 text-mocha-yellow -rotate-45 ml-0.5" />
            </div>
            <h3 className="text-mocha-text font-bold text-xl">
              Orientation
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-mocha-surface0 hover:bg-mocha-surface1 text-mocha-text rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="aspect-video w-full bg-black">
          <iframe
            className="w-full h-full"
            src={getEmbedUrl(videoUrl)}
            title="Orientation Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

export function Header() {
  const [activeRoute, setActiveRoute] = useState('home');
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const pathname = usePathname();
  const snap = useSnapshot(appStore);

  // Update active route based on pathname
  useEffect(() => {
    if (pathname === '/') setActiveRoute('home');
    else if (pathname === '/styles') setActiveRoute('theme');
    else if (pathname?.startsWith('/docs')) setActiveRoute('docs');
    else if (pathname === '/route3') setActiveRoute('route3');
    else if (pathname === '/route4') setActiveRoute('route4');
  }, [pathname]);

  return (
    <>
      <header className="flex items-center justify-between px-6 py-2 bg-mocha-mantle border-b border-mocha-surface1">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => appStore.isUtilityPanelOpen = !appStore.isUtilityPanelOpen}
            className="p-2 hover:bg-mocha-surface0 rounded-lg transition-colors text-mocha-subtext1 hover:text-mocha-blue"
            title={snap.isUtilityPanelOpen ? "Close Utility Panel" : "Open Utility Panel"}
          >
            {snap.isUtilityPanelOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-mocha-blue overflow-hidden flex-shrink-0 bg-mocha-surface0 flex items-center justify-center">
              <span className="text-xs font-bold text-mocha-blue">NP</span>
            </div>
            <h1 className="text-lg font-black text-mocha-text tracking-tight uppercase">
              {snap.projectName}
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-mocha-surface0 p-1 rounded-lg border border-mocha-surface1">
            <Link href="/">
              <Button
                variant={activeRoute === 'home' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setActiveRoute('home')}
                className="flex items-center gap-2"
              >
                <LayoutGrid className="w-4 h-4" />
                Home
              </Button>
            </Link>
            <Link href="/styles">
              <Button
                variant={activeRoute === 'theme' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setActiveRoute('theme')}
                className="flex items-center gap-2"
              >
                <Palette className="w-4 h-4" />
                Theme
              </Button>
            </Link>
            <Link href="/docs">
              <Button
                variant={activeRoute === 'docs' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setActiveRoute('docs')}
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Docs
              </Button>
            </Link>
            <Button
              variant={activeRoute === 'route3' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveRoute('route3')}
              className="flex items-center gap-2"
            >
              <Route className="w-4 h-4" />
              Route3
            </Button>
            <Button
              variant={activeRoute === 'route4' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveRoute('route4')}
              className="flex items-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              Route4
            </Button>
          </div>
        </div>

        {/* Right side - Orientation Video */}
        {snap.orientationVideoUrl && (
          <button
            onClick={() => setIsVideoOpen(true)}
            className="group flex items-center gap-2 px-3 py-1.5 bg-mocha-surface0 hover:bg-mocha-yellow/20 border border-mocha-surface1 hover:border-mocha-yellow/50 rounded-lg transition-all"
            title="Watch Orientation Video"
          >
            {/* Mini octagon play button */}
            <div className="w-6 h-6 bg-mocha-yellow/20 group-hover:bg-mocha-yellow/40 border border-mocha-yellow/60 rounded rotate-45 flex items-center justify-center transition-colors">
              <Play className="w-3 h-3 text-mocha-yellow -rotate-45 ml-0.5" />
            </div>
            <span className="hidden sm:block text-sm font-bold text-mocha-text group-hover:text-mocha-yellow transition-colors">
              Orientation
            </span>
          </button>
        )}
      </header>

      {snap.isSettingsOpen && (
        <SettingsPanel onClose={() => appStore.isSettingsOpen = false} />
      )}

      <VideoModal 
        isOpen={isVideoOpen} 
        onClose={() => setIsVideoOpen(false)} 
        videoUrl={snap.orientationVideoUrl}
      />
    </>
  );
}

