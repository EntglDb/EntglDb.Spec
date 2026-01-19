import{d,l as i,a as o,b as e,m as r,n as s,p as c,o as a,_ as v}from"./index-B9-UWCII.js";const u={class:"spec-content"},p={class:"tabs"},g={class:"tab-header"},b={key:0,class:"tab-content"},S={key:1,class:"tab-content"},m={key:2,class:"tab-content"},k=d({__name:"GettingStarted",setup(h){const n=i("net");return(q,t)=>(a(),o("div",u,[t[6]||(t[6]=e("h1",null,"Getting Started",-1)),t[7]||(t[7]=e("p",{class:"lead"},"EntglDb is a decentralized, offline-first peer-to-peer database. Choose your platform to get started.",-1)),e("div",p,[e("div",g,[e("button",{class:s({active:n.value==="net"}),onClick:t[0]||(t[0]=l=>n.value="net")},".NET",2),e("button",{class:s({active:n.value==="node"}),onClick:t[1]||(t[1]=l=>n.value="node")},"Node.js",2),e("button",{class:s({active:n.value==="kotlin"}),onClick:t[2]||(t[2]=l=>n.value="kotlin")},"Kotlin (Android)",2)]),n.value==="net"?(a(),o("div",b,[...t[3]||(t[3]=[e("h2",null,"Installation",-1),e("p",null,"EntglDb is available found on NuGet.",-1),e("pre",null,[e("code",{class:"language-bash"},`dotnet add package EntglDb.Core
dotnet add package EntglDb.Network
dotnet add package EntglDb.Persistence.Sqlite`)],-1),e("h2",null,"Basic Usage",-1),e("h3",null,"1. Initialize Store",-1),e("pre",null,[e("code",{class:"language-csharp"},`using EntglDb.Core;
using EntglDb.Persistence.Sqlite;
using EntglDb.Network.Security;

// Choose conflict resolver
var resolver = new RecursiveNodeMergeConflictResolver();
var store = new SqlitePeerStore("Data Source=my-node.db", logger, resolver);`)],-1),e("h3",null,"2. Configure Network",-1),e("pre",null,[e("code",{class:"language-csharp"},`var services = new ServiceCollection();
services.AddSingleton<IPeerStore>(store);
services.AddSingleton<IPeerHandshakeService, SecureHandshakeService>();
services.AddEntglDbNetwork("node-1", 5001, "my-secret-cluster-key");`)],-1)])])):r("",!0),n.value==="node"?(a(),o("div",S,[...t[4]||(t[4]=[e("h2",null,"Installation",-1),e("p",null,"EntglDb is modular. Install core and adapters via npm/pnpm.",-1),e("pre",null,[e("code",{class:"language-bash"},"pnpm add @entgldb/core @entgldb/persistence-sqlite @entgldb/network")],-1),e("h2",null,"Quick Start",-1),e("pre",null,[e("code",{class:"language-typescript"},`import { PeerDb } from '@entgldb/core';
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
server.start();`)],-1)])])):r("",!0),n.value==="kotlin"?(a(),o("div",m,[...t[5]||(t[5]=[c(`<h2 data-v-79415737>Installation</h2><p data-v-79415737>Add dependencies to your <code data-v-79415737>build.gradle.kts</code>.</p><pre data-v-79415737><code class="language-kotlin" data-v-79415737>dependencies {
    implementation(&quot;com.entgldb:core:0.7.0&quot;)
    implementation(&quot;com.entgldb:network:0.7.0&quot;)
    implementation(&quot;com.entgldb:persistence-sqlite-android:0.7.0&quot;)
}</code></pre><h2 data-v-79415737>Platform Setup</h2><p data-v-79415737>Ensure you have internet and multicast permissions in <code data-v-79415737>AndroidManifest.xml</code>.</p><h2 data-v-79415737>Basic Usage</h2><pre data-v-79415737><code class="language-kotlin" data-v-79415737>val dbPath = context.getDatabasePath(&quot;entgldb.db&quot;).absolutePath
val peerStore = SqlitePeerStore(context, dbPath)

val nodeId = &quot;android-node-\${UUID.randomUUID()}&quot;
val handshakeService = SecureHandshakeService(&quot;your-secret-auth-key&quot;)

val tcpServer = TcpSyncServer(nodeId, 0, handshakeService)
val discovery = UdpDiscoveryService(nodeId, 0)
val orchestrator = SyncOrchestrator(discovery, TcpPeerClient(handshakeService))

val node = EntglDbNode(tcpServer, discovery, orchestrator)
node.start()</code></pre>`,7)])])):r("",!0)])]))}}),f=v(k,[["__scopeId","data-v-79415737"]]);export{f as default};
