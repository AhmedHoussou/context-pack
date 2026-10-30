# 📦 ContextPack

> Instant, client-side codebase packager for LLM prompts. Zero servers, zero database, zero data leakage.

ContextPack bundles your project files and directory structure into clean, token-optimized context blocks ready for Claude, ChatGPT, Cursor, and other LLMs.

---

### 🚀 Live Demo
**[Launch ContextPack](https://context-pack-6nw.pages.dev)**

---

### ✨ Key Features

- **🔒 100% Client-Side Privacy:** All file reading and text processing occur directly in your browser via the HTML5 File System API. Your proprietary code never touches a remote server.
- **🧹 Automatic Noise Filtering:** Strips dependencies and build artifacts automatically, including `node_modules/`, `.git/`, `dist/`, build caches, lockfiles, and binary assets (`.png`, `.wasm`, `.pdf`, `.mp4`).
- **🌲 ASCII Directory Tree:** Generates a structured architectural tree at the top of your prompt so the LLM understands your folder layout before reading the code.
- **🎯 Multi-Model Output Presets:**
  - **Standard Markdown:** Formatted with clean file path headings and language-specific syntax blocks.
  - **Claude XML:** Formatted with Anthropic's optimal `<documents>`, `<source>`, and `<document_content>` tags for high-precision retrieval.
- **⚡ Real-Time Token Estimator:** Instant token gauge (~3.8 characters per token heuristic) so you stay within your model's context budget.
- **🔍 File Search & Filter:** Instant search bar to filter specific file paths, folders, or extensions.
- **☑️ Granular Control:** Checkbox toggles and batch actions to select or deselect specific files before export.

---

### 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v3
- **Icons:** Lucide React
- **Hosting & CI/CD:** Cloudflare Pages (Edge CDN)

---

### 💻 Local Development

Clone the repository and run the development server locally:

```bash
# Clone the repository
git clone git@github.com:AhmedHoussou/context-pack.git

# Navigate into project directory
cd context-pack

# Install dependencies
npm install

# Start local Vite development server
npm run dev
```

---

### 📦 Production Build

```bash
# Type check and build static bundle
npm run build

# Preview production build locally
npm run preview
```

---

### 📄 License

MIT License. Free and open source for personal and commercial use.