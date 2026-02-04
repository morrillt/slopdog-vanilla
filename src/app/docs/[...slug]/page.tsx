"use client";

import { useEffect, useState } from "react";
import { DocViewer, DocMetadata, Manifest } from "@rockcap/docs-router";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function DocPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug;
  const docPath = Array.isArray(slug) ? slug.join("/") : slug;

  const [doc, setDoc] = useState<DocMetadata | null>(null);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!docPath) return;

    const fetchDoc = async () => {
      setLoading(true);
      setError(null);

      try {
        // First fetch manifest to get doc metadata
        const manifestRes = await fetch("/api/docs/manifest");
        const manifest: Manifest = await manifestRes.json();

        // Find the doc in manifest - try multiple path variations
        const pathVariations = [
          docPath,
          `docs/${docPath}`,
          `plans/${docPath}`,
          `${docPath}.md`,
          `docs/${docPath}.md`,
          `plans/${docPath}.md`,
        ];

        let foundDoc: DocMetadata | undefined;
        for (const variation of pathVariations) {
          foundDoc = manifest.docs.find((d) => {
            const normalizedDocPath = d.path.replace(/\.md$/, "");
            const normalizedVariation = variation.replace(/\.md$/, "");
            return (
              normalizedDocPath === normalizedVariation ||
              normalizedDocPath.endsWith(`/${normalizedVariation}`)
            );
          });
          if (foundDoc) break;
        }

        if (!foundDoc) {
          // Create a minimal doc object if not found in manifest
          foundDoc = {
            path: docPath,
            title: docPath.split("/").pop() || "Document",
            updated: new Date().toISOString().split("T")[0],
            facets: { type: "note", status: "active" },
            tags: [],
          };
        }

        setDoc(foundDoc);

        // Fetch content
        const contentRes = await fetch(
          `/api/docs/content?path=${encodeURIComponent(foundDoc.path)}`
        );
        const contentData = await contentRes.json();

        if (contentData.error) {
          setError(contentData.error);
          setContent("");
        } else {
          setContent(contentData.content || "");
        }
      } catch (err) {
        console.error("Error fetching doc:", err);
        setError("Failed to load document");
      } finally {
        setLoading(false);
      }
    };

    fetchDoc();
  }, [docPath]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-400">Loading document...</div>
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-red-400">{error || "Document not found"}</div>
        <button
          onClick={() => router.push("/docs")}
          className="text-blue-400 hover:underline"
        >
          ← Back to Docs
        </button>
      </div>
    );
  }

  return (
    <DocViewer
      doc={doc}
      content={content}
      onBack={() => router.push("/docs")}
      renderLink={(href: string, children: React.ReactNode) => (
        <Link href={href}>{children}</Link>
      )}
    />
  );
}
