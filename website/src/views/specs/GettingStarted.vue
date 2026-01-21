<template>
  <div class="spec-content">
    <h1>Getting Started</h1>
    <p class="lead">EntglDb is a decentralized, offline-first peer-to-peer database. Choose your platform to get started.</p>

    <div class="tabs">
      <div class="tab-header">
        <button :class="{ active: activeTab === 'net' }" @click="activeTab = 'net'">.NET</button>
        <button :class="{ active: activeTab === 'node' }" @click="activeTab = 'node'">Node.js</button>
        <button :class="{ active: activeTab === 'kotlin' }" @click="activeTab = 'kotlin'">Kotlin (Android)</button>
      </div>
      
      <!-- .NET Content -->
      <div class="tab-content" v-if="activeTab === 'net'">
        <h2>Installation</h2>
        <p>EntglDb is available found on NuGet.</p>
        <pre><code class="language-bash">dotnet add package EntglDb.Core
dotnet add package EntglDb.Network
dotnet add package EntglDb.Persistence.Sqlite</code></pre>

        <h2>Basic Usage</h2>
        <h3>1. Initialize Store</h3>
        <pre><code class="language-csharp">using EntglDb.Core;
using EntglDb.Persistence.Sqlite;
using EntglDb.Network.Security;

// Choose conflict resolver
var resolver = new RecursiveNodeMergeConflictResolver();
var store = new SqlitePeerStore("Data Source=my-node.db", logger, resolver);</code></pre>

        <h3>2. Configure Network</h3>
        <pre><code class="language-csharp">var services = new ServiceCollection();
services.AddSingleton&lt;IPeerStore>(store);
services.AddSingleton&lt;IPeerHandshakeService, SecureHandshakeService>();
services.AddEntglDbNetwork("node-1", 5001, "my-secret-cluster-key");</code></pre>
      </div>

      <!-- Node.js Content -->
      <div class="tab-content" v-if="activeTab === 'node'">
        <h2>Installation</h2>
        <p>EntglDb is modular. Install core and adapters via npm/pnpm.</p>
        <pre><code class="language-bash">pnpm add @entgldb/core @entgldb/persistence-sqlite @entgldb/network</code></pre>

        <h2>Quick Start</h2>
        <pre><code class="language-typescript">import { PeerDb } from '@entgldb/core';
import { SqlitePeerStore } from '@entgldb/persistence-sqlite';
import { TcpSyncServer } from '@entgldb/network';

// 1. Storage
const store = new SqlitePeerStore('./my-db.sqlite');
await store.init();

// 2. Database
const db = new PeerDb(store);

// 3. Server
const server = new TcpSyncServer({
    store,
    nodeId: 'node-1',
    port: 3000
});
server.start();</code></pre>
      </div>

      <!-- Kotlin Content -->
      <div class="tab-content" v-if="activeTab === 'kotlin'">
        <h2>Installation</h2>
        <p>Add dependencies to your <code>build.gradle.kts</code>.</p>
        <pre><code class="language-kotlin">    implementation("com.entgldb:core:0.8.0")
    implementation("com.entgldb:network:0.8.0")
    implementation("com.entgldb:persistence-sqlite-android:0.8.0")
}</code></pre>

        <h2>Platform Setup</h2>
        <p>Ensure you have internet and multicast permissions in <code>AndroidManifest.xml</code>.</p>

        <h2>Basic Usage</h2>
        <pre><code class="language-kotlin">val dbPath = context.getDatabasePath("entgldb.db").absolutePath
val peerStore = SqlitePeerStore(context, dbPath)

val nodeId = "android-node-${UUID.randomUUID()}"
val handshakeService = SecureHandshakeService("your-secret-auth-key")

val tcpServer = TcpSyncServer(nodeId, 0, handshakeService)
val discovery = UdpDiscoveryService(nodeId, 0)
val orchestrator = SyncOrchestrator(discovery, TcpPeerClient(handshakeService))

val node = EntglDbNode(tcpServer, discovery, orchestrator)
node.start()</code></pre>
      </div>
    </div>
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
  margin-bottom: 2rem;
}

code {
  font-family: 'Fira Code', monospace;
  font-size: 0.9rem;
}

h2 {
  margin-top: 2rem;
  margin-bottom: 1rem;
}

h3 {
    margin-top: 1.5rem;
    color: var(--text-secondary);
}
</style>
