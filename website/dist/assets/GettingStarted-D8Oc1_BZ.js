import{d as l,l as c,a,b as e,m as d,n as r,p as i,o,_ as p}from"./index-CVmwAqS1.js";const u={class:"spec-content"},g={class:"tabs"},v={class:"tab-header"},b={key:0,class:"tab-content"},m={key:1,class:"tab-content"},f={key:2,class:"tab-content"},h=l({__name:"GettingStarted",setup(q){const n=c("net");return(S,t)=>(o(),a("div",u,[t[6]||(t[6]=e("h1",null,"Getting Started",-1)),t[7]||(t[7]=e("p",{class:"lead"},"Entgl is a peer-to-peer mesh platform. EntglDb, its flagship service, provides real-time database synchronization across devices. Choose your platform to get started.",-1)),e("div",g,[e("div",v,[e("button",{class:r({active:n.value==="net"}),onClick:t[0]||(t[0]=s=>n.value="net")},".NET",2),e("button",{class:r({active:n.value==="node"}),onClick:t[1]||(t[1]=s=>n.value="node")},"Node.js",2),e("button",{class:r({active:n.value==="kotlin"}),onClick:t[2]||(t[2]=s=>n.value="kotlin")},"Kotlin (Android)",2)]),n.value==="net"?(o(),a("div",b,[...t[3]||(t[3]=[i(`<h2 data-v-4623f6da>Requirements</h2><p data-v-4623f6da>EntglDb.Net v2.x targets <strong data-v-4623f6da>.NET Standard 2.1</strong> and <strong data-v-4623f6da>.NET 10.0</strong>. The persistence and ASP.NET integration packages require <strong data-v-4623f6da>.NET 10.0</strong>.</p><h2 data-v-4623f6da>Installation</h2><p data-v-4623f6da>Install the packages that match your deployment scenario:</p><pre data-v-4623f6da><code class="language-bash" data-v-4623f6da># Core sync engine (always required)
dotnet add package EntglDb.Core
dotnet add package EntglDb.Sync
dotnet add package EntglDb.Network

# Persistence — choose one or both:
dotnet add package EntglDb.Persistence.BLite          # Embedded BLite (net10.0)
dotnet add package EntglDb.Persistence.EntityFramework # EF Core / PostgreSQL (net10.0)

# ASP.NET Core hosting (net10.0, optional)
dotnet add package EntglDb.AspNet</code></pre><h2 data-v-4623f6da>1. Define your Document Store</h2><p data-v-4623f6da>Create a class that extends <code data-v-4623f6da>BLiteDocumentStore&lt;T&gt;</code> and watch the collections you want to sync.</p><pre data-v-4623f6da><code class="language-csharp" data-v-4623f6da>using EntglDb.Persistence.BLite;

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
        WatchCollection&lt;TodoItem&gt;(&quot;todos&quot;);
        WatchCollection&lt;Note&gt;(&quot;notes&quot;);
    }
}</code></pre><h2 data-v-4623f6da>2. Register Services</h2><p data-v-4623f6da>Wire everything up in your DI container. For ASP.NET Core, use <code data-v-4623f6da>Program.cs</code>:</p><pre data-v-4623f6da><code class="language-csharp" data-v-4623f6da>using EntglDb.AspNet;
using EntglDb.Network;
using EntglDb.Persistence.BLite;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddEntglDbCore()
    .AddEntglDbBLite&lt;AppDbContext, AppDocumentStore&gt;(
        sp =&gt; new AppDbContext(&quot;myapp.blite&quot;))
    .AddEntglDbNetwork&lt;StaticPeerNodeConfigurationProvider&gt;();

var app = builder.Build();
app.UseEntglDb();
app.Run();</code></pre><h2 data-v-4623f6da>3. Provide Peer Configuration</h2><p data-v-4623f6da>Implement <code data-v-4623f6da>IPeerNodeConfigurationProvider</code> or use the built-in <code data-v-4623f6da>StaticPeerNodeConfigurationProvider</code> for fixed peer lists:</p><pre data-v-4623f6da><code class="language-csharp" data-v-4623f6da>// In appsettings.json:
{
  &quot;EntglDb&quot;: {
    &quot;NodeId&quot;: &quot;node-kitchen&quot;,
    &quot;Port&quot;: 25000,
    &quot;AuthToken&quot;: &quot;my-shared-cluster-secret&quot;,
    &quot;KnownPeers&quot;: [
      { &quot;Host&quot;: &quot;192.168.1.10&quot;, &quot;Port&quot;: 25000 },
      { &quot;Host&quot;: &quot;192.168.1.11&quot;, &quot;Port&quot;: 25000 }
    ]
  }
}</code></pre><h2 data-v-4623f6da>4. Use the Document Store</h2><pre data-v-4623f6da><code class="language-csharp" data-v-4623f6da>// Inject AppDocumentStore via DI
public class TodoService
{
    private readonly AppDocumentStore _store;

    public TodoService(AppDocumentStore store) =&gt; _store = store;

    public async Task AddTodoAsync(TodoItem item)
    {
        await _store.UpsertAsync(&quot;todos&quot;, item.Id, item);
    }

    public async Task&lt;IEnumerable&lt;TodoItem&gt;&gt; GetAllAsync()
    {
        return await _store.QueryAsync&lt;TodoItem&gt;(&quot;todos&quot;);
    }
}</code></pre><p data-v-4623f6da>Changes are automatically propagated to all peers in the mesh via gossip synchronization (every ~2 seconds). Conflict resolution uses Last-Write-Wins (LWW) by default; implement <code data-v-4623f6da>IConflictResolver</code> for custom merge strategies.</p><h2 data-v-4623f6da>Console / Non-ASP.NET</h2><pre data-v-4623f6da><code class="language-csharp" data-v-4623f6da>var host = Host.CreateDefaultBuilder()
    .ConfigureServices(services =&gt;
    {
        services
            .AddEntglDbCore()
            .AddEntglDbBLite&lt;AppDbContext, AppDocumentStore&gt;(
                sp =&gt; new AppDbContext(&quot;myapp.blite&quot;))
            .AddEntglDbNetwork&lt;StaticPeerNodeConfigurationProvider&gt;();
    })
    .Build();

await host.RunAsync();</code></pre><div class="info-box" data-v-4623f6da><strong data-v-4623f6da>⚠️ Breaking change in v2.0:</strong> Dropped netstandard2.0, .NET 6, and .NET 8. Minimum is .NET Standard 2.1 / .NET 10. </div>`,20)])])):d("",!0),n.value==="node"?(o(),a("div",m,[...t[4]||(t[4]=[e("h2",null,"Installation",-1),e("p",null,"EntglDb is modular. Install core and adapters via npm/pnpm.",-1),e("pre",null,[e("code",{class:"language-bash"},"pnpm add @entgldb/core @entgldb/persistence-sqlite @entgldb/network")],-1),e("h2",null,"Quick Start",-1),e("pre",null,[e("code",{class:"language-typescript"},`import { PeerDb } from '@entgldb/core';
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
server.start();`)],-1)])])):d("",!0),n.value==="kotlin"?(o(),a("div",f,[...t[5]||(t[5]=[i(`<h2 data-v-4623f6da>Installation</h2><p data-v-4623f6da>Add dependencies to your <code data-v-4623f6da>build.gradle.kts</code>.</p><pre data-v-4623f6da><code class="language-kotlin" data-v-4623f6da>    implementation(&quot;com.entgldb:core:0.9.0&quot;)
    implementation(&quot;com.entgldb:network:0.9.0&quot;)
    implementation(&quot;com.entgldb:persistence-sqlite-android:0.9.0&quot;)
}</code></pre><h2 data-v-4623f6da>Platform Setup</h2><p data-v-4623f6da>Ensure you have internet and multicast permissions in <code data-v-4623f6da>AndroidManifest.xml</code>.</p><h2 data-v-4623f6da>Basic Usage</h2><pre data-v-4623f6da><code class="language-kotlin" data-v-4623f6da>val dbPath = context.getDatabasePath(&quot;entgldb.db&quot;).absolutePath
val peerStore = SqlitePeerStore(context, dbPath)

val nodeId = &quot;android-node-\${UUID.randomUUID()}&quot;
val handshakeService = SecureHandshakeService(&quot;your-secret-auth-key&quot;)

val tcpServer = TcpSyncServer(nodeId, 0, handshakeService)
val discovery = UdpDiscoveryService(nodeId, 0)
val orchestrator = SyncOrchestrator(discovery, TcpPeerClient(handshakeService))

val node = EntglDbNode(tcpServer, discovery, orchestrator)
node.start()</code></pre>`,7)])])):d("",!0)])]))}}),y=p(h,[["__scopeId","data-v-4623f6da"]]);export{y as default};
