"use client";

import Image from "next/image";
import { useEffect } from "react";
import { getLogger } from "@/stores/loggerStore";

const log = getLogger('vanilla').main('HomePage');

export default function HomePage() {
  useEffect(() => {
    log.info("HomePage mounted - docs system ready");
    log.debug("App version: vanilla", { timestamp: new Date().toISOString() });
  }, []);
  
  return (
    <div className="relative h-[calc(100vh-2.75rem)] w-full flex bg-mocha-base">
      <div className="relative flex-1 max-w-6xl mx-auto p-8 w-full">
        <Image
          alt="slopdog crew"
          className="object-contain"
          fill
          priority
          src="/data/slopdog-crew-new-output (Current).png"
        />
      </div>
    </div>
  );
}
