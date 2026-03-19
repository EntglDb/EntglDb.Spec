<template>
  <div class="roadmap-view container">
    <div class="roadmap-header">
      <h1>Roadmap</h1>
      <p class="lead">Development plans for the Entgl platform and its services.</p>
    </div>

    <div class="timeline">
      <div class="timeline-item animate-fade-in" style="animation-delay: 0.1s">
        <div class="timeline-marker released"></div>
        <div class="timeline-content">
          <h3>v2.1 Released <span class="badge-latest">Latest</span></h3>
          <ul class="feature-list">
            <li>
              <strong>ContentHash on DocumentMetadata</strong>
              <p>SHA-256 deterministic content hash via canonical JSON normalization for fast integrity verification and optimistic sync decisions.</p>
            </li>
            <li>
              <strong>P2P Sync Correctness</strong>
              <p>Improved op-log ordering, hash-chain validation, and vector clock conflict resolution across larger mesh topologies.</p>
            </li>
          </ul>
        </div>
      </div>

      <div class="timeline-item animate-fade-in" style="animation-delay: 0.15s">
        <div class="timeline-marker released"></div>
        <div class="timeline-content">
          <h3>v2.0 Released</h3>
          <ul class="feature-list">
            <li>
              <strong>Platform Upgrade — .NET 10</strong>
              <p>Dropped netstandard2.0 / .NET 6 / .NET 8 in favor of netstandard2.1 + net10.0. All Microsoft.Extensions and EF Core packages updated to 10.0.x.</p>
            </li>
            <li>
              <strong>Dynamic Database Paths</strong>
              <p>Per-node configurable database file paths resolved at runtime, enabling multi-tenant and containerized deployments.</p>
            </li>
            <li>
              <strong>EntglDbNodeService (centralized host)</strong>
              <p>Single hosted service managing all sync lifecycle: discovery, gossip, oplog, snapshot, and remote peer management.</p>
            </li>
            <li>
              <strong>Remote Peer Auto-Sync</strong>
              <p>Remote peers stored in <code>_system_remote_peers</code> collection; sync engine automatically connects, reconnects, and removes stale entries.</p>
            </li>
            <li>
              <strong>Fully Async BLite Integration</strong>
              <p>BLite 3.7.0 persistence layer rewritten with async/await throughout for improved throughput on mobile and server deployments.</p>
            </li>
          </ul>
        </div>
      </div>

      <div class="timeline-item animate-fade-in" style="animation-delay: 0.2s">
        <div class="timeline-marker released"></div>
        <div class="timeline-content">
          <h3>v1.0 Released</h3>
          <ul class="feature-list">
            <li>
              <strong>Sync Middleware Identity</strong>
              <p>First stable release: EntglDb positions itself as a sync layer, not a database. Clear separation of persistence (BLite, EF Core) from synchronization logic.</p>
            </li>
            <li>
              <strong>DocumentStore Pattern</strong>
              <p>Introduced <code>BLiteDocumentStore&lt;T&gt;</code> and <code>EfCoreDocumentStore&lt;T&gt;</code> base classes. Call <code>WatchCollection()</code> to register collections for sync.</p>
            </li>
            <li>
              <strong>VectorClockService</strong>
              <p>Centralized vector clock management for causally consistent conflict detection across the mesh.</p>
            </li>
          </ul>
        </div>
      </div>

      <div class="timeline-item animate-fade-in" style="animation-delay: 0.25s">
        <div class="timeline-marker released"></div>
        <div class="timeline-content">
          <h3>v0.9 Released</h3>
          <ul class="feature-list">
            <li>
              <strong>ASP.NET Core Stability</strong>
              <p>Production hardening for server-hosted nodes with health checks, structured logging, and graceful shutdown.</p>
            </li>
            <li>
              <strong>EF Core Improvements</strong>
              <p>Improved EF Core document store with migration support for relational backends (PostgreSQL, SQL Server).</p>
            </li>
          </ul>
        </div>
      </div>

      <div class="timeline-item animate-fade-in" style="animation-delay: 0.3s">
        <div class="timeline-marker released"></div>
        <div class="timeline-content">
          <h3>v0.8.0 Released</h3>
          <ul class="feature-list">
            <li>
              <strong>Dynamic Reconfiguration</strong>
              <p>Change server roles, listening ports, and database identity without process restarts.</p>
            </li>
            <li>
              <strong>Known Peers &amp; Leader Election</strong>
              <p>Support for persistent static peers and automated Bully Algorithm for cloud gateway election.</p>
            </li>
          </ul>
        </div>
      </div>

      <div class="timeline-item animate-fade-in" style="animation-delay: 0.35s">
        <div class="timeline-marker released"></div>
        <div class="timeline-content">
          <h3>v0.7.0 Released</h3>
          <ul class="feature-list">
            <li>
              <strong>Protocol v4 &amp; Brotli Compression</strong>
              <p>Unified secure transport with native Brotli compression for efficient synchronization.</p>
            </li>
            <li>
              <strong>Unified Versioning</strong>
              <p>All core packages (.NET, Kotlin, Node.js) synchronized to v0.7.0.</p>
            </li>
          </ul>
        </div>
      </div>

      <div class="timeline-item animate-fade-in" style="animation-delay: 0.4s">
        <div class="timeline-marker future"></div>
        <div class="timeline-content">
          <h3>Near-Term Roadmap</h3>
          <ul class="feature-list">
            <li>
              <strong>TLS / Certificate-Based Transport</strong>
              <p>Replace shared-secret HMAC auth with per-node certificates for zero-trust, certificate-pinned LAN deployments.</p>
            </li>
            <li>
              <strong>Merkle Tree Sync Optimization</strong>
              <p>Use Merkle trees as a fast diff mechanism to reduce the amount of op-log exchanged during reconciliation.</p>
            </li>
            <li>
              <strong>Admin Dashboard (EntglStudio)</strong>
              <p>Browser-based UI for monitoring mesh topology, op-log health, peer status, and conflict history.</p>
            </li>
          </ul>
        </div>
      </div>

      <div class="timeline-item animate-fade-in" style="animation-delay: 0.45s">
        <div class="timeline-marker future"></div>
        <div class="timeline-content">
          <h3>Cross-Platform Expansion</h3>
          <ul class="feature-list">
            <li>
              <strong>React Native (in progress)</strong>
              <p>Native module wrapping the Kotlin core for iOS and Android. Exposes the same DocumentStore API surface as the .NET reference implementation.</p>
            </li>
            <li>
              <strong>Browser / WASM</strong>
              <p>WebAssembly port enabling web applications to participate in the mesh via WebSocket relay nodes.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.roadmap-view {
  padding-top: 40px;
  padding-bottom: 100px;
}

.roadmap-header {
  text-align: center;
  margin-bottom: 60px;
}

.lead {
  font-size: 1.2rem;
  color: var(--text-secondary);
}

.timeline {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 20px;
  width: 2px;
  background: var(--border-color);
}

.timeline-item {
  position: relative;
  padding-left: 60px;
  margin-bottom: 50px;
}

.timeline-marker {
  position: absolute;
  left: 11px;
  top: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 4px solid var(--bg-primary);
  background: var(--text-muted);
  z-index: 1;
}

.timeline-marker.future {
  background: var(--accent-secondary);
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.4);
}

.timeline-marker.released {
  background: var(--accent-primary);
  box-shadow: 0 0 15px rgba(139, 92, 246, 0.6);
}

.timeline-content h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: var(--text-primary);
}

.feature-list {
  list-style: none;
  padding: 0;
}

.feature-list li {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  transition: transform 0.2s;
}

.feature-list li:hover {
  transform: translateX(5px);
  border-color: rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
}

.feature-list strong {
  display: block;
  font-size: 1.1rem;
  color: var(--accent-primary);
  margin-bottom: 6px;
}

.feature-list p {
  margin: 0;
  font-size: 0.95rem;
  color: var(--text-secondary);
}

.badge-latest {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--accent-primary);
  color: #fff;
  vertical-align: middle;
  margin-left: 8px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
</style>
