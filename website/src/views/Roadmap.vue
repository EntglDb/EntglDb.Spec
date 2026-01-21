<template>
  <div class="roadmap-view container">
    <div class="roadmap-header">
      <h1>Roadmap</h1>
      <p class="lead">Future development plans for the EntglDb ecosystem.</p>
    </div>

    <div class="timeline">
      <div class="timeline-item animate-fade-in" style="animation-delay: 0.1s">
        <div class="timeline-marker released"></div>
        <div class="timeline-content">
          <h3>v0.8.0 Released</h3>
          <ul class="feature-list">
             <li>
              <strong>Dynamic Reconfiguration</strong>
              <p>Change server roles, listening ports, and database identity without process restarts.</p>
            </li>
            <li>
              <strong>Known Peers & Leader Election</strong>
              <p>Support for persistent static peers and automated Bully Algorithm for cloud gateway election.</p>
            </li>
          </ul>
        </div>
      </div>

      <div class="timeline-item animate-fade-in" style="animation-delay: 0.2s">
        <div class="timeline-marker released"></div>
        <div class="timeline-content">
          <h3>v0.7.0 Released</h3>
          <ul class="feature-list">
             <li>
              <strong>Protocol v4 & Brotli Compression</strong>
              <p>Unified secure transport with native Brotli compression for efficient synchronization.</p>
            </li>
            <li>
              <strong>Unified Versioning</strong>
              <p>All core packages (.NET, Kotlin, Node.js) synchronized to v0.7.0.</p>
            </li>
          </ul>
        </div>
      </div>

      <div class="timeline-item animate-fade-in" style="animation-delay: 0.2s">
        <div class="timeline-marker future"></div>
        <div class="timeline-content">
          <h3>Cross-Platform Expansion</h3>
          <ul class="feature-list">
            <li>
              <strong>Mobile & Web Frameworks</strong>
              <p>Official support and bindings for React Native, Cordova, Ionic, and Flutter.</p>
            </li>
          </ul>
        </div>
      </div>

      <div class="timeline-item animate-fade-in" style="animation-delay: 0.3s">
        <div class="timeline-marker future"></div>
        <div class="timeline-content">
          <h3>Storage Engines</h3>
          <ul class="feature-list">
            <li>
              <strong>Couchbase Community</strong>
              <p>Alternative storage backend replacing SQLite for high-performance scenarios.</p>
            </li>
            <li>
              <strong>LiteDB (.NET Only)</strong>
              <p>Support for LiteDB as a pure C# embedded storage alternative.</p>
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
</style>
