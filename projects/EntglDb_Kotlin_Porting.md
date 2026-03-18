# Project: EntglDb.Kotlin — Implementation from scratch

## 🎯 Goal

Implement the Kotlin library for EntglDb from scratch, porting all features
of the reference `.Net` version (v1.0.0) to Android and JVM, starting from the
scaffold already provided in the `EntglDb.Kotlin` repository.

The complete reference implementation is available in `EntglDb.Net`.

---

## 📊 Starting point

| Component | Status |
|---|---|
| `protocol/` | ✅ Protobuf v5 definition already present and compiled |
| `core/` | 🔲 To be implemented |
| `persistence-sqlite/` | 🔲 To be implemented |
| `network/` | 🔲 To be implemented |
| `app/` | 🔲 To be implemented |

---

## 🛠️ Technical Specifications

### Module `core` — Engine

The core is the heart of the entire library. It implements the data structures and
synchronization logic, with no dependencies on networking or storage.

**Main classes to implement:**

#### 1. `HlcTimestamp` — Hybrid Logical Clock
- Three components: `wall: Long`, `logic: Int`, `node: String`
- Method `tick(wall: Long)`: advances the clock guaranteeing monotonicity
- Method `receive(remote: HlcTimestamp, wall: Long)`: updates the clock upon receiving a message
- Serialization via `kotlinx.serialization`

#### 2. `VectorClock`
- Map `nodeId → HlcTimestamp`
- Method `dominates(other: VectorClock)`: causal comparison
- Method `merge(other: VectorClock)`: union taking the max per node

#### 3. `OplogEntry`
- Fields: `collection`, `key`, `operation` (Put/Delete), `jsonData`, `hlc`, `hash`, `previousHash`
- `hash` computed with SHA-256 over `(previousHash + collection + key + operation + jsonData + hlc)`
- Chain integrity verification: `verifyChain(entries: List<OplogEntry>): Boolean`

#### 4. `IConflictResolver`
- Interface with method `resolve(base: String?, local: String, remote: String): String`
- Implementation `LastWriteWinsResolver`: uses the HLC to select the winner
- Implementation `RecursiveMergeResolver`: recursive merge of non-conflicting JSON fields

#### 5. `PeerDatabase`
- Manages a `Collection` of `PeerCollection`
- Methods: `put(collection, key, json)`, `delete(collection, key)`, `find(collection, key)`
- Observes local writes and generates `OplogEntry` (CDC pattern)

---

### Module `persistence-sqlite` — Storage

Implements `IPeerStorage` using `androidx.sqlite:sqlite-ktx`.

**Tables to create:**
```sql
CREATE TABLE oplog (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    collection TEXT NOT NULL,
    key TEXT NOT NULL,
    operation TEXT NOT NULL,
    json_data TEXT,
    hlc_wall INTEGER NOT NULL,
    hlc_logic INTEGER NOT NULL,
    hlc_node TEXT NOT NULL,
    hash TEXT NOT NULL,
    previous_hash TEXT
);

CREATE TABLE vector_clock (
    node_id TEXT PRIMARY KEY,
    hlc_wall INTEGER NOT NULL,
    hlc_logic INTEGER NOT NULL
);

CREATE TABLE documents (
    collection TEXT NOT NULL,
    key TEXT NOT NULL,
    json_data TEXT NOT NULL,
    PRIMARY KEY (collection, key)
);
```

---

### Module `network` — P2P Networking

Uses Ktor TCP + Brotli compression + symmetric encryption.

#### 1. Handshake (Protocol v5)
- Messages are framed with the `MessageType` enum (1 byte) + 4-byte length + Protobuf payload
- Handshake: exchange of `node_id`, `auth_token`, `supported_compression`, `interesting_collections`
- Encryption: ECDH key exchange → AES-256-GCM for the payload (SecureEnvelope)

#### 2. `TcpPeerClient`
- TCP connection to a remote peer
- Automatic reconnect handling with exponential backoff
- Methods: `pushChanges(entries)`, `pullChanges(since)`, `getVectorClock()`

#### 3. `TcpPeerServer`
- Accepts incoming TCP connections (Ktor server socket)
- Message dispatching to the `SyncOrchestrator`

#### 4. `UdpDiscovery`
- UDP broadcast on the LAN (port 7890) to discover peers
- Discovery message: JSON with `nodeId` and TCP port
- Notifies the `SyncOrchestrator` upon discovering new peers

#### 5. `SyncOrchestrator`
- Gossip loop every 2 seconds
- For each connected peer: sends and receives missing `OplogEntry` records
- Gap Recovery: if the peer is too far behind, sends a snapshot

---

### Module `app` — Sample Android

Android application with Jetpack Compose that demonstrates real-time synchronization
between devices on the same LAN.

**Minimum features:**
- Shared TODO list between two devices
- Connection status indicator (online/offline)
- Current VectorClock display
- Manual conflict resolution (selection dialog)

---

## 📦 Expected Output

- Compiling implementation of all four modules
- Unit tests for `core`: `VectorClock`, `HlcTimestamp`, `OplogEntry` (chain verification)
- Integration test: two `PeerDatabase` instances that synchronize in-process
- Working Android app with LAN sync demo

## 📚 References

- `EntglDb.Net/src/EntglDb.Core/` — reference C# implementation
- `EntglDb.Net/src/EntglDb.Network/` — reference network implementation
- `protocol/src/main/proto/sync.proto` — protocollo v5 definito
- `EntglDb.Net/README.md` — architettura generale
