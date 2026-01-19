<template>
  <div class="spec-content">
    <h1>Querying</h1>
    <p class="lead">EntglDb provides a rich query interface for local collections, supporting idiomatic usage across .NET, Node.js, and Kotlin.</p>

    <div class="alert info">
      <strong>Note:</strong> Querying is performed locally on the device (or server) against the replicated data.
    </div>

    <h2>Query Syntax</h2>
    
    <div class="tabs">
      <div class="tab-header">
        <button :class="{ active: activeTab === 'net' }" @click="activeTab = 'net'">.NET</button>
        <button :class="{ active: activeTab === 'node' }" @click="activeTab = 'node'">Node.js</button>
        <button :class="{ active: activeTab === 'kotlin' }" @click="activeTab = 'kotlin'">Kotlin</button>
      </div>
      
      <div class="tab-content" v-if="activeTab === 'net'">
        <h3>C# / .NET</h3>
        <p>Use standard LINQ expressions to query collections.</p>
        <pre><code class="language-csharp">// Simple Match
var users = await peerStore.GetCollection&lt;User&gt;("users");
var fabio = await users.Find(u => u.FirstName == "Fabio");

// Complex Logic
var adults = await users.Find(u => u.Age >= 18 && u.IsActive);</code></pre>
      </div>

      <div class="tab-content" v-if="activeTab === 'node'">
        <h3>Node.js / TypeScript</h3>
        <p>Use a MongoDB-like object syntax for flexible querying.</p>
        <pre><code class="language-typescript">// Simple Match
const users = await peerStore.getCollection('users');
const fabio = await users.find({ firstName: 'Fabio' });

// Complex Logic
const adults = await users.find({ 
  age: { $gte: 18 },
  isActive: true
});</code></pre>
      </div>

      <div class="tab-content" v-if="activeTab === 'kotlin'">
        <h3>Kotlin (Android/JVM)</h3>
        <p>Use the type-safe DSL for a clean, idiomatic experience.</p>
        <pre><code class="language-kotlin">// Simple Match
val users = peerStore.getCollection("users")
val fabio = users.find { "firstName" eq "Fabio" }

// Complex Logic
val adults = users.find { 
    "age" gte 18
    and { "isActive" eq true } 
}</code></pre>
      </div>
    </div>

    <h2>Serialization Consistency</h2>
    <p>
      EntglDb automatically handles the mapping between your code's property naming convention (e.g., <code>camelCase</code> or <code>PascalCase</code>) 
      and the stored JSON format (e.g., <code>snake_case</code>), ensuring seamless querying regardless of the underlying serialization strategy.
    </p>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('net')
</script>

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

.alert {
  background: rgba(139, 92, 246, 0.1);
  border-left: 4px solid var(--accent-primary);
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 2rem;
}

.tabs {
  margin: 2rem 0;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}

.tab-header {
  display: flex;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid var(--border-color);
}

.tab-header button {
  padding: 1rem 2rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.tab-header button:hover {
  color: var(--text-primary);
}

.tab-header button.active {
  color: var(--accent-primary);
  border-bottom: 2px solid var(--accent-primary);
}

.tab-content {
  padding: 2rem;
  background: rgba(0, 0, 0, 0.2);
}

pre {
  background: #1e1e1e;
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
  margin-top: 1rem;
}

code {
  font-family: 'Fira Code', monospace;
  font-size: 0.9rem;
}
</style>
