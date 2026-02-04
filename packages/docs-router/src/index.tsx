"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Types
export interface DocMetadata {
  path: string;
  title?: string;
  [key: string]: any;
}

export interface Manifest {
  documents: DocMetadata[];
  [key: string]: any;
}

// Components
export const DocsExplorer = ({ manifest, basePath, renderLink }: any) => {
  return (
    <div className="p-4 border border-gray-700 rounded">
      <h2 className="text-xl mb-4 text-white">Docs Explorer</h2>
      <ul>
        {manifest?.documents?.map((doc: any) => (
          <li key={doc.path} className="mb-2">
            {renderLink ? renderLink(doc.path, doc.title || doc.path) : <a href={doc.path} className="text-blue-400 hover:underline">{doc.title || doc.path}</a>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const DocViewer = ({ doc, content, onBack, renderLink }: any) => {
  return (
    <div className="p-4 text-white">
      <button onClick={onBack} className="mb-4 text-blue-400 hover:underline">← Back</button>
      <h1 className="text-2xl font-bold mb-4">{doc?.title || doc?.path}</h1>
      <div className="prose prose-invert max-w-none">
        <pre className="whitespace-pre-wrap bg-gray-900 p-4 rounded">{content}</pre>
      </div>
    </div>
  );
};
