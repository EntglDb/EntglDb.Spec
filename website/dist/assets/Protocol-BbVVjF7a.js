import{_ as a,c as n,i as t,o as s}from"./index-CeSvit2C.js";const o={},r={class:"spec-view"};function i(d,e){return s(),n("div",r,[...e[0]||(e[0]=[t(`<h1 data-v-490131b0>Wire Protocol</h1><p class="lead" data-v-490131b0>EntglDb implements a custom secure transport layer inspired by the <a href="http://noiseprotocol.org/" target="_blank" class="highlight" data-v-490131b0>Noise Protocol Framework</a> (<strong data-v-490131b0>NN Pattern</strong>).</p><h2 data-v-490131b0>Security Handshake (Noise NN)</h2><p data-v-490131b0>The handshake provides mutual authentication and establishes ephemeral session keys without requiring long-term static keys (for now).</p><div class="flow-diagram" data-v-490131b0><div class="step" data-v-490131b0><div class="node" data-v-490131b0>Initiator</div><div class="arrow" data-v-490131b0>ECDH P-256</div><div class="node" data-v-490131b0>Responder</div></div><div class="msg-box" data-v-490131b0><span class="msg-arrow" data-v-490131b0>➔</span><strong data-v-490131b0>Alice</strong> sends Ephemeral Public Key <code class="mini-code" data-v-490131b0>Bytes(65)</code></div><div class="msg-box" data-v-490131b0><span class="msg-arrow" data-v-490131b0>➔</span><strong data-v-490131b0>Bob</strong> sends Ephemeral Public Key <code class="mini-code" data-v-490131b0>Bytes(65) + Salt</code></div><div class="action-box" data-v-490131b0><strong data-v-490131b0>HKDF Derivation</strong><br data-v-490131b0> SharedSecret = ECDH(Alice.Priv, Bob.Pub)<br data-v-490131b0> Keys = HKDF(SharedSecret, Salt) </div><div class="msg-box encrypted" data-v-490131b0><span class="msg-arrow" data-v-490131b0>🔒</span><strong data-v-490131b0>Secure Transport</strong><small data-v-490131b0>AES-256-GCM</small></div></div><h2 data-v-490131b0>Protobuf Definitions</h2><p data-v-490131b0>All payload messages are serialized using Google Protocol Buffers (v3).</p><div class="code-block scrollable" data-v-490131b0><pre data-v-490131b0><code data-v-490131b0>syntax = &quot;proto3&quot;;

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
}</code></pre></div>`,8)])])}const l=a(o,[["render",i],["__scopeId","data-v-490131b0"]]);export{l as default};
