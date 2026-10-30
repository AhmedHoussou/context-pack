import { useState, useMemo, type ChangeEvent } from 'react';
import {
  Upload,
  FileCode,
  CheckSquare,
  Square,
  Copy,
  Check,
  Search,
  FolderTree,
  Trash2,
} from 'lucide-react';
import { processFileList } from './utils/fileFilters';
import type { PackedFile } from './utils/fileFilters';
import { formatForMarkdown, formatForClaudeXml, estimateTokens } from './utils/formatters';

export default function App() {
  const [files, setFiles] = useState<PackedFile[]>([]);
  const [folderName, setFolderName] = useState<string>('');
  const [format, setFormat] = useState<'md' | 'xml'>('md');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const handleFolderSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const uploadedFiles = e.target.files;
    const firstFilePath = uploadedFiles[0].webkitRelativePath || '';
    const rootName = firstFilePath.split('/')[0] || 'Selected Folder';

    setFolderName(rootName);
    const parsedFiles = await processFileList(uploadedFiles);
    setFiles(parsedFiles);
  };

  const handleReset = () => {
    setFiles([]);
    setFolderName('');
    setSearchQuery('');
  };

  const toggleFile = (path: string) => {
    setFiles(prev =>
      prev.map(f => (f.path === path ? { ...f, selected: !f.selected } : f))
    );
  };

  const selectAll = () => {
    setFiles(prev => prev.map(f => ({ ...f, selected: true })));
  };

  const deselectAll = () => {
    setFiles(prev => prev.map(f => ({ ...f, selected: false })));
  };

  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return files;
    const query = searchQuery.toLowerCase();
    return files.filter(f => f.path.toLowerCase().includes(query));
  }, [files, searchQuery]);

  const outputString = useMemo(() => {
    return format === 'md' ? formatForMarkdown(files) : formatForClaudeXml(files);
  }, [files, format]);

  const tokenEstimate = useMemo(() => {
    return estimateTokens(outputString);
  }, [outputString]);

  const selectedCount = useMemo(() => {
    return files.filter(f => f.selected).length;
  }, [files]);

  const handleCopy = async () => {
    if (!outputString) return;
    try {
      await navigator.clipboard.writeText(outputString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur px-6 py-3.5 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600/20 p-2 rounded-lg border border-indigo-500/30">
            <FolderTree className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight flex items-center gap-2">
              ContextPack
              <span className="text-[10px] font-semibold tracking-wider uppercase bg-indigo-950 text-indigo-300 border border-indigo-800/80 px-2 py-0.5 rounded-full">
                100% Client-Side
              </span>
            </h1>
            <p className="text-xs text-slate-400">Zero data leaves your browser</p>
          </div>
        </div>

        {files.length > 0 && (
          <button
            onClick={handleReset}
            className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-800 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Project
          </button>
        )}
      </header>

      {/* Main Two-Column Layout */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: File Ingestion & Selection */}
        <section className="flex flex-col gap-4 bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
          {files.length === 0 ? (
            <label className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer transition bg-slate-950/40 hover:bg-indigo-950/10 h-full min-h-[360px]">
              <div className="p-4 bg-slate-900 rounded-full border border-slate-800 mb-4">
                <Upload className="w-8 h-8 text-indigo-400" />
              </div>
              <span className="font-semibold text-slate-200 text-base">Select Project Folder</span>
              <span className="text-xs text-slate-500 mt-1 max-w-xs text-center">
                Automatically ignores node_modules, build outputs, lockfiles, and media files.
              </span>
              <input
                type="file"
                webkitdirectory=""
                directory=""
                multiple
                className="hidden"
                onChange={handleFolderSelect}
              />
            </label>
          ) : (
            <>
              {/* Folder Summary & Batch Actions */}
              <div className="flex flex-col gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-200 truncate max-w-[280px]">
                      {folderName}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {selectedCount} of {files.length} files selected
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={selectAll}
                      className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition"
                    >
                      Select All
                    </button>
                    <button
                      onClick={deselectAll}
                      className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>

                {/* Filter Search Input */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Filter files by path or extension..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition font-mono"
                  />
                </div>
              </div>

              {/* Scrollable File List */}
              <div className="flex-1 overflow-y-auto max-h-[520px] divide-y divide-slate-800/60 pr-1">
                {filteredFiles.length === 0 ? (
                  <div className="text-center py-10 text-xs text-slate-500 font-mono">
                    No files match "{searchQuery}"
                  </div>
                ) : (
                  filteredFiles.map(file => (
                    <div
                      key={file.path}
                      onClick={() => toggleFile(file.path)}
                      className="flex items-center gap-3 py-2 px-2 hover:bg-slate-800/40 rounded cursor-pointer text-xs font-mono transition select-none"
                    >
                      {file.selected ? (
                        <CheckSquare className="w-4 h-4 text-indigo-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-600 shrink-0" />
                      )}
                      <FileCode className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span
                        className={`truncate flex-1 ${
                          file.selected ? 'text-slate-200' : 'text-slate-500 line-through'
                        }`}
                      >
                        {file.path}
                      </span>
                      <span className="text-slate-500 shrink-0 text-[11px]">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </section>

        {/* Right Column: Prompt Format & Output */}
        <section className="flex flex-col gap-4 bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
          {/* Format Selection & Token Gauge */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setFormat('md')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                  format === 'md'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Markdown
              </button>
              <button
                onClick={() => setFormat('xml')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                  format === 'xml'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Claude XML
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Tokens:</span>
              <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/60 border border-indigo-800/60 px-2 py-0.5 rounded">
                ~{tokenEstimate.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Context Preview Textarea */}
          <div className="flex-1 relative flex flex-col min-h-[400px]">
            <textarea
              readOnly
              value={outputString}
              placeholder="Your bundled project context (ASCII tree + code blocks) will preview here..."
              className="w-full flex-1 bg-slate-950 border border-slate-800 rounded-lg p-3.5 font-mono text-xs text-slate-300 resize-none focus:outline-none focus:border-slate-700 leading-relaxed"
            />
          </div>

          {/* Action Button */}
          <button
            onClick={handleCopy}
            disabled={!outputString}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition shadow-sm text-white"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Full Context</span>
              </>
            )}
          </button>
        </section>
      </main>
    </div>
  );
}