<script setup lang="ts">
const features = [
  {
    title: 'Mesh Networking',
    desc: 'Nodes automatically discover each other via UDP (Port 25000) and form a resilient mesh network without central servers.',
    icon: '🔗'
  },
  {
    title: 'Offline-First',
    desc: 'Read and write data locally. Changes adhere to the CAP theorem (AP) and synchronize automatically when connectivity is restored.',
    icon: '💾'
  },
  {
    title: 'End-to-End Security',
    desc: 'All peer-to-peer traffic is secured with ECDH Key Exchange and AES-256-GCM encryption. Zero-trust architecture.',
    icon: '🛡️'
  },
  {
    title: 'Recursive Merge',
    desc: 'Advanced conflict resolution. JSON objects are merged field-by-field, preserving non-conflicting changes from multiple devices.',
    icon: '🔀'
  },
  {
    title: 'Cross-Platform',
    desc: 'Implementations available for .NET 8, Android (Kotlin), and Node.js. Single protocol, multiple ecosystems.',
    icon: '🌍'
  },
  {
    title: 'Document Oriented',
    desc: 'Store data as flexible JSON documents. No rigid schemas required, perfect for rapid application development.',
    icon: '📄'
  }
]
</script>

<template>
  <section class="features-section">
    <div class="container">
      <div class="grid">
        <div v-for="(feat, index) in features" :key="index" class="feature-card glass-panel animate-fade-in" :style="{ animationDelay: (0.2 + index * 0.1) + 's' }">
          <div class="icon">{{ feat.icon }}</div>
          <h3>{{ feat.title }}</h3>
          <p>{{ feat.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.features-section {
  padding: 100px 0;
  position: relative;
  z-index: 10;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
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
