<template>
  <div class="spec-content">
    <h1>Architecture</h1>
    <p class="lead">EntglDb is a leaderless, peer-to-peer database designed for local-first applications.</p>

    <!-- Concepts -->
    <section>
        <h2>Design Philosophy</h2>
        <ul>
            <li><strong>Local First:</strong> Reads and writes happen locally on the device (SQLite), ensuring zero-latency and offline availability.</li>
            <li><strong>Peer-to-Peer:</strong> No central server. Every node is equal.</li>
            <li><strong>Eventually Consistent:</strong> Data converges across the cluster using Conflict-Free Replicated Data Types (CRDT) principals.</li>
        </ul>
    </section>

    <!-- HLC -->
    <section>
        <h2>Hybrid Logical Clock (HLC)</h2>
        <p>To order events without a central authority, EntglDb uses Hybrid Logical Clocks. This combines physical time with a logical counter to capture causality.</p>
        <div class="alert-box">
            <strong>Last Write Wins (LWW)</strong>
            <p>By default, conflicts are resolved by comparing HLC timestamps. The higher timestamp wins.</p>
        </div>
    </section>

    <!-- Synchronization -->
    <section>
        <h2>Synchronization</h2>
        <p>Sync happens in two stages:</p>
        <ol>
            <li><strong>Discovery:</strong> Nodes find each other on the LAN via UDP Multicast.</li>
            <li><strong>Anti-Entropy:</strong> Nodes pair up via TCP and exchange Merkle Trees (or High Water Marks) to identify missing data.</li>
        </ol>
        
        <h3>Gossip Protocol</h3>
        <p>Updates propagate via an epidemic algorithm. When a node changes data, it pushes it to random connected peers, who in turn push it to others.</p>
    </section>

    <!-- Data Flow -->
    <section>
        <h2>Data Flow</h2>
        <div class="flow-diagram">
            <div class="step">App Write ➔ Local SQLite ➔ OpLog ➔ Sync Orchestrator ➔ TCP Push ➔ Remote Peer</div>
        </div>
    </section>

  </div>
</template>

<style scoped>
.spec-content {
  line-height: 1.6;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, var(--accent-primary), var(--accent-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.lead {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

h2 {
  margin-top: 3rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
}

h3 {
    margin-top: 1.5rem;
    color: var(--text-secondary);
}

ul, ol {
    margin-left: 20px;
    color: var(--text-muted);
}

li {
    margin-bottom: 0.5rem;
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

.flow-diagram {
    background: rgba(255,255,255,0.05);
    padding: 20px;
    border-radius: 8px;
    font-family: monospace;
    text-align: center;
}
</style>
