# Project: EntglDb.Net vs EntglDb.Kotlin Gap Implementation

## 🎯 Objective
Bring the Kotlin implementation (`EntglDb.Kotlin`) to the same functional level as the .Net version (`EntglDb.Net` v0.8.0), making it a complete and modern library for Android and Server (JVM) development.

## 📊 Current State
- **EntglDb.Net**: v0.8.0 (Includes Cloud Nodes, OAuth2, Leader Election, Gap Recovery, Snapshots).
- **EntglDb.Kotlin**: v0.7.0 (Includes Core, TCP Networking v4, SQLite Persistence).

## 🛠️ Missing Features (GAP)

### 1. Cloud Nodes & OAuth2 Support
- **Goal**: Enable Kotlin nodes to connect to authenticated Cloud nodes.
- **Specs**:
  - Implement `PeerType` and `NodeRole` (Member, CloudGateway).
  - Implement `OAuth2TcpPeerClient` to handle JWT tokens.
  - Support `Client Credentials Flow` (token acquisition and refresh).
  - Persist remote peer configuration (`RemotePeers` table).

### 2. Leader Election (Bully Algorithm)
- **Goal**: Coordinate communication with the cloud to avoid redundant traffic.
- **Specs**:
  - Implement `BullyLeaderElectionService`.
  - Logic: The node with the lexicographically smallest `NodeId` becomes the Leader.
  - Only the Leader establishes TCP connections to `CloudRemote` peers.
  - Handle leadership change events.

### 3. Dynamic Reconfiguration & Discovery
- **Goal**: Dynamic management of known peers.
- **Specs**:
  - Implement `CompositeDiscoveryService` (UDP LAN + Persistent Remote Peers).
  - Automatic synchronization of peer list via system collection (`_system_remote_peers`).

### 4. Sync Protocol Optimization (Gap Recovery & Snapshots)
- **Goal**: Efficiently handle reconnection of nodes that have been offline for a long time.
- **Specs**:
  - Implement `Snapshot` logic to truncate the Oplog.
  - Implement `Gap Recovery` procedure to fetch only missing data in case of excessive divergence.

## 📦 Expected Output
- Updated Kotlin source code in the `EntglDb.Kotlin` repository.
- Unit Tests for new features.
- Updated Android Demo showing connection to Cloud nodes.
- Publication to Maven Central (optional but recommended).

## 📚 References
- `EntglDb.Net/IMPLEMENTATION_SUMMARY.md` (v0.8.0 architectural details).
- `EntglDb.Net/src/EntglDb.Network` (Reference C# code).
