<template>
  <div class="spec-view">
    <h1>Synchronization</h1>
    <p class="lead">EntglDb implements a <strong>Local-First, Peer-to-Peer</strong> architecture that ensures Eventually Consistent state across a dynamic mesh using Hybrid Logical Clocks and Hash-Chained integrity.</p>

    <div class="info-grid">
      <div class="info-card">
        <h3>Multi-Master</h3>
        <p>Every node can accept writes independently. No central coordinator is required.</p>
      </div>
      <div class="info-card">
        <h3>Offline-First</h3>
        <p>Devices operate fully offline and sync automatically when connectivity is restored.</p>
      </div>
      <div class="info-card">
        <h3>Gossip Protocol</h3>
        <p>Changes propagate virally through the network graph, ensuring high availability.</p>
      </div>
    </div>

    <h2>Conflict Resolution</h2>
    <p>Conflicts are inevitable in distributed systems. EntglDb resolves them deterministically without user intervention.</p>

    <div class="strategy-card">
      <div class="strategy-header">
        <h3>1. Last-Write-Wins (LWW)</h3>
        <span class="badge">Object Level</span>
      </div>
      <p>For simple key-value storage, the version with the highest <strong>HLC Timestamp</strong> wins. Ties are broken by Node ID.</p>
    </div>

    <div class="strategy-card">
      <div class="strategy-header">
        <h3>2. Recursive Merge</h3>
        <span class="badge highlight">Deep Merge</span>
      </div>
      <p>JSON objects are merged field-by-field, preserving non-conflicting changes from multiple actors.</p>
      
      <div class="merge-demo">
        <div class="merge-col">
          <strong>Node A</strong> (t=100)
          <pre><code>{
  "name": "Alice",
  "settings": {
    "theme": "dark"
  }
}</code></pre>
        </div>
        <div class="merge-symbol">+</div>
        <div class="merge-col">
          <strong>Node B</strong> (t=105)
          <pre><code>{
  "name": "Alice",
  "settings": {
    "notifications": true
  }
}</code></pre>
        </div>
        <div class="merge-symbol">=</div>
        <div class="merge-col result">
          <strong>Result</strong>
          <pre><code>{
  "name": "Alice",
  "settings": {
    "theme": "dark",
    "notifications": true
  }
}</code></pre>
        </div>
      </div>
    </div>

    <h2>Snapshots & "Forever" Scaling</h2>
    <p>To prevent infinite log growth, EntglDb uses advanced chain pruning and snapshotting.</p>

    <div class="strategy-card">
      <div class="strategy-header">
         <h3>Boundary Convergence (Self-Healing)</h3>
         <span class="badge highlight">New in v0.8.5</span>
      </div>
      <p>When nodes have different pruned histories, Snapshots act as <strong>Convergence Points</strong>.</p>
      <p>If a node attempts to sync new data that links back to a known <strong>Snapshot Boundary Hash</strong>, the network automatically bridges the gap. This allows the mesh to "forget" old divergent history and converge on the latest valid state.</p>
    </div>

    <h2>Sync Lifecycle</h2>
    <div class="steps-timeline">
      <div class="step">
        <div class="step-marker">1</div>
        <div class="step-content">
          <h4>Handshake & Auth</h4>
          <p>Secure TLS channel establishment and Mutual Authentication.</p>
        </div>
      </div>
      <div class="step">
        <div class="step-marker">2</div>
        <div class="step-content">
          <h4>Vector Clock Exchange</h4>
          <p>Nodes exchange "Knowledge State" to minimize bandwidth usage.</p>
        </div>
      </div>
      <div class="step">
        <div class="step-marker">3</div>
        <div class="step-content">
          <h4>Delta & Gap Detection</h4>
          <p>Missing entries are calculated. Cryptographic hash chains are verified to detect missing packets.</p>
        </div>
      </div>
      <div class="step">
        <div class="step-marker">4</div>
        <div class="step-content">
          <h4>Batch Transfer</h4>
          <p>Data is transferred in compressed batches. The local database is updated transactionally.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lead {
  font-size: 1.2rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 40px;
  max-width: 800px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 50px;
}

.info-card {
  background: var(--bg-secondary);
  padding: 20px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.info-card h3 {
  margin-top: 0;
  font-size: 1.1rem;
  color: var(--accent-primary);
}

.info-card p {
  margin: 0;
  font-size: 0.95rem;
  color: var(--text-secondary);
}

.strategy-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-color);
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 30px;
}

.strategy-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.strategy-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.badge {
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
}

.badge.highlight {
  background: rgba(139, 92, 246, 0.15);
  color: var(--accent-primary);
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.merge-demo {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 25px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.merge-col {
  flex: 1;
  min-width: 180px;
}

.merge-col pre {
  background: #0f0f13;
  padding: 15px;
  border-radius: 8px;
  font-size: 0.85rem;
  border: 1px solid var(--border-color);
  margin-top: 8px;
  font-family: 'Fira Code', monospace;
}

.merge-col.result pre {
  border-color: var(--accent-secondary);
  background: rgba(16, 185, 129, 0.05);
}

.merge-symbol {
  font-size: 1.5rem;
  color: var(--text-muted);
  font-weight: bold;
}

.steps-timeline {
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-top: 30px;
}

.step {
  display: flex;
  gap: 20px;
}

.step-marker {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--text-primary);
  flex-shrink: 0;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.step-content h4 {
  margin: 0 0 6px 0;
  font-size: 1.05rem;
}

.step-content p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.5;
}
</style>
