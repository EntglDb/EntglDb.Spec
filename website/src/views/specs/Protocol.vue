<template>
  <div class="spec-view">
    <h1>Wire Protocol</h1>
    <p class="lead">EntglDb establishes a secure, framed TCP connection on Port 25000.</p>

    <h2>Message Framing</h2>
    <p>Every message is prefixed with a 4-byte Signed Integer (Big Endian) indicating the payload length.</p>
    
    <div class="packet-visual">
      <div class="packet-part header">
        <span class="label">Length</span>
        <span class="value">4 Bytes</span>
      </div>
      <div class="packet-part payload">
        <span class="label">Payload</span>
        <span class="value">N Bytes (Protobuf)</span>
      </div>
    </div>

    <h2>Handshake Flow</h2>
    <div class="flow-diagram">
      <div class="step">
        <div class="node">Client</div>
        <div class="arrow">Running ECDH (P-256)</div>
        <div class="node">Server</div>
      </div>
      
      <div class="msg-box">
        <span class="msg-arrow">➔</span>
        <strong>Client Hello</strong>
        <code class="mini-code">[Public Key A]</code>
      </div>

      <div class="msg-box">
        <span class="msg-arrow">➔</span>
        <strong>Server Hello</strong>
        <code class="mini-code">[Public Key B] + [Salt]</code>
      </div>

      <div class="action-box">
        Both derive <strong>Shared Secret</strong> via ECDH + HKDF
      </div>

      <div class="msg-box encrypted">
        <span class="msg-arrow">🔒</span>
        <strong>Encrypted Channel Established</strong>
        <small>AES-256-GCM</small>
      </div>
    </div>

    <h2>Encryption Standards</h2>
    <div class="grid-card">
      <div class="card-item">
        <strong>Key Exchange</strong>
        <span>ECDH P-256</span>
      </div>
      <div class="card-item">
        <strong>Cipher</strong>
        <span>AES/GCM/NoPadding</span>
      </div>
      <div class="card-item">
        <strong>Key Size</strong>
        <span>256-bit</span>
      </div>
      <div class="card-item">
        <strong>Auth Tag</strong>
        <span>128-bit</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lead {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 40px;
}

.packet-visual {
  display: flex;
  font-family: var(--font-mono);
  margin: 40px 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.packet-part {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.packet-part.header {
  background: var(--accent-primary);
  color: #fff;
  width: 120px;
}

.packet-part.payload {
  background: rgba(255, 255, 255, 0.05);
  flex: 1;
  color: var(--text-primary);
}

.label {
  font-size: 0.75rem;
  text-transform: uppercase;
  margin-bottom: 4px;
  opacity: 0.8;
}

.value {
  font-weight: 600;
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
  padding: 10px;
  font-style: italic;
  color: var(--extension-text); /* Fallback */ 
  color: var(--text-muted);
  font-size: 0.9rem;
}

.mini-code {
  background: rgba(0,0,0,0.3);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-family: var(--font-mono);
  margin-left: auto;
}

.grid-card {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 40px;
}

.card-item {
  background: rgba(255,255,255,0.03);
  padding: 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.card-item strong {
  margin-bottom: 8px;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.card-item span {
  font-weight: 600;
  color: var(--accent-primary);
}
</style>
