# Project: EntglDb.Cpp Cross-Platform Implementation

## 🎯 Objective
Create a native implementation of EntglDb in modern C++ (C++20), portable and high-performance, usable both as a standalone library and integrated into native applications.

## 🛠️ Required Technologies
- **Language**: C++20.
- **Build System**: CMake (Support for Windows, Linux, macOS).
- **Recommended Dependencies**:
  - `asio` (Asynchronous Networking).
  - `nlohmann/json` (JSON Document Management).
  - `sqlite3` (Persistence).
  - `protobuf` (Sync Message Serialization).

## 🗺️ Project Scope

### 1. Core Engine
- `VectorClock` and `HybridLogicalClock` implementation.
- `Oplog` management and LWW (Last-Write-Wins) conflict resolution.
- Collections and Document CRUD management.

### 2. Persistence Layer
- `IPeerStore` abstraction.
- `SqlitePeerStore` implementation compatible with the existing database schema (.Net/Node).
- Transaction management and WAL mode.

### 3. Network Layer
- Secure `Handshake` protocol implementation.
- Protobuf message handling (`sync.proto`).
- Async TCP Server and TCP Client.
- UDP Discovery (optional in Phase 1).

### 4. Public Interface
- Clean and idiomatic C++ API.
- Possible C-API exposure for interoperability (FFI).

## 🧪 Verification
- Unit Test Suite (e.g., GoogleTest).
- Integration Tests: Working Sync against a .Net or Node.js node.

## 📦 Output
- `EntglDb.Cpp` repository.
- Usage examples (CLI chat or simple store).
