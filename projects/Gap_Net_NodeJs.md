# Project: EntglDb.Net vs EntglDb.NodeJs Gap Implementation

## 🎯 Objective
Align the Node.js implementation (`EntglDb.NodeJs`) with the recent features introduced in the .Net version (`EntglDb.Net` v0.8.0), ensuring full interoperability in complex hybrid scenarios (LAN + Cloud).

## 📊 Current State
- **EntglDb.Net**: v0.8.0 (Reference implementator).
- **EntglDb.NodeJs**: v0.7.0 (Core support, TCP, WebSocket, SQLite).

## 🛠️ Missing Features (GAP)

### 1. Protocol v0.8.0 & Cloud Integration
- **Goal**: Support Hybrid LAN/Cloud topology.
- **Specs**:
  - Update `PeerType` (LanDiscovered, StaticRemote, CloudRemote).
  - Implement `OAuth2` mechanism for connections to protected Cloud nodes.
  - Manage JWT tokens (acquisition and refresh).

### 2. Leader Election
- **Goal**: Network efficiency in local clusters.
- **Specs**:
  - Implement `Bully Algorithm` in TypeScript.
  - The Leader node exclusively manages the bridge to the outside (Cloud).
  - Dynamic role management (Member vs Gateway).

### 3. Gap Recovery & Snapshots
- **Goal**: Robustness in synchronization.
- **Specs**:
  - Implement `Snapshot` logic to truncate the Oplog.
  - Handle `Gap Recovery` when a node returns after a long time and the local Oplog is insufficient.
  - Verify alignment with the logic implemented in .Net (avoid infinite loops).

### 4. Dynamic Configuration Management
- **Goal**: Automatic peer synchronization.
- **Specs**:
  - Persistence of remote peers in SQLite (`RemotePeers` table or dedicated collection).
  - Synchronization of configuration via system collection (`_system_remote_peers`).

## 📦 Expected Output
- Updated NPM packages (`@entgldb/core`, `@entgldb/network`).
- Updated Demo Application (Electron/CLI).
- Interoperability tests with .Net v0.8.0 nodes.

## 📚 References
- `EntglDb.Net` codebase (C#).
- `EntglDb/spec` (Protocol documentation).
