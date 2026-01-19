<template>
  <div class="spec-content">
    <h1>Conflict Resolution</h1>
    <p class="lead">EntglDb provides pluggable strategies to handle concurrent updates in offline-first scenarios.</p>

    <!-- Strategies -->
    <section>
        <h2>Available Strategies</h2>
        
        <div class="strategy-card">
            <h3>Last Write Wins (LWW)</h3>
            <p class="badge default">Default</p>
            <p><strong>Mechanism:</strong> Compares Hybrid Logical Clock (HLC) timestamps. The document with the higher timestamp overwrites the loser.</p>
            <p><strong>Pros:</strong> Fast, Simple, Predictable.</p>
            <p><strong>Cons:</strong> "Loser" changes are discarded completely.</p>
        </div>

        <div class="strategy-card">
            <h3>Recursive Merge</h3>
            <p class="badge advanced">Advanced</p>
            <p><strong>Mechanism:</strong> Deep merge of JSON structures. Fields are resolved by timestamp individually. Arrays are merged by <code>id</code>.</p>
            <p><strong>Pros:</strong> Preserves collaborative edits. Intelligent array merging.</p>
            <p><strong>Cons:</strong> Higher CPU cost. More complex results.</p>
        </div>
    </section>

    <!-- Examples -->
    <section>
        <h2>Example: Object Merge</h2>
        <div class="comparison">
            <div class="col">
                <h4>Node A (t=100)</h4>
                <pre><code>{
  "name": "Alice", 
  "age": 26
}</code></pre>
            </div>
            <div class="col">
                <h4>Node B (t=105)</h4>
                <pre><code>{
  "name": "Alicia", 
  "age": 25
}</code></pre>
            </div>
            <div class="col result">
                <h4>Result (Recursive)</h4>
                <pre><code>{
  "name": "Alicia", // from B
  "age": 26       // from A
}</code></pre>
            </div>
        </div>
    </section>

    <!-- Configuration -->
    <section>
        <h2>Configuration</h2>
        <p>Strategies are configured at sync startup.</p>
        <pre><code class="language-csharp">// .NET Configuration
services.AddSingleton&lt;IConflictResolver, RecursiveNodeMergeConflictResolver>();</code></pre>
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
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

h2 {
  margin-top: 3rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
}

.strategy-card {
    background: rgba(255,255,255,0.05);
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    border: 1px solid var(--border-color);
}

.strategy-card h3 {
    margin-top: 0;
    display: inline-block;
    margin-right: 10px;
}

.badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: bold;
    text-transform: uppercase;
}
.badge.default { background: #10b981; color: #000; }
.badge.advanced { background: #8b5cf6; color: #fff; }

.comparison {
    display: flex;
    gap: 20px;
}
.col { flex: 1; }
.col.result { border-left: 2px solid var(--accent-secondary); padding-left: 20px; }

pre {
    background: #1e1e1e;
    padding: 10px;
    border-radius: 6px;
    font-size: 0.9rem;
}
</style>
