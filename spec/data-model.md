# EntglDb Data Model

## Overview
EntglDb is a **Document-Oriented** database.
Data is stored as JSON documents within named **Collections**.

## Documents

A document is a JSON object with a mandatory `_id` field.

```json
{
  "_id": "user-12345",
  "name": "Alice",
  "age": 30,
  "tags": ["admin", "staff"],
  "metadata": {
      "created_at": "2026-01-01T12:00:00Z"
  }
}
```

*   **_id**: String. Primary Key. Must be unique within the collection.
*   **Fields**: Any valid JSON data type (string, number, boolean, array, object, null).

## Oplog (Operation Log)

Changes are tracked via an **Oplog** to enable synchronization.
Each mutation produces an `OplogEntry`.

```json
{
  "hlc_timestamp": "timestamp-nodeid-counter",
  "collection": "users",
  "document_id": "user-12345",
  "operation": "PUT",
  "data": { ... }
}
```

### Operations
*   `PUT`: Create or Update a full document.
*   `DELETE`: Remove a document (Tombstone).
*   `PATCH`: Partial update (reserved for future).

## Hybrid Logical Clock (HLC)

EntglDb relies on **HLC** for conflict resolution (Last-Write-Wins).
Format: `RequestTime-LogicalCounter-NodeId`
Example: `1705500000000-0001-nodeA`

*   **Physical Component**: Milliseconds since Epoch.
*   **Logical Component**: Incremented for events within the same millisecond.
*   **Node Component**: Tie-breaker.

## Serialization Rules (IMPORTANT)

To guarantee consistent hashing and transmission:
1.  **JSON format**: Standard UTF-8 JSON.
2.  **Naming Convention**:
    *   System fields: `snake_case` (e.g., `node_id`, `tcp_port`, `created_at`).
    *   User fields: Preserved as-is (though `snake_case` recommended).
3.  **Date/Time**: ISO-8601 Strings (`YYYY-MM-DDTHH:mm:ss.sssZ`).
