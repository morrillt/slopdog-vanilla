'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Palette, Route, Navigation, Settings as SettingsIcon, Github, HelpCircle, Play, X, PanelLeftOpen, PanelLeftClose } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SettingsPanel } from './SettingsPanel';
import { useSnapshot } from 'valtio';
import { appStore } from '@/stores/appStore';

const VideoModal = ({ isOpen, onClose, title }: { isOpen: boolean; onClose: () => void; title: string }) => {
  if (!isOpen) return null;
  const videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ";
  const autoplayUrl = `${videoUrl}?autoplay=1&mute=1`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-5xl bg-mocha-crust rounded-2xl overflow-hidden border border-mocha-surface1 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-8 py-6 bg-mocha-mantle border-b border-mocha-surface1">
          <div className="flex flex-col gap-1">
            <h3 className="text-mocha-lavender font-black text-4xl uppercase tracking-tighter">
              {title}
            </h3>
            <p className="text-mocha-yellow text-xl font-bold animate-pulse flex items-center gap-2">
              <span>meanwhile pls enjoy a song and dance.</span>
              <span className="text-sm opacity-50 font-normal">(sorry, will add real video tomorrow :)</span>
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-mocha-surface0 hover:bg-mocha-surface1 text-mocha-text rounded-full transition-colors shadow-lg"
          >
            <X className="w-8 h-8" />
          </button>
        </div>
        <div className="aspect-video w-full bg-black">
          <iframe
            className="w-full h-full"
            src={autoplayUrl}
            title="YouTube video player"
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [videoModal, setVideoModal] = useState<{ isOpen: boolean; title: string }>({ isOpen: false, title: '' });
  const pathname = usePathname();
  const snap = useSnapshot(appStore);

  // Update active route based on pathname
  useEffect(() => {
    if (pathname === '/') setActiveRoute('home');
    else if (pathname === '/styles') setActiveRoute('theme');
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
              NEW PROJECT
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

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-4 text-sm">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-mocha-subtext1 hover:text-mocha-blue transition-colors"
            >
              <Github className="w-4 h-4" />
              Repository
            </a>
            <button 
              onClick={() => setVideoModal({ isOpen: true, title: 'What is this app?' })}
              className="flex items-center gap-2 text-mocha-subtext1 hover:text-mocha-blue transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              What is this app?
            </button>
            <button 
              onClick={() => setVideoModal({ isOpen: true, title: 'oneshotted by BROZ OS' })}
              className="flex items-center gap-2 text-mocha-mauve hover:text-mocha-pink transition-colors font-mono font-bold"
            >
              <Play className="w-4 h-4" />
              oneshotted by BROZ OS
            </button>
          </div>

          <div className="h-6 w-px bg-mocha-surface1 hidden lg:block" />

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSettingsOpen(true)}
              className="text-mocha-subtext1 hover:text-mocha-text"
            >
              <SettingsIcon className="w-5 h-5" />
            </Button>
            <div className="h-6 w-px bg-mocha-surface1" />
            <div className="flex items-center gap-2 text-xs opacity-90">
              <span>Powered by Slopdog</span>
              <Image
                alt="slopdog icon"
                className="rounded-full"
                height={32}
                width={32}
                priority
                src="/image.png"
              />
            </div>
          </div>
        </div>
      </header>

      {isSettingsOpen && (
        <SettingsPanel onClose={() => setIsSettingsOpen(false)} />
      )}

      <VideoModal 
        isOpen={videoModal.isOpen} 
        onClose={() => setVideoModal({ isOpen: false, title: '' })} 
        title={videoModal.title}
      />
    </>
  );
}

