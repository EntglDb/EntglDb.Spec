# EntglDb Network Protocol

## Overview
Once peers discover each other via UDP, they establish a secure **TCP Connection** for data synchronization.
The default port for TCP services is **25000**.

### Message Framing (v0.7.0+)
The TCP stream uses a Length-Prefixed framing with an additional **Compression Flag**.

```
[Length (4 bytes)] [Compression (1 byte)] [Payload (N bytes)]
```

- **Length**: 4-byte Signed Integer (Big Endian), inclusive of the Compression byte.
  - *Example*: If payload is 100 bytes + 1 byte flag, Length = 101.
- **Compression**: 1-byte enum.
  - `0x00`: **None** (Raw Protobuf)
  - `0x01`: **Brotli** (Compressed Protobuf)
- **Payload**: The serialized (and potentially compressed) Protobuf message.
- **Threshold**: Payloads smaller than **1024 bytes** should NOT be compressed (`0x00`).

### Encryption
The entire frame *payload* (after compression) is encrypted using AES-256-GCM.
**Order of Operations**: Serialize -> Compress -> Encrypt -> Send.

## Handshake & Security

All connections must be authenticated and encrypted using **AES-256-GCM** and **ECDH**.

### Handshake & Negotiation
Nodes perform a handshake to authenticate and negotiate capabilities (like compression).

#### 1. HandshakeRequest (Client -> Server)
- `node_id`: Identity of the connecting peer.
- `supported_compression`: List of algorithms (e.g., `["brotli"]`).

#### 2. HandshakeResponse (Server -> Client)
- `node_id`: Identity of the server.
- `accepted`: Boolean.
- `selected_compression`: The algorithm chosen by the server (e.g., `"brotli"` or `""`).

If `brotli` is selected, all subsequent messages > 1KB MUST be compressed.

### 1. Key Exchange (ECDH)
*   Curve: `NIST P-256` (prime256v1)
*   **Step A (Client)**: Generates ephemeral key pair. Sends Public Key (raw bytes).
*   **Step B (Server)**: Generates ephemeral key pair. Sends Public Key (raw bytes).
*   **Compute Shared Secret**: Both sides compute ECDH shared secret.
*   **Derive Keys**: Use **HKDF-SHA256** on the shared secret to derive:
    *   `AesKey` (32 bytes)
    *   `HmacKey` (32 bytes - if used for signing, though GCM handles auth tag)

### 2. Encryption (AES-GCM)
*   Algorithm: `AES/GCM/NoPadding`
*   IV Size: 12 bytes (randomly generated per message).
*   Tag Size: 128 bits (standard GCM authentication tag).
*   **Wire Format**:
    ```
    [IV (12 bytes)] [Ciphertext (N bytes)] [GCM Tag (16 bytes)]
    ```
    *(Note: Java's Cipher usually appends the tag to the ciphertext automatically)*.

## Message Protocol (Protobuf)
After handshake, the channel transmits serialized **Protocol Buffers**.

### Primary Messages
Defined in `sync.proto`.

*   **SyncRequest**: Initiates a sync session. Contains Vector Clock / HLC info.
*   **SyncResponse**: Returns list of changes (`Document`, `OplogEntry`) since the requested timestamp.
*   **GossipMessage**: Real-time push of a single update.

## Synchronization logic
See `synchronization.md` for algorithm details (Recursive Merge, LWW).
