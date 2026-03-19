<script setup lang="ts">
import Hero from '../components/Hero.vue'
import FeatureGrid from '../components/FeatureGrid.vue'
</script>

<template>
  <div class="home-view">
    <Hero />
    <FeatureGrid />
    
    <section class="container cta-section">
      <h2 class="text-gradient cta-title">
        Ready to Entangle?
      </h2>
      <p class="cta-body">
        Database sync is just the beginning. Build on the mesh.
      </p>
      <div class="cta-actions">
        <router-link to="/docs" class="btn btn-primary">
          Read the Docs
        </router-link>
        <router-link to="/roadmap" class="btn btn-outline">
          See What's Next
        </router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.cta-section {
  padding: 100px 0;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.cta-title {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.cta-body {
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto 40px;
  font-size: 1.15rem;
}

.cta-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  height: 48px;
  padding: 0 32px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-primary {
  background: var(--text-primary);
  color: var(--bg-primary);
  border: none;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.2);
}

.btn-outline {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-outline:hover {
  border-color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
}
</style>
