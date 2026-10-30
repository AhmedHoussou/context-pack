interface TreeNode {
  [key: string]: TreeNode;
}

export function generateAsciiTree(paths: string[]): string {
  if (paths.length === 0) return '';

  const root: TreeNode = {};

  // Build the hierarchical tree structure
  for (const path of paths) {
    const parts = path.split('/');
    let current = root;
    for (const part of parts) {
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }
  }

  // Convert the tree object to formatted ASCII lines
  function renderNode(node: TreeNode, prefix = ''): string {
    const keys = Object.keys(node);
    let output = '';

    keys.forEach((key, index) => {
      const isLast = index === keys.length - 1;
      const connector = isLast ? '└── ' : '├── ';
      output += `${prefix}${connector}${key}\n`;

      const childPrefix = prefix + (isLast ? '    ' : '│   ');
      output += renderNode(node[key], childPrefix);
    });

    return output;
  }

  return renderNode(root).trimEnd();
}