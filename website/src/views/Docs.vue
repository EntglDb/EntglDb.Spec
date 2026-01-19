<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const versions = ['v0.7.0']
const currentVersion = computed(() => {
  return (route.params.version as string) || 'v0.7.0'
})

const menu = [
  { label: 'Getting Started', path: 'getting-started' },
  { label: 'Architecture', path: 'architecture' },
  { label: 'Security', path: 'security' },
  { label: 'Conflict Resolution', path: 'conflict-resolution' },
  { label: 'Android Robustness', path: 'android-robustness' },
  { label: 'Discovery & Transport', path: 'discovery' },
  { label: 'Wire Protocol', path: 'protocol' },
  { label: 'Data Model & JSON', path: 'data-model' },
  { label: 'Querying', path: 'querying' },
  { label: 'Synchronization', path: 'synchronization' }
]

function onVersionChange(event: Event) {
  const newVersion = (event.target as HTMLSelectElement).value
  // Keep the current page if possible, else default to discovery
  const page = route.path.split('/').pop() || 'discovery'
  router.push(`/docs/${newVersion}/${page}`)
}
</script>

<template>
  <div class="docs-layout container">
    <aside class="docs-sidebar">
      <div class="version-selector">
        <label>Version</label>
        <select :value="currentVersion" @change="onVersionChange">
          <option v-for="v in versions" :key="v" :value="v">{{ v }}</option>
        </select>
      </div>

      <h3>Specifications</h3>
      <ul>
        <li v-for="item in menu" :key="item.path">
          <RouterLink 
            :to="`/docs/${currentVersion}/${item.path}`" 
            class="doc-link"
          >
            {{ item.label }}
          </RouterLink>
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

.version-selector {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.version-selector label {
  display: block;
  font-size: 0.8rem;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
  letter-spacing: 0.5px;
}

.version-selector select {
  width: 100%;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
}

.version-selector select:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--text-secondary);
}

.version-selector select:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
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
