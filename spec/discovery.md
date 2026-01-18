# EntglDb Discovery Protocol

## Overview
EntglDb nodes automatically discover each other on the local network using **UDP Broadcast/Multicast**.
Each node periodically announces its presence via a "Beacon".

## Constants

| Parameter | Value | Description |
| :--- | :--- | :--- |
| **UDP Port** | `25000` | Port used for sending and receiving beacons |
| **Interval** | `5000 ms` | Time between beacon broadcasts |
| **Expiry** | `15000 ms` | Time after which a silent peer is considered offline |
| **Group Address** | `255.255.255.255` | Fallback broadcast address (primary is subnet-specific) |

## Beacon Format
The payload is a UTF-8 JSON string.

### JSON Structure
```json
{
  "node_id": "string (UUID or unique identifier)",
  "tcp_port": number (integer, typically 25000)
}
```

### Protocol versioning
Currently implicit. Future versions may add a `version` field.

## Discovery Logic

1.  **Start-up**:
    *   Bind a `DatagramSocket` to UDP Port `25000`.
    *   Enable `SO_BROADCAST`.
    *   Start a background listener loop.

2.  **Announce (Broadcast)**:
    *   Every `5000 ms`:
    *   Construct the JSON beacon.
    *   Calculate the subnet broadcast address (e.g., `192.168.1.255`).
    *   Send the UDP packet to the calculated address on port `25000`.
    *   *Optional*: Also send to `255.255.255.255` as a fallback.

3.  **Listen (Receive)**:
    *   Receive incoming UDP packets on port `25000`.
    *   Parse the JSON payload.
    *   Ignore beacons from own `node_id`.
    *   Update the "Last Seen" timestamp for the peer in the internal `PeerTable`.
    *   If the peer is new, attempt a TCP Handshake (see Protocol Spec) to synchronization.

## Reference Implementation Details
*   **Source Port**: Must originate from port `25000` to satisfy some firewall configurations (optional but recommended).
*   **Android**: Requires `WifiManager` to calculate the correct broadcast address.
