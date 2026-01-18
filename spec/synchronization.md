# EntglDb Synchronization

## Overview
Synchronization is **Peer-to-Peer**, **Multi-Master**, and **Eventually Consistent**.
It uses a **Gossip-based** approach combined with **Anti-Entropy** sync sessions.

## Conflict Resolution

### 1. Last-Write-Wins (LWW) - Object Level
For simple puts, the `OplogEntry` with the highest **HLC Timestamp** wins.
If timestamps are identical, the `NodeId` (lexicographical order) is the tie-breaker.

### 2. Recursive Merge (Deep Merge)
When enabled, two conflicting versions of a document are merged field-by-field.
*   **Objects**: Recursively merged.
*   **Arrays**:
    *   If items have `id` field: Merged as a Map (Identity-based merge).
    *   Otherwise: Union/Append (or simple overwrite, depending on config).
*   **Primitives**: LWW based on field-level metadata (if available) or document timestamp.

## Sync Process

1.  **Handshake**: Peers establish connection.
2.  **Vector Clock Exchange**:
    *   Node A sends its known `VectorClock` (Map of `NodeId -> LastTimestamp`).
    *   Node B calculates "News": Oplog entries that Node A is missing (where `entry.timestamp > vectorClock[entry.node]`).
3.  **Batch Transfer**:
    *   Node B sends missing `OplogEntry` items in batches.
    *   Node A applies them locally.
    *   Node A updates its Vector Clock.
4.  **Real-Time Gossip**:
    *   When Node A writes a new local change, it immediately pushes it to all connected peers via `GossipMessage`.

## Deletion
Deletions are handled via **Tombstones**.
A `DELETE` oplog entry serves as a marker that the document is deleted.
Tombstones are kept for a configurable duration (default 30 days) to ensuring propagation.
