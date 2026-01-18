<script setup lang="ts">
import Hero from '../components/Hero.vue'
import FeatureGrid from '../components/FeatureGrid.vue'
</script>

<template>
  <div class="home-view">
    <Hero />
    <FeatureGrid />
    
    <section class="container" style="padding: 100px 0; text-align: center; border-top: 1px solid rgba(255,255,255,0.05);">
      <h2 class="text-gradient" style="font-size: 2.5rem; margin-bottom: 20px;">
        Ready to Entangle?
      </h2>
      <p style="color: var(--text-secondary); max-width: 600px; margin: 0 auto 40px;">
        Start building local-first applications today with EntglDb.
      </p>
      <router-link to="/docs" class="btn btn-primary" style="display: inline-block;">
        Read the Specs
      </router-link>
    </section>
  </div>
</template>
