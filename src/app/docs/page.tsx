"use client";

import { useEffect, useState } from "react";
import { DocsExplorer, Manifest } from "@rockcap/docs-router";
import Link from "next/link";

export default function DocsPage() {
  const [manifest, setManifest] = useState<Manifest | null>(null);

  useEffect(() => {
    fetch("/api/docs/manifest").then(res => res.json()).then(setManifest);
  }, []);

  if (!manifest) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="p-8">
      <DocsExplorer 
        manifest={manifest} 
        basePath="/docs" 
        renderLink={(href: string, children: React.ReactNode) => <Link href={href}>{children}</Link>} 
      />
    </div>
  );
}
