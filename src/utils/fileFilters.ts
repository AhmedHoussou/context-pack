export interface PackedFile {
  path: string;
  name: string;
  content: string;
  size: number;
  selected: boolean;
}

export const DEFAULT_IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  'out',
  'vendor',
  'coverage',
  '.cache',
  '__pycache__',
  '.venv',
  'target',
]);

export const DEFAULT_IGNORED_FILES = new Set([
  'package-lock.json',
  'pnpm-lock.yaml',
  'yarn.lock',
  'Cargo.lock',
  'poetry.lock',
  '.DS_Store',
  'Thumbs.db',
]);

export const BINARY_EXTENSIONS = new Set([
  'png', 'jpg', 'jpeg', 'gif', 'webp', 'ico', 'svg',
  'mp4', 'mp3', 'wav', 'ogg', 'pdf', 'zip', 'tar', 'gz',
  'woff', 'woff2', 'ttf', 'eot', 'exe', 'dll', 'so', 'dylib',
]);

export function isTextFile(filename: string): boolean {
  const parts = filename.split('.');
  if (parts.length <= 1) return true; // Files like Dockerfile, .gitignore, Makefile
  const ext = parts.pop()?.toLowerCase() || '';
  return !BINARY_EXTENSIONS.has(ext);
}

export async function processFileList(files: FileList | File[]): Promise<PackedFile[]> {
  const processed: PackedFile[] = [];

  for (const file of Array.from(files)) {
    // webkitRelativePath captures the folder hierarchy (e.g., "my-repo/src/index.ts")
    const relativePath = file.webkitRelativePath || file.name;
    const pathSegments = relativePath.split('/');

    // Check if any directory along the path is in the ignore list
    const isInsideIgnoredDir = pathSegments.some(segment => DEFAULT_IGNORED_DIRS.has(segment));
    const isIgnoredFile = DEFAULT_IGNORED_FILES.has(file.name);

    if (!isInsideIgnoredDir && !isIgnoredFile && isTextFile(file.name)) {
      try {
        const text = await file.text();
        processed.push({
          path: relativePath,
          name: file.name,
          content: text,
          size: file.size,
          selected: true,
        });
      } catch (error) {
        console.warn(`Skipping unreadable file: ${relativePath}`, error);
      }
    }
  }

  // Sort alphabetically by full file path
  return processed.sort((a, b) => a.path.localeCompare(b.path));
}