# EntglDb Central Hub 🕸️

**The Mesh Database for Local-First Applications.**

> **Note**: This repository contains the **Official Specifications** and the **Documentation Website** for EntglDb.
> For implementation code, please visit the specific language repositories.

## 📚 Repository Structure

*   [`spec/`](./spec): **Canonical Specifications**. The source of truth for the EntglDb protocol, including Discovery (UDP), Transport (Noise/TCP), and Synchronization logic.
*   [`website/`](./website): **Documentation Site**. The source code for [entgldb.com](https://entgldb.com) (or your domain), built with Vue 3 and Vite.

## 🌍 Ecosystem

| Language | Repository | Status |
| :--- | :--- | :--- |
| **C# / .NET** | [EntglDb.Net](https://github.com/EntglDb/EntglDb.Net) | ✅ Stable (v0.6+) |
| **Kotlin** | [EntglDb.Kotlin](https://github.com/EntglDb/EntglDb.Kotlin) | ⚠ Alpha (v0.2+) |
| **Node.js** | [EntglDb.NodeJs](https://github.com/EntglDb/EntglDb.NodeJs) | 🚧 In Development |

## 🚀 Getting Started with the Specs

If you are building an EntglDb implementation or want to understand the internals:

1.  Start with [Discovery](./spec/discovery.md).
2.  Read the [Wire Protocol](./spec/protocol.md) definitions.
3.  Understand the [Data Model](./spec/data-model.md).
4.  Study the [Synchronization](./spec/synchronization.md) algorithms.

## 🛠️ Building the Website

The documentation site is a static SPA.

```bash
cd website
npm install
npm run dev
```

## 🤝 Contributing

We welcome contributions to the specifications! If you find an ambiguity or an error in the protocol definition, please open an Issue or a Pull Request.
See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## 📄 License

MIT © 2026 EntglDb Project.
