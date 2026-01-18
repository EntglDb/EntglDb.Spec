<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

const menu = [
  { label: 'Discovery & Transport', path: '/docs/discovery' },
  { label: 'Wire Protocol', path: '/docs/protocol' },
  { label: 'Data Model & JSON', path: '/docs/data-model' },
  { label: 'Synchronization', path: '/docs/synchronization' }
]
</script>

<template>
  <div class="docs-layout container">
    <aside class="docs-sidebar">
      <h3>Specifications</h3>
      <ul>
        <li v-for="item in menu" :key="item.path">
          <RouterLink :to="item.path" class="doc-link">{{ item.label }}</RouterLink>
        </li>
      </ul>
    </aside>
    
    <div class="docs-content">
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </div>
  </div>
</template>

<style scoped>
.docs-layout {
  display: flex;
  min-height: calc(100vh - var(--header-height));
  position: relative;
}

.docs-sidebar {
  width: 250px;
  padding: 40px 20px 40px 0;
  border-right: 1px solid var(--border-color);
  position: sticky;
  top: var(--header-height);
  height: calc(100vh - var(--header-height));
  overflow-y: auto;
}

.docs-sidebar h3 {
  font-size: 0.85rem;
  text-transform: uppercase;
  color: var(--text-muted);
  letter-spacing: 1px;
  margin-bottom: 24px;
}

.docs-sidebar ul {
  list-style: none;
}

.docs-sidebar li {
  margin-bottom: 8px;
}

.doc-link {
  display: block;
  padding: 8px 12px;
  border-radius: 6px;
  color: var(--text-secondary);
  font-size: 0.95rem;
  transition: all 0.2s;
}

.doc-link:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.doc-link.router-link-active {
  background: rgba(139, 92, 246, 0.1); /* Accent glow */
  color: var(--accent-primary);
  font-weight: 500;
}

.docs-content {
  flex: 1;
  padding: 40px 0 40px 60px;
  max-width: 800px;
}

@media (max-width: 768px) {
  .docs-layout {
    flex-direction: column;
  }
  .docs-sidebar {
    width: 100%;
    height: auto;
    position: relative;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
    padding: 20px 0;
  }
  .docs-content {
    padding: 20px 0;
  }
}
</style>
