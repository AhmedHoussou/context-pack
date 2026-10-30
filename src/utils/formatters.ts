import type { PackedFile } from './fileFilters';
import { generateAsciiTree } from './treeBuilder';

export function formatForMarkdown(files: PackedFile[]): string {
  const selectedFiles = files.filter(f => f.selected);
  if (selectedFiles.length === 0) return '';

  const tree = generateAsciiTree(selectedFiles.map(f => f.path));

  let output = `# Project Context\n\n`;
  output += `## Directory Structure\n\`\`\`text\n${tree}\n\`\`\`\n\n`;
  output += `## Source Files\n\n`;

  for (const file of selectedFiles) {
    const extension = file.name.split('.').pop() || '';
    output += `### File: \`${file.path}\`\n`;
    output += `\`\`\`${extension}\n`;
    output += `${file.content}\n`;
    output += `\`\`\`\n\n`;
  }

  return output.trim();
}

export function formatForClaudeXml(files: PackedFile[]): string {
  const selectedFiles = files.filter(f => f.selected);
  if (selectedFiles.length === 0) return '';

  const tree = generateAsciiTree(selectedFiles.map(f => f.path));

  let output = `<project_context>\n`;
  output += `  <directory_structure>\n${tree}\n  </directory_structure>\n`;
  output += `  <documents>\n`;

  selectedFiles.forEach((file, index) => {
    output += `    <document index="${index + 1}">\n`;
    output += `      <source>${file.path}</source>\n`;
    output += `      <document_content>${file.content}</document_content>\n`;
    output += `    </document>\n`;
  });

  output += `  </documents>\n`;
  output += `</project_context>`;

  return output;
}

// Industry-standard fast heuristic for LLM tokens (~3.8 characters per token)
export function estimateTokens(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 3.8);
}