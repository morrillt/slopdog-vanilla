"use client";

import { useState } from "react";

interface JsonViewerProps {
  data: Record<string, unknown>;
  name: string;
}

/**
 * Expandable JSON viewer component.
 */
export function JsonViewer({ data, name }: JsonViewerProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-1">
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-mocha-blue hover:text-mocha-sapphire flex items-center gap-1"
      >
        <span>{expanded ? "▼" : "▶"}</span>
        <span>📎 {name}</span>
      </button>
      {expanded && (
        <pre className="mt-1 p-2 bg-mocha-crust rounded text-xs overflow-x-auto border border-mocha-surface0">
          <code className="text-mocha-subtext1">
            {JSON.stringify(data, null, 2)}
          </code>
        </pre>
      )}
    </div>
  );
}

/**
 * Display multiple JSON attachments for a log entry.
 */
export function JsonAttachments({ data }: { data?: Record<string, unknown> }) {
  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  return (
    <div className="mt-1 space-y-1">
      {Object.entries(data).map(([key, value]) => (
        <JsonViewer key={key} name={key} data={value as Record<string, unknown>} />
      ))}
    </div>
  );
}
