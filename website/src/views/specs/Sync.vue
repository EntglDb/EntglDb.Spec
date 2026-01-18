<template>
  <div class="spec-view">
    <h1>Synchronization</h1>
    <p class="lead">EntglDb ensures Eventually Consistent state across the mesh using Hybrid Logical Clocks (HLC) and conflict-free merge strategies.</p>

    <h2>Conflict Resolution</h2>
    
    <div class="strategy-card">
      <div class="strategy-header">
        <h3>1. Last-Write-Wins (LWW)</h3>
        <span class="badge">Object Level</span>
      </div>
      <p>The simplest strategy. If two nodes update the same document, the version with the highest <strong>HLC Timestamp</strong> wins.</p>
      <ul>
        <li>Fast and deterministic.</li>
        <li>Ideal for simple key-value stores.</li>
      </ul>
    </div>

    <div class="strategy-card">
      <div class="strategy-header">
        <h3>2. Recursive Merge</h3>
        <span class="badge highlight">Deep Merge</span>
      </div>
      <p>Intelligently merges JSON objects field-by-field. Preserves non-conflicting changes from multiple devices.</p>
      <div class="merge-demo">
        <div class="merge-col">
          <strong>Node A</strong> (t=100)
          <pre><code>{
  "name": "Alice",
  "age": 30
}</code></pre>
        </div>
        <div class="merge-symbol">+</div>
        <div class="merge-col">
          <strong>Node B</strong> (t=101)
          <pre><code>{
  "name": "Alice",
  "role": "Manager"
}</code></pre>
        </div>
        <div class="merge-symbol">=</div>
        <div class="merge-col result">
          <strong>Result</strong>
          <pre><code>{
  "name": "Alice",
  "age": 30,
  "role": "Manager"
}</code></pre>
        </div>
      </div>
    </div>

    <h2>Sync Lifecycle</h2>
    <div class="steps-timeline">
      <div class="step">
        <div class="step-marker">1</div>
        <div class="step-content">
          <h4>Handshake & Auth</h4>
          <p>Establish secure channel and verify identity.</p>
        </div>
      </div>
      <div class="step">
        <div class="step-marker">2</div>
        <div class="step-content">
          <h4>Vector Clock Exchange</h4>
          <p>Each node shares its "Knowledge State" (Map of NodeId -> Last Timestamp).</p>
        </div>
      </div>
      <div class="step">
        <div class="step-marker">3</div>
        <div class="step-content">
          <h4>Delta Calculation</h4>
          <p>Nodes calculate which Oplog Entries the other peer is missing.</p>
        </div>
      </div>
      <div class="step">
        <div class="step-marker">4</div>
        <div class="step-content">
          <h4>Gossip & Batching</h4>
          <p>Missing entries are pushed in batches. New Real-time changes are gossiped immediately.</p>
        </div>
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
}

.merge-demo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.merge-col {
  flex: 1;
  min-width: 140px;
}

.merge-col pre {
  background: #000;
  padding: 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  border: 1px solid var(--border-color);
  margin-top: 8px;
}

.merge-col.result pre {
  border-color: var(--accent-secondary);
}

.merge-symbol {
  font-size: 1.5rem;
  color: var(--text-muted);
}

.steps-timeline {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 40px;
}

.step {
  display: flex;
  gap: 20px;
}

.step-marker {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.step-content h4 {
  margin: 0 0 4px 0;
  font-size: 1rem;
}

.step-content p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}
</style>
