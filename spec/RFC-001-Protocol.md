# RFC 001: EntglDb Communication and Security Protocol

| Metadata | Value |
| :--- | :--- |
| **RFC ID** | 001 |
| **Title** | EntglDb Wire Protocol & Security Specification |
| **Status** | Draft |
| **Protocol Version** | v0.7.0 |
| **Date** | 2026-01-21 |

## 1. Introduction

This document defines the standard for the peer-to-peer communication protocol used by **EntglDb**. The purpose is to formalize the discovery, connection, security, and data synchronization mechanics to ensure interoperability between different implementations (C#, Node.js, Kotlin, Dart, etc.).

The protocol ensures:
1.  **Automatic Discovery** of nodes on the local network.
2.  **Secure Channel** (authenticated and encrypted) over TCP.
3.  **Efficient Synchronization** via Oplog and Vector Clocks (Hybrid Logical Clock).

## 2. Technology Stack

*   **Transport**: TCP (Data), UDP (Discovery).
*   **Framing**: Custom Length-Prefixed framing.
*   **Serialization**: Protocol Buffers (Proto3).
*   **Security**: ECDH (P-256) for key exchange, AES-256-GCM for encryption.
*   **Compression**: Brotli (optional/negotiated).

## 3. Discovery (UDP)

Nodes announce their presence via UDP broadcast.

*   **Port**: `25000`
*   **Interval**: 5000 ms
*   **Payload**: UTF-8 JSON

### 3.1 Beacon Format
```json
{
  "node_id": "<UUID>",
  "tcp_port": 25000
}
```

## 4. TCP Connection and Framing

Once a peer is discovered, the node initiates a TCP connection to `IP Address : tcp_port`.

### 4.1 Frame Structure
Every message exchanged on the TCP socket follows this structure (Little Endian for numbers):

```
[Length (4 bytes)] [Type (1 byte)] [Compression (1 byte)] [Payload (N bytes)]
```

*   **Length**: 32-bit Signed Integer (Little Endian) indicating the length of the *Payload* field (N). It does not include the header bytes (Length, Type, Compression).
*   **Type**: Byte identifying the message type (Enum `MessageType`).
*   **Compression**:
    *   `0x00`: No compression.
    *   `0x01`: Brotli (The Payload must be decompressed before parsing).
*   **Payload**: The serialized data (Protobuf).

### 4.2 Message Types (MessageType)
Mapping from the `MessageType` enum in `sync.proto`:

| ID | Name | Description |
| :--- | :--- | :--- |
| 1 | `HandshakeReq` | Connection and auth request |
| 2 | `HandshakeRes` | Connection response |
| 3 | `GetClockReq` | Request current HLC |
| 4 | `ClockRes` | HLC response |
| 5 | `PullChangesReq` | Request Oplog diff |
| 6 | `ChangeSetRes` | Send batch of changes |
| 7 | `PushChangesReq` | Proactive changes push |
| 8 | `AckRes` | Receipt confirmation |
| 9 | `SecureEnv` | Encrypted envelope (See Sec. 5) |

---

## 5. Security and Handshake

Security is mandatory for production communications. The protocol uses an "Encrypt-then-MAC" approach (via AES-GCM) and ephemeral key exchange.

### 5.1 Phase 1: Secure Handshake (ECDH)
As soon as the TCP socket connects, before sending any Protobuf message, the exchange of public keys (Raw Bytes) takes place.

1.  **Initiator** sends: `[Length (4 bytes)] [Public Key (SubjectPublicKeyInfo format)]`
2.  **Responder** sends: `[Length (4 bytes)] [Public Key (SubjectPublicKeyInfo format)]`

*Algorithm*: NIST P-256 Curve.

#### Key Derivation
Both nodes compute the **Shared Secret** via ECDH.
Session keys are derived as follows (Simplified HKDF-like):
*   `Key1 = SHA256(Secret + [0x00])`
*   `Key2 = SHA256(Secret + [0x01])`

*   **Initiator**: Encrypts with `Key1`, Decrypts with `Key2`.
*   **Responder**: Encrypts with `Key2`, Decrypts with `Key1`.

### 5.2 Phase 2: Secure Envelope
After key exchange, **all** subsequent messages must be of type `SecureEnv` (ID 9).

The *Payload* of the `SecureEnv` frame is a `SecureEnvelope` Protobuf message:

```protobuf
message SecureEnvelope {
  bytes ciphertext = 1; // Encrypted data
  bytes nonce = 2;      // IV (12 bytes for AES-GCM)
  bytes auth_tag = 3;   // Tag (16 bytes)
}
```

#### Encrypted Content (Plaintext Structure)
The decrypted `ciphertext` contains the original message structure "encapsulated":

```
[Type (1 byte)] [Compression (1 byte)] [Inner Payload (N bytes)]
```

This allows the receiver to:
1.  Decrypt `SecureEnvelope`.
2.  Read the inner `Type` (e.g., `HandshakeReq`).
3.  Read the inner `Compression` flag.
4.  Decompress (if necessary) and deserialize the `Inner Payload`.

---

## 6. Synchronization Flow (Simplified)

1.  **Connect** (TCP).
2.  **Secure Handshake** (Key Exchange).
3.  **App Handshake** (Encrypted):
    *   Client sends `HandshakeReq` (NodeID, AuthToken, Brotli Support).
    *   Server responds `HandshakeRes` (Accepted: true/false, Selected Compression).
4.  **Sync**:
    *   Client requests remote clock: `GetClockReq`.
    *   Client calculates delta and requests data: `PullChangesReq` (since `LastKnownHlc`).
    *   Server sends `ChangeSetRes`.

## 7. Protobuf Definitions (Reference)

See `sync.proto` file for the exact message definitions.

```protobuf
message HandshakeRequest {
  string node_id = 1;
  string auth_token = 2;
  repeated string supported_compression = 3;
}
// ... (other messages)
```

## 8. Resolved Discrepancies (Notes for Implementers)
*   **Framing**: Previous documentation indicated `[Len][Comp][Payload]` framing. The current implementation (v0.7.0) uses `[Len][Type][Comp][Payload]`. This RFC formalizes the version with explicit `Type`.
*   **Handshake**: ECDH exchange happens *before* any Protobuf message.
