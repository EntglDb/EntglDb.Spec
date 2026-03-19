<template>
  <div class="spec-content">
    <h1>Getting Started</h1>
    <p class="lead">Entgl is a peer-to-peer mesh platform. EntglDb, its flagship service, provides real-time database synchronization across devices. Choose your platform to get started.</p>

    <div class="tabs">
      <div class="tab-header">
        <button :class="{ active: activeTab === 'net' }" @click="activeTab = 'net'">.NET</button>
        <button :class="{ active: activeTab === 'node' }" @click="activeTab = 'node'">Node.js</button>
        <button :class="{ active: activeTab === 'kotlin' }" @click="activeTab = 'kotlin'">Kotlin (Android)</button>
      </div>
      
      <!-- .NET Content -->
      <div class="tab-content" v-if="activeTab === 'net'">
        <h2>Requirements</h2>
        <p>EntglDb.Net v2.x targets <strong>.NET Standard 2.1</strong> and <strong>.NET 10.0</strong>. The persistence and ASP.NET integration packages require <strong>.NET 10.0</strong>.</p>

        <h2>Installation</h2>
        <p>Install the packages that match your deployment scenario:</p>
        <pre><code class="language-bash"># Core sync engine (always required)
dotnet add package EntglDb.Core
dotnet add package EntglDb.Sync
dotnet add package EntglDb.Network

# Persistence — choose one or both:
dotnet add package EntglDb.Persistence.BLite          # Embedded BLite (net10.0)
dotnet add package EntglDb.Persistence.EntityFramework # EF Core / PostgreSQL (net10.0)

# ASP.NET Core hosting (net10.0, optional)
dotnet add package EntglDb.AspNet</code></pre>

        <h2>1. Define your Document Store</h2>
        <p>Create a class that extends <code>BLiteDocumentStore&lt;T&gt;</code> and watch the collections you want to sync.</p>
        <pre><code class="language-csharp">using EntglDb.Persistence.BLite;

public class AppDbContext : BLiteDbContext
{
    public AppDbContext(string path) : base(path) { }
}

public class AppDocumentStore : BLiteDocumentStore&lt;AppDbContext&gt;
{
    public AppDocumentStore(AppDbContext ctx, IEntglDbSyncManager sync)
        : base(ctx, sync)
    {
        // Register each collection you want synced across peers
        WatchCollection&lt;TodoItem&gt;("todos");
        WatchCollection&lt;Note&gt;("notes");
    }
}</code></pre>

        <h2>2. Register Services</h2>
        <p>Wire everything up in your DI container. For ASP.NET Core, use <code>Program.cs</code>:</p>
        <pre><code class="language-csharp">using EntglDb.AspNet;
using EntglDb.Network;
using EntglDb.Persistence.BLite;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddEntglDbCore()
    .AddEntglDbBLite&lt;AppDbContext, AppDocumentStore&gt;(
        sp =&gt; new AppDbContext("myapp.blite"))
    .AddEntglDbNetwork&lt;StaticPeerNodeConfigurationProvider&gt;();

var app = builder.Build();
app.UseEntglDb();
app.Run();</code></pre>

        <h2>3. Provide Peer Configuration</h2>
        <p>Implement <code>IPeerNodeConfigurationProvider</code> or use the built-in <code>StaticPeerNodeConfigurationProvider</code> for fixed peer lists:</p>
        <pre><code class="language-csharp">// In appsettings.json:
{
  "EntglDb": {
    "NodeId": "node-kitchen",
    "Port": 25000,
    "AuthToken": "my-shared-cluster-secret",
    "KnownPeers": [
      { "Host": "192.168.1.10", "Port": 25000 },
      { "Host": "192.168.1.11", "Port": 25000 }
    ]
  }
}</code></pre>

        <h2>4. Use the Document Store</h2>
        <pre><code class="language-csharp">// Inject AppDocumentStore via DI
public class TodoService
{
    private readonly AppDocumentStore _store;

    public TodoService(AppDocumentStore store) =&gt; _store = store;

    public async Task AddTodoAsync(TodoItem item)
    {
        await _store.UpsertAsync("todos", item.Id, item);
    }

    public async Task&lt;IEnumerable&lt;TodoItem&gt;&gt; GetAllAsync()
    {
        return await _store.QueryAsync&lt;TodoItem&gt;("todos");
    }
}</code></pre>

        <p>Changes are automatically propagated to all peers in the mesh via gossip synchronization (every ~2 seconds). Conflict resolution uses Last-Write-Wins (LWW) by default; implement <code>IConflictResolver</code> for custom merge strategies.</p>

        <h2>Console / Non-ASP.NET</h2>
        <pre><code class="language-csharp">var host = Host.CreateDefaultBuilder()
    .ConfigureServices(services =&gt;
    {
        services
            .AddEntglDbCore()
            .AddEntglDbBLite&lt;AppDbContext, AppDocumentStore&gt;(
                sp =&gt; new AppDbContext("myapp.blite"))
            .AddEntglDbNetwork&lt;StaticPeerNodeConfigurationProvider&gt;();
    })
    .Build();

await host.RunAsync();</code></pre>

        <div class="info-box">
          <strong>⚠️ Breaking change in v2.0:</strong> Dropped netstandard2.0, .NET 6, and .NET 8. Minimum is .NET Standard 2.1 / .NET 10.
        </div>
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
        <pre><code class="language-kotlin">    implementation("com.entgldb:core:0.9.0")
    implementation("com.entgldb:network:0.9.0")
    implementation("com.entgldb:persistence-sqlite-android:0.9.0")
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

.info-box {
  margin-top: 2rem;
  padding: 1rem 1.25rem;
  border-left: 4px solid var(--accent-primary);
  background: rgba(139, 92, 246, 0.08);
  border-radius: 0 6px 6px 0;
  font-size: 0.95rem;
  color: var(--text-secondary);
}
</style>
