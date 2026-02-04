import fs from 'fs';
import path from 'path';

export interface DocMetadata {
  path: string;
  title?: string;
}

function getFilesRecursively(dir: string, baseDir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(fullPath, baseDir));
    } else if (file.endsWith('.md')) {
      results.push(path.relative(baseDir, fullPath));
    }
  });
  return results;
}

export function getManifest(config: { contentRoot: string; directories: string[] }) {
  const { contentRoot, directories = [] } = config;
  let documents: DocMetadata[] = [];

  directories.forEach((dir: string) => {
    const fullPath = path.resolve(contentRoot, dir);
    if (fs.existsSync(fullPath)) {
      const files = getFilesRecursively(fullPath, contentRoot);
      files.forEach(file => {
        documents.push({
          path: file.replace(/\.md$/, ''),
          title: path.basename(file, '.md')
        });
      });
    }
  });

  return { documents };
}

export function getContent(config: { contentRoot: string }, docPath: string) {
  const { contentRoot } = config;
  // Try with and without the directory prefix
  const pathsToTry = [
    path.resolve(contentRoot, docPath + '.md'),
    path.resolve(contentRoot, 'docs', docPath + '.md'),
    path.resolve(contentRoot, 'plans', docPath + '.md')
  ];
  
  for (const fullPath of pathsToTry) {
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      return { content };
    }
  }

  return null;
}
