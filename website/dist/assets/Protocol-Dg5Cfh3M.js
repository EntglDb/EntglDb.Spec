import{_ as s,a as t,p as e,o as n}from"./index-C_0Rsq9s.js";const o={},r={class:"spec-view"};function d(i,a){return n(),t("div",r,[...a[0]||(a[0]=[e(`<h1 data-v-94fb0958>Wire Protocol</h1><p class="lead" data-v-94fb0958>EntglDb implements a custom secure transport layer inspired by the <a href="http://noiseprotocol.org/" target="_blank" class="highlight" data-v-94fb0958>Noise Protocol Framework</a> (<strong data-v-94fb0958>NN Pattern</strong>).</p><h2 data-v-94fb0958>Security Handshake (Noise NN)</h2><p data-v-94fb0958>The handshake provides mutual authentication and establishes ephemeral session keys without requiring long-term static keys (for now).</p><h2 data-v-94fb0958>Message Framing (v0.7.0)</h2><p data-v-94fb0958>Every message is prefixed with a 4-byte Length (<strong data-v-94fb0958>Little Endian</strong>) plus a 1-byte <strong data-v-94fb0958>Compression Flag</strong>.</p><div class="packet-visual" data-v-94fb0958><div class="packet-part header" data-v-94fb0958><span class="label" data-v-94fb0958>Length</span><span class="value" data-v-94fb0958>4 Bytes</span></div><div class="packet-part flag" data-v-94fb0958><span class="label" data-v-94fb0958>Comp</span><span class="value" data-v-94fb0958>1 Byte</span></div><div class="packet-part payload" data-v-94fb0958><span class="label" data-v-94fb0958>Payload</span><span class="value" data-v-94fb0958>N Bytes (Protobuf)</span></div></div><div class="alert-box" data-v-94fb0958><strong data-v-94fb0958>Compression Logic (Brotli)</strong><p data-v-94fb0958>If flag is <code data-v-94fb0958>0x01</code>, payload is Brotli-compressed. Threshold: 1024 bytes.</p></div><div class="flow-diagram" data-v-94fb0958><div class="step" data-v-94fb0958><div class="node" data-v-94fb0958>Initiator</div><div class="arrow" data-v-94fb0958>ECDH P-256</div><div class="node" data-v-94fb0958>Responder</div></div><div class="msg-box" data-v-94fb0958><span class="msg-arrow" data-v-94fb0958>➔</span><strong data-v-94fb0958>Client Hello</strong><code class="mini-code" data-v-94fb0958>Key + Comp:[&quot;brotli&quot;]</code></div><div class="msg-box" data-v-94fb0958><span class="msg-arrow" data-v-94fb0958>➔</span><strong data-v-94fb0958>Server Hello</strong><code class="mini-code" data-v-94fb0958>Key + Salt + Comp:&quot;brotli&quot;</code></div><div class="action-box" data-v-94fb0958><strong data-v-94fb0958>HKDF Derivation</strong><br data-v-94fb0958> SharedSecret = ECDH(Alice.Priv, Bob.Pub)<br data-v-94fb0958> Keys = HKDF(SharedSecret, Salt) </div><div class="msg-box encrypted" data-v-94fb0958><span class="msg-arrow" data-v-94fb0958>🔒</span><strong data-v-94fb0958>Secure Transport</strong><small data-v-94fb0958>AES-256-GCM</small></div></div><h2 data-v-94fb0958>Protobuf Definitions</h2><p data-v-94fb0958>All payload messages are serialized using Google Protocol Buffers (v3).</p><div class="code-block scrollable" data-v-94fb0958><pre data-v-94fb0958><code data-v-94fb0958>syntax = &quot;proto3&quot;;

package EntglDb.Network.Proto;

option java_package = &quot;com.entgldb.network.proto&quot;;
option csharp_namespace = &quot;EntglDb.Network.Proto&quot;;

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
  string operation = 3; // &quot;Put&quot; or &quot;Delete&quot;
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
}</code></pre></div>`,12)])])}const c=s(o,[["render",d],["__scopeId","data-v-94fb0958"]]);export{c as default};
