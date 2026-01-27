# EntglDb Synchronization Specification

## 1. Architectural Overview

EntglDb implements a **Local-First**, **Peer-to-Peer** synchronization architecture designed for high availability and partition tolerance (AP in CAP theorem). The system ensures **Eventual Consistency** across all nodes in the mesh using Hybrid Logical Clocks (HLC) and conflict-free data types (CRDT-like behaviors).

### Key Characteristics
*   **Multi-Master**: Every node can accept writes independently.
*   **Offline-First**: Devices can operate indefinitely without network connectivity.
*   **Gossip Protocol**: Changes propagate virally through the network graph.
*   **Cryptographic Integrity**: The operation log (Oplog) is hash-chained to detect tampering or gaps.

---

## 2. Sync Lifecycle

The synchronization process automates data convergence between any two connected peers.

### Phase 1: Handshake & Authentication
Peers establish a secure TCP/TLS channel. They authenticate using a shared secret or public-key infrastructure (depending on configuration) and exchange `NodeId`s to prevent self-connection loops.

### Phase 2: Knowledge Exchange (Vector Clocks)
To minimize bandwidth, peers exchange **Vector Clocks** representing their current state.
*   A Vector Clock is a map: `NodeId -> LastKnownTimestamp`.
*   Example: `{ "NodeA": 100, "NodeB": 150 }` means "I have all events from NodeA up to time 100, and NodeB up to 150".

### Phase 3: Delta Calculation (Anti-Entropy)
Upon receiving a peer's Vector Clock, the local node calculates the **Delta**:
1.  Identify all local Oplog entries where `Entry.Timestamp > RemoteVectorClock[Entry.Author]`.
2.  These entries are "News" effectively unknown to the remote peer.

### Phase 4: Batch Transfer & Gap Detection
"News" entries are sent in batches. The receiver validates the chain integrity:
1.  **Chain Check**: `Entry.PreviousHash` must match the locally stored `Hash` of the previous entry for that Author.
2.  **Gap Detected**: If hashes do not link, the receiver knows it is missing intermediate data (e.g., due to a lost packet or partition).
3.  **Gap Recovery**: The receiver explicitly requests the `ChainRange` of missing entries to fill the gap.

---

## 3. Conflict Resolution

EntglDb assumes conflicts *will* occur and resolves them deterministically without user intervention.

### Strategy A: Last-Write-Wins (LWW) - Object Level
Used for simple key-value storage. The `OplogEntry` with the logically highest **HLC Timestamp** wins.
*   **determinism**: If HLCs are identical (rare), `NodeId` lexicographical order allows a tie-break.
*   **clock drift**: HLCs are robust against minor wall-clock drift, preserving causality.

### Strategy B: Recursive Merge (Deep Merge)
Used for JSON documents to preserve changes from multiple actors on different fields.
*   **Object Fields**: Recursively merged. `{"a": 1}` + `{"b": 2}` = `{"a": 1, "b": 2}`.
*   **Primitive Fields**: LWW resolution based on field-level metadata (if configured) or document-level timestamp.
*   **Arrays**:
    *   *Identity Merge*: If items have an `id`, they are merged as a map (updates to item #1 from Node A merge with updates to item #1 from Node B).
    *   *Union/Append*: For primitive arrays, usually treated as a set union or append-only list.

---

## 4. Snapshots & "Forever" Scaling

To prevent the Operation Log (Oplog) from growing infinitely, EntglDb implements a pruning and snapshotting mechanism.

### The Problem: Infinite History
In a pure event-sourced system, the log grows forever. A new node would need to download years of history to reconstruct the current state.

### The Solution: Pruning & Snapshots
1.  **Pruning**: Nodes delete Oplog entries older than a specific retention period (e.g., 30 days).
2.  **Snapshotting**: Before pruning, the node creates a **Full State Snapshot** representing the database at time `T`.
3.  **Metadata**: The snapshot records the **Vector Clock** and **Boundary Hashes** (the hash of the last Oplog entry for each node at time `T`).

### Gap Recovery via Snapshots
When a node (A) tries to sync with a peer (B) that is *too old* (i.e., needed history has been pruned by A), A cannot provide the missing Oplog chain.
1.  Node A sends a `SnapshotRequired` signal.
2.  Node B requests a **Full Snapshot**.
3.  Node B replaces its local state with the Snapshot and updates its Vector Clock to match.

### **Boundary Convergence (Self-Healing)**
A critical feature for long-running meshes is resolving "Split History" where nodes have pruned differently.
*   Snapshots serve as **Convergence Points**.
*   If a node attempts to sync new data that links back to a known **Snapshot Boundary Hash**, the link is accepted even if the exact oplog history is missing.
*   This allows the network to "bridge" over pruned history and converge on the latest valid state essentially "forgetting" the divergent past.

---

## 5. Deletion Handling (Tombstones)

Deletions are special `Put` operations with a `Deleted` flag (Tombstone).
*   **Propagation**: Tombstones travel through the Oplog like any other change.
*   **Resurrection**: A write with a higher timestamp will overwrite a tombstone (resurrecting the data).
*   **GC**: Tombstones are removed only during Pruning/Snapshotting after ensuring all active nodes have likely received them.
