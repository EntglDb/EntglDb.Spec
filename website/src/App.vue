<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app-layout">
    <!-- Header will replace this placeholder -->
    <header class="main-header glass-panel">
      <div class="container header-content">
        <div class="logo">EntglDb<span class="dot">.</span></div>
        <nav>
          <router-link to="/">Home</router-link>
          <router-link to="/docs">Docs</router-link>
          <router-link to="/roadmap">Roadmap</router-link>
        </nav>
      </div>
    </header>

    <main>
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>

    <footer class="main-footer">
      <div class="container">
        <p>© 2026 EntglDb Project. Open Source (MIT).</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-header {
  position: fixed;
  top: 0;
  width: 100%;
  height: var(--header-height);
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  background: rgba(5, 5, 7, 0.7);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.logo {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 1.25rem;
  letter-spacing: -0.5px;
}

.logo .dot {
  color: var(--accent-primary);
}

nav {
  display: flex;
  gap: 32px;
}

nav a {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-secondary);
}

nav a:hover, nav a.router-link-active {
  color: var(--text-primary);
}

main {
  padding-top: var(--header-height);
  flex: 1;
}

.main-footer {
  border-top: 1px solid var(--border-color);
  padding: 40px 0;
  margin-top: 80px;
  color: var(--text-muted);
  font-size: 0.9rem;
  text-align: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
