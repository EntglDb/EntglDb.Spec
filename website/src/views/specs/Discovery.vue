<template>
  <div class="spec-view">
    <h1>Discovery Protocol</h1>
    <p class="lead">EntglDb nodes automatically find each other on the LAN using UDP Broadcast.</p>
    
    <div class="spec-card">
      <div class="spec-item">
        <label>Transport</label>
        <span>UDP / Multicast</span>
      </div>
      <div class="spec-item">
        <label>Port</label>
        <span class="highlight">25000</span>
      </div>
      <div class="spec-item">
        <label>Interval</label>
        <span>5000 ms</span>
      </div>
    </div>

    <h2>Beacon Payload</h2>
    <p>Every node broadcasts the following JSON structure:</p>
    
    <pre class="code-block"><code>{
  <span class="key">"node_id"</span>: <span class="string">"uuid-v4-string"</span>,
  <span class="key">"tcp_port"</span>: <span class="number">25000</span>
}</code></pre>

    <h2>Discovery Logic</h2>
    <ol class="steps">
      <li>Bind UDP socket to <strong>Port 25000</strong>.</li>
      <li>Calculate subnet broadcast address (e.g., <code>192.168.1.255</code>).</li>
      <li>Send Beacon every 5 seconds.</li>
      <li>Listen for incoming beacons to build the Peer Table.</li>
    </ol>
  </div>
</template>

<style scoped>
.lead {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 40px;
}

.spec-card {
  display: flex;
  gap: 40px;
  background: rgba(255, 255, 255, 0.05);
  padding: 24px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  margin-bottom: 40px;
}

.spec-item {
  display: flex;
  flex-direction: column;
}

.spec-item label {
  font-size: 0.8rem;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.spec-item span {
  font-family: var(--font-mono);
  font-size: 1.1rem;
  color: var(--text-primary);
}

.highlight {
  color: var(--accent-secondary) !important;
}

.code-block {
  background: #0f0f13;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  font-family: var(--font-mono);
  color: #a1a1aa;
  margin-bottom: 40px;
}

.key { color: var(--accent-primary); }
.string { color: #a5f3fc; }
.number { color: #fba740; }

.steps {
  padding-left: 20px;
  line-height: 1.8;
  color: var(--text-secondary);
}

.steps strong {
  color: var(--text-primary);
}
</style>
