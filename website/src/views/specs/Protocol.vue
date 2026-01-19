<template>
  <div class="spec-view">
    <h1>Wire Protocol</h1>
    <p class="lead">EntglDb implements a custom secure transport layer inspired by the <a href="http://noiseprotocol.org/" target="_blank" class="highlight">Noise Protocol Framework</a> (<strong>NN Pattern</strong>).</p>

    <h2>Security Handshake (Noise NN)</h2>
    <p>The handshake provides mutual authentication and establishes ephemeral session keys without requiring long-term static keys (for now).</p>
    
    <h2>Message Framing (v0.7.0)</h2>
    <p>Every message is prefixed with a 4-byte Length plus a 1-byte <strong>Compression Flag</strong>.</p>
    
    <div class="packet-visual">
      <div class="packet-part header">
        <span class="label">Length</span>
        <span class="value">4 Bytes</span>
      </div>
      <div class="packet-part flag">
        <span class="label">Comp</span>
        <span class="value">1 Byte</span>
      </div>
      <div class="packet-part payload">
        <span class="label">Payload</span>
        <span class="value">N Bytes (Protobuf)</span>
      </div>
    </div>

    <div class="alert-box">
      <strong>Compression Logic (Brotli)</strong>
      <p>If flag is <code>0x01</code>, payload is Brotli-compressed. Threshold: 1024 bytes.</p>
    </div>

    <div class="flow-diagram">
      <div class="step">
        <div class="node">Initiator</div>
        <div class="arrow">ECDH P-256</div>
        <div class="node">Responder</div>
      </div>
      
      <div class="msg-box">
        <span class="msg-arrow">➔</span>
        <strong>Client Hello</strong>
        <code class="mini-code">Key + Comp:["brotli"]</code>
      </div>

      <div class="msg-box">
        <span class="msg-arrow">➔</span>
        <strong>Server Hello</strong>
        <code class="mini-code">Key + Salt + Comp:"brotli"</code>
      </div>

      <div class="action-box">
        <strong>HKDF Derivation</strong><br>
        SharedSecret = ECDH(Alice.Priv, Bob.Pub)<br>
        Keys = HKDF(SharedSecret, Salt)
      </div>

      <div class="msg-box encrypted">
        <span class="msg-arrow">🔒</span>
        <strong>Secure Transport</strong>
        <small>AES-256-GCM</small>
      </div>
    </div>

    <h2>Protobuf Definitions</h2>
    <p>All payload messages are serialized using Google Protocol Buffers (v3).</p>
    <div class="code-block scrollable">
      <pre><code>syntax = "proto3";

package EntglDb.Network.Proto;

option java_package = "com.entgldb.network.proto";
option csharp_namespace = "EntglDb.Network.Proto";

// Core Handshake
message HandshakeRequest {
  string node_id = 1;
  string auth_token = 2;
}

message HandshakeResponse {
  string node_id = 1;
  bool accepted = 2;
}

// Logical Clocks
message GetClockRequest {}
message ClockResponse {
  int64 hlc_wall = 1;
  int32 hlc_logic = 2;
  string hlc_node = 3;
}

// Synchronization
message PullChangesRequest {
  int64 since_wall = 1;
  int32 since_logic = 2;
  string since_node = 3;
}

message ChangeSetResponse {
  repeated ProtoOplogEntry entries = 1;
}

message PushChangesRequest {
  repeated ProtoOplogEntry entries = 1;
}

message AckResponse {
  bool success = 1;
}

// Data Structure
message ProtoOplogEntry {
  string collection = 1;
  string key = 2;
  string operation = 3; // "Put" or "Delete"
  string json_data = 4;
  int64 hlc_wall = 5;
  int32 hlc_logic = 6;
  string hlc_node = 7;
}

// Wire Framing
message SecureEnvelope {
  bytes ciphertext = 1;
  bytes nonce = 2;
  bytes auth_tag = 3;
}</code></pre>
    </div>
  </div>
</template>

<style scoped>
.lead {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 40px;
}

.packet-part.flag {
  background: var(--accent-secondary);
  color: #000;
  width: 80px;
}

.highlight {
  color: var(--accent-secondary);
  text-decoration: underline;
  text-underline-offset: 4px;
}

.flow-diagram {
  margin: 40px 0;
  background: rgba(0, 0, 0, 0.2);
  padding: 30px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.step {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.msg-box {
  background: rgba(255, 255, 255, 0.03);
  padding: 12px 20px;
  margin-bottom: 12px;
  border-radius: 6px;
  border-left: 3px solid var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 12px;
}

.msg-box.encrypted {
  border-left-color: var(--accent-secondary);
  background: rgba(6, 182, 212, 0.05);
}

.action-box {
  text-align: center;
  padding: 20px;
  margin: 20px 0;
  background: rgba(255,255,255,0.02);
  border-radius: 8px;
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 0.85rem;
  line-height: 1.6;
}

.mini-code {
  background: rgba(0,0,0,0.3);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-family: var(--font-mono);
  margin-left: auto;
}

.code-block {
  background: #0f0f13;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  font-family: var(--font-mono);
  font-size: 0.9rem;
  line-height: 1.5;
  color: #a1a1aa;
}

.scrollable {
  max-height: 500px;
  overflow-y: auto;
}

.alert-box {
  background: rgba(139, 92, 246, 0.1);
  border-left: 3px solid var(--accent-primary);
  padding: 16px;
  border-radius: 4px;
  margin: 20px 0;
}

.alert-box strong {
  color: var(--accent-primary);
  display: block;
  margin-bottom: 4px;
}
</style>
