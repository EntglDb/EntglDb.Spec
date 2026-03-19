# EntglDb Central Hub 🕸️

**The Mesh Database — P2P Synchronization Middleware & Platform for Local-First Applications.**

> **Note**: This repository contains the **Official Specifications** and the **Documentation Website** for EntglDb.
> For implementation code, please visit the specific language repositories.

## 📚 Repository Structure

*   [`spec/`](./spec): **Canonical Specifications**. The source of truth for the EntglDb protocol, including Discovery (UDP), Transport (Noise/TCP), Data Model, and Synchronization algorithms.
*   [`website/`](./website): **Documentation Site**. The source code for [entgldb.com](https://entgldb.com), built with Vue 3 and Vite.
*   [`projects/`](./projects): **Project proposals and research** documents describing new features and ecosystem expansions.

## 🌍 Ecosystem

| Language | Repository | Status |
| :--- | :--- | :--- |
| **C# / .NET** | [EntglDb.Net](https://github.com/EntglDb/EntglDb.Net) | ✅ Stable (v2.1.1) |
| **Kotlin / Android** | [EntglDb.Kotlin](https://github.com/EntglDb/EntglDb.Kotlin) | ⚠ Alpha |
| **Node.js / TypeScript** | [EntglDb.NodeJs](https://github.com/EntglDb/EntglDb.NodeJs) | 🚧 In Development |
| **React Native** | [EntglDb.ReactNative](https://github.com/EntglDb/EntglDb.ReactNative) | 🚧 In Development |

The .NET implementation is the most advanced and serves as the reference implementation. The protocol specs enable any language/platform to implement a fully interoperable EntglDb node.

## 🚀 Getting Started with the Specs

If you are building an EntglDb implementation or want to understand the internals:

1.  Start with [Discovery](./spec/discovery.md) — UDP peer discovery protocol.
2.  Read the [Wire Protocol](./spec/protocol.md) — TCP framing, encryption, and message types.
3.  Understand the [Data Model](./spec/data-model.md) — Documents, Oplog, and HLC.
4.  Study the [Synchronization](./spec/synchronization.md) — Anti-entropy, conflict resolution, and snapshots.
5.  Review the [RFC-001 Protocol](./spec/RFC-001-Protocol.md) — Formal protocol specification.

## 🛠️ Building the Website

The documentation site is a static SPA built with Vue 3 and Vite.

```bash
cd website
npm install
npm run dev
```

## 🌐 Cross-Platform Philosophy

EntglDb is designed as a **technology-agnostic protocol**. The canonical specifications define all behaviors unambiguously so that any language or platform can implement a fully interoperable node. Key design principles:

- **Offline-First**: Nodes operate independently and sync when connected
- **AP Model** (CAP theorem): Availability over consistency — eventual consistency via HLC
- **Multi-Master**: Every node is equal; no central authority
- **Gossip-Based**: Epidemic algorithm for efficient propagation
- **Pluggable Storage**: Any document store with CRUD + Oplog capabilities

## 🤝 Contributing

We welcome contributions to the specifications! If you find an ambiguity or an error in the protocol definition, please open an Issue or a Pull Request.
See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## 📄 License

MIT © 2026 EntglDb Project.
