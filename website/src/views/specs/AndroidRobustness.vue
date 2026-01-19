<template>
  <div class="spec-content">
    <h1>Android Robustness</h1>
    <p class="lead">Specific guidelines for deploying EntglDb on Android devices.</p>

    <div class="alert-box">
        <strong>Kotlin / Android Only</strong>
        <p>This guide is applies only to the <code>entgldb-kotlin</code> implementation running on Android.</p>
    </div>

    <!-- Foreground Service -->
    <section>
        <h2>Foreground Service</h2>
        <p>To prevent Android from killing the sync process, you must run EntglDb in a Foreground Service.</p>
        
        <h3>Manifest Declaration</h3>
        <pre><code class="language-xml">&lt;service android:name="com.entgldb.network.service.EntglDbService"
         android:foregroundServiceType="dataSync"
         android:exported="false" /></code></pre>
    </section>

    <!-- Network Awareness -->
    <section>
        <h2>Network Awareness</h2>
        <p>The library monitors connectivity changes:</p>
        <ul>
            <li><strong>Auto-Pause:</strong> UDP Discovery stops when WiFi is disconnected.</li>
            <li><strong>Auto-Resume:</strong> Discovery and Sync restart automatically when connectivity returns.</li>
        </ul>
    </section>

  </div>
</template>

<style scoped>
.spec-content {
  line-height: 1.6;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
   background: linear-gradient(45deg, var(--accent-primary), var(--accent-secondary));
  -webkit-background-clip: text;
  background-clip: text;
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

.alert-box strong {
  color: var(--accent-primary);
  display: block;
  margin-bottom: 4px;
}

pre {
    background: #1e1e1e;
    padding: 10px;
    border-radius: 6px;
    font-size: 0.9rem;
    overflow-x: auto;
}
</style>
