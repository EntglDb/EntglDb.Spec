<script setup lang="ts">
const platformFeatures = [
  {
    title: 'Auto-Discovery',
    desc: 'Nodes find each other on the local network via UDP broadcast (Port 25000). Zero configuration — plug in a device, it joins the mesh.',
    icon: '📡'
  },
  {
    title: 'Encrypted Transport',
    desc: 'Every connection is secured with ECDH P-256 key exchange and AES-256-GCM encryption. Ephemeral session keys provide forward secrecy.',
    icon: '🛡️'
  },
  {
    title: 'Self-Healing Mesh',
    desc: 'No central server — every node is equal. The network automatically detects failures, re-routes, and recovers when peers rejoin.',
    icon: '🔗'
  },
  {
    title: 'Platform Services',
    desc: 'Built-in leader election (Bully Algorithm), remote peer management, gossip protocol, and dynamic reconfiguration — building blocks for any distributed service.',
    icon: '⚙️'
  }
]

const syncFeatures = [
  {
    title: 'Offline-First Sync',
    desc: 'Read and write locally without any connection. Changes synchronize automatically via gossip when peers reconnect. AP model — always available.',
    icon: '💾'
  },
  {
    title: 'Smart Conflict Resolution',
    desc: 'Choose Last-Write-Wins for simplicity, or Recursive Merge for field-level resolution with intelligent array merging by ID.',
    icon: '🔀'
  },
  {
    title: 'Cross-Platform',
    desc: '.NET 10 (stable v2.1), Kotlin/Android, Node.js/TypeScript, and React Native. One canonical protocol, four ecosystems.',
    icon: '🌍'
  },
  {
    title: 'DocumentStore + OpLog',
    desc: 'Hash-chained operation log with vector clocks, CDC-based change tracking, ContentHash integrity verification (SHA-256), and point-in-time snapshots.',
    icon: '📋'
  }
]
</script>

<template>
  <div class="features-wrapper">
    <!-- Section 1: The Mesh Infrastructure -->
    <section class="features-section">
      <div class="container">
        <div class="section-header animate-fade-in">
          <span class="section-label">The Foundation</span>
          <h2>Mesh Infrastructure</h2>
          <p class="section-desc">A secure, decentralized network layer that connects devices directly. No cloud, no single point of failure. Every node is equal.</p>
        </div>
        <div class="grid">
          <div v-for="(feat, index) in platformFeatures" :key="'p-'+index" class="feature-card glass-panel animate-fade-in" :style="{ animationDelay: (0.2 + index * 0.1) + 's' }">
            <div class="icon">{{ feat.icon }}</div>
            <h3>{{ feat.title }}</h3>
            <p>{{ feat.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 2: EntglDb Sync — The Flagship Service -->
    <section class="features-section service-section">
      <div class="container">
        <div class="section-header animate-fade-in">
          <span class="section-label">Built on the Mesh</span>
          <h2>EntglDb Sync</h2>
          <p class="section-desc">Real-time database synchronization — the first and most mature service running on the Entgl mesh. Production-ready at v2.1.</p>
        </div>
        <div class="grid">
          <div v-for="(feat, index) in syncFeatures" :key="'s-'+index" class="feature-card glass-panel animate-fade-in" :style="{ animationDelay: (0.2 + index * 0.1) + 's' }">
            <div class="icon">{{ feat.icon }}</div>
            <h3>{{ feat.title }}</h3>
            <p>{{ feat.desc }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.features-wrapper {
  position: relative;
  z-index: 10;
}

.features-section {
  padding: 100px 0 60px;
}

.service-section {
  padding-top: 40px;
  padding-bottom: 100px;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-label {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--accent-secondary);
  margin-bottom: 12px;
}

.service-section .section-label {
  color: var(--accent-primary);
}

.section-header h2 {
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  margin-bottom: 16px;
  color: var(--text-primary);
}

.section-desc {
  font-size: 1.1rem;
  color: var(--text-secondary);
  max-width: 640px;
  margin: 0 auto;
  line-height: 1.6;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 28px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 32px;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.feature-card:hover {
  background: rgba(255, 255, 255, 0.06);
  transform: translateY(-5px);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.icon {
  font-size: 2.5rem;
  margin-bottom: 24px;
}

h3 {
  font-size: 1.25rem;
  margin-bottom: 12px;
  font-weight: 600;
  color: var(--text-primary);
}

p {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
}
</style>
