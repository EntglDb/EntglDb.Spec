# Project: EntglDb.Rust Cross-Platform Implementation

## 🎯 Objective
Develop a native implementation of EntglDb in **Rust**, leveraging the language's memory safety guarantees and performance. This implementation aims to become the performant core for embedded and high-load server-side environments.

## 🛠️ Tech Stack
- **Language**: Rust (Edition 2021+).
- **Async Runtime**: `Tokio`.
- **Serialization**: `Serde` (JSON + Protobuf).
- **Database**: `Rusqlite` (SQLite binding).
- **Networking**: `Tokio` TCP streams.
- **Protocol Buffers**: `Prost`.

## 🗺️ Development Roadmap

### 1. Core Structures
- `VectorClock` and `HLC` (Hybrid Logical Clock) implementation.
- Thread-safe data structures for Oplog and Document Store.
- Concurrency management via idiomatic Rust patterns (Arc, Mutex/RwLock, Channels).

### 2. Networking & Protocol
- `sync.proto` handshake implementation.
- Async TCP stream handling.
- Message Framing (Length-prefixed).

### 3. Persistence
- Storage abstraction layer.
- SQLite persistence implementation.
- Write optimization (Batching, WAL).

### 4. API & Crate
- Publication as a Crate on crates.io.
- Usage examples.
- Possible C binding for integration with other languages.

## 📦 Output
- Crate `entgldb`.
- Complete Test Suite (Unit & Integration).
- Comparative Benchmarks (vs .Net).
