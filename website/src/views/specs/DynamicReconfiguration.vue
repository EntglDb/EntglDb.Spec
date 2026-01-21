<template>
  <div class="spec-content">
    <h1>Dynamic Reconfiguration</h1>
    <p class="lead">Change server roles, listening ports, and database identity without process restarts.</p>

    <h2>Overview</h2>
    <p>
      EntglDb v0.8.0 introduces support for dynamic reconfiguration. This allows nodes to:
    </p>
    <ul>
      <li>Switch between <strong>Client</strong> and <strong>Server</strong> modes dynamically.</li>
      <li>Change listening ports.</li>
      <li>Switch database identities (NodeIDs) without restarting the entire application process.</li>
    </ul>

    <h2>Configuration Provider</h2>
    <p>
      The core mechanism is the <code>IPeerNodeConfigurationProvider</code>. Services subscribe to this provider to receive real-time updates.
    </p>

    <pre><code class="language-typescript">// Example Interface
interface IPeerNodeConfigurationProvider {
    getConfiguration(): Promise&lt;PeerNodeConfiguration>;
    onConfigurationChanged(callback: (config: PeerNodeConfiguration) => void): void;
}</code></pre>

    <h2>Known Peers (Static Remote)</h2>
    <p>
      You can now persist "Known Peers" (Static Remote nodes) that survive restarts. This is essential for connecting to fixed Cloud Gateways or specific nodes outside the local broadcast domain.
    </p>

    <pre><code class="language-typescript">// Add a static peer
await peerStore.saveRemotePeer({
    nodeId: "gateway-1",
    address: "192.168.1.50:25000",
    type: PeerType.StaticRemote,
    // ...
});</code></pre>

    <h2>Leader Election (Bully Algorithm)</h2>
    <p>
      For Cloud Synchronization, EntglDb implements the <strong>Bully Algorithm</strong>.
    </p>
    <ul>
        <li>Nodes automatically elect a leader to act as the Cloud Gateway.</li>
        <li>The node with the lexicographically smallest NodeID wins.</li>
        <li>Eliminates redundant traffic to the cloud.</li>
    </ul>
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

h2 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

ul {
    margin-left: 20px;
    margin-bottom: 20px;
    color: var(--text-secondary);
}

li {
    margin-bottom: 8px;
}

.lead {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
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
</style>
