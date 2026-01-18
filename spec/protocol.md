# EntglDb Network Protocol

## Overview
Once peers discover each other via UDP, they establish a secure **TCP Connection** for data synchronization.
The default port for TCP services is **25000**.

## Framing
EntglDb uses a simple Length-Prefix framing for all TCP messages.

```
[Length (4 bytes)] [Payload (N bytes)]
```

*   **Length**: 4-byte signed integer (Big Endian). Indicates size of Payload.
*   **Payload**: The actual message data (Protobuf or Handshake Token).

## Handshake & Security

All connections must be authenticated and encrypted using **AES-256-GCM** and **ECDH**.

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
