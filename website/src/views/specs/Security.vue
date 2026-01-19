<template>
  <div class="spec-content">
    <h1>Security</h1>
    <p class="lead">EntglDb provides optional end-to-end encryption for peer communication.</p>

    <div class="alert-box warning">
        <strong>Trust Model</strong>
        <p>EntglDb assumes a <strong>Shared Secret</strong> trust model. All nodes in a cluster must share the same <code>auth_token</code> (or PSK). Once authenticated, a node is fully trusted.</p>
    </div>

    <!-- Specs -->
    <section>
        <h2>Cryptographic Primitives</h2>
        <ul>
            <li><strong>Key Exchange:</strong> ECDH (NIST P-256)</li>
            <li><strong>Encryption:</strong> AES-256-GCM (Kotlin/Node) or AES-256-CBC (Net legacy compatibility)</li>
            <li><strong>Forward Secrecy:</strong> Ephemeral keys generated per session.</li>
        </ul>
        <p>See <router-link to="protocol">Wire Protocol</router-link> for handshake details.</p>
    </section>

    <!-- Configuration -->
    <section>
        <h2>Configuration</h2>
        <div class="tabs">
            <div class="tab-header">
                <button :class="{ active: activeTab === 'net' }" @click="activeTab = 'net'">.NET</button>
                <button :class="{ active: activeTab === 'kotlin' }" @click="activeTab = 'kotlin'">Kotlin</button>
                <button :class="{ active: activeTab === 'node' }" @click="activeTab = 'node'">Node.js</button>
            </div>

            <div class="tab-content" v-if="activeTab === 'net'">
                <p>Register the <code>SecureHandshakeService</code>.</p>
                <pre><code class="language-csharp">services.AddSingleton&lt;IPeerHandshakeService, SecureHandshakeService>();
services.AddEntglDbNetwork("node-1", 5001, "my-secret-key");</code></pre>
            </div>

            <div class="tab-content" v-if="activeTab === 'kotlin'">
                <p>Pass the service to client/server components.</p>
                 <pre><code class="language-kotlin">val handshake = SecureHandshakeService("my-secret-key")
val server = TcpSyncServer(nodeId, 0, handshake)
val client = TcpPeerClient(handshake)</code></pre>
            </div>

            <div class="tab-content" v-if="activeTab === 'node'">
                <p>Encryption/Decryption is handled automatically if enabled in options (Future API).</p>
                <div class="alert-box">
                    <strong>Note:</strong> Node.js implementation is currently aligning with the v0.7.0 secure spec.
                </div>
            </div>
        </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const activeTab = ref('net')
</script>

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
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.alert-box {
  background: rgba(139, 92, 246, 0.1);
  border-left: 3px solid var(--accent-primary);
  padding: 16px;
  border-radius: 4px;
  margin: 20px 0;
}

.alert-box.warning {
    border-left-color: #f59e0b;
    background: rgba(245, 158, 11, 0.1);
}

.alert-box strong {
  display: block;
  margin-bottom: 4px;
  font-weight: 600;
}

.tabs {
  margin: 2rem 0;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}

.tab-header {
  display: flex;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid var(--border-color);
}

.tab-header button {
  padding: 1rem 2rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.tab-header button:hover {
  color: var(--text-primary);
}

.tab-header button.active {
  color: var(--accent-primary);
  border-bottom: 2px solid var(--accent-primary);
}

.tab-content {
  padding: 2rem;
  background: rgba(0, 0, 0, 0.2);
}

pre {
  background: #1e1e1e;
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
  margin-top: 1rem;
}

code {
  font-family: 'Fira Code', monospace;
  font-size: 0.9rem;
}
</style>
