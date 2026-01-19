import{_ as e,c as s,i as t,o as n}from"./index-Dwvob56Q.js";const o={},d={class:"spec-view"};function c(r,a){return n(),s("div",d,[...a[0]||(a[0]=[t(`<h1 data-v-f64deca5>Wire Protocol</h1><p class="lead" data-v-f64deca5>EntglDb implements a custom secure transport layer inspired by the <a href="http://noiseprotocol.org/" target="_blank" class="highlight" data-v-f64deca5>Noise Protocol Framework</a> (<strong data-v-f64deca5>NN Pattern</strong>).</p><h2 data-v-f64deca5>Security Handshake (Noise NN)</h2><p data-v-f64deca5>The handshake provides mutual authentication and establishes ephemeral session keys without requiring long-term static keys (for now).</p><h2 data-v-f64deca5>Message Framing (v0.7.0)</h2><p data-v-f64deca5>Every message is prefixed with a 4-byte Length plus a 1-byte <strong data-v-f64deca5>Compression Flag</strong>.</p><div class="packet-visual" data-v-f64deca5><div class="packet-part header" data-v-f64deca5><span class="label" data-v-f64deca5>Length</span><span class="value" data-v-f64deca5>4 Bytes</span></div><div class="packet-part flag" data-v-f64deca5><span class="label" data-v-f64deca5>Comp</span><span class="value" data-v-f64deca5>1 Byte</span></div><div class="packet-part payload" data-v-f64deca5><span class="label" data-v-f64deca5>Payload</span><span class="value" data-v-f64deca5>N Bytes (Protobuf)</span></div></div><div class="alert-box" data-v-f64deca5><strong data-v-f64deca5>Compression Logic (Brotli)</strong><p data-v-f64deca5>If flag is <code data-v-f64deca5>0x01</code>, payload is Brotli-compressed. Threshold: 1024 bytes.</p></div><div class="flow-diagram" data-v-f64deca5><div class="step" data-v-f64deca5><div class="node" data-v-f64deca5>Initiator</div><div class="arrow" data-v-f64deca5>ECDH P-256</div><div class="node" data-v-f64deca5>Responder</div></div><div class="msg-box" data-v-f64deca5><span class="msg-arrow" data-v-f64deca5>➔</span><strong data-v-f64deca5>Client Hello</strong><code class="mini-code" data-v-f64deca5>Key + Comp:[&quot;brotli&quot;]</code></div><div class="msg-box" data-v-f64deca5><span class="msg-arrow" data-v-f64deca5>➔</span><strong data-v-f64deca5>Server Hello</strong><code class="mini-code" data-v-f64deca5>Key + Salt + Comp:&quot;brotli&quot;</code></div><div class="action-box" data-v-f64deca5><strong data-v-f64deca5>HKDF Derivation</strong><br data-v-f64deca5> SharedSecret = ECDH(Alice.Priv, Bob.Pub)<br data-v-f64deca5> Keys = HKDF(SharedSecret, Salt) </div><div class="msg-box encrypted" data-v-f64deca5><span class="msg-arrow" data-v-f64deca5>🔒</span><strong data-v-f64deca5>Secure Transport</strong><small data-v-f64deca5>AES-256-GCM</small></div></div><h2 data-v-f64deca5>Protobuf Definitions</h2><p data-v-f64deca5>All payload messages are serialized using Google Protocol Buffers (v3).</p><div class="code-block scrollable" data-v-f64deca5><pre data-v-f64deca5><code data-v-f64deca5>syntax = &quot;proto3&quot;;

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
}</code></pre></div>`,12)])])}const l=e(o,[["render",c],["__scopeId","data-v-f64deca5"]]);export{l as default};
