<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goDocs = () => router.push('/docs');
const goGithub = () => window.open('https://github.com/EntglDb', '_blank');
</script>

<template>
  <section class="hero">
    <div class="hero-bg">
      <div class="glow-orb orb-1"></div>
      <div class="glow-orb orb-2"></div>
      <!-- SVG Network Pattern could go here -->
    </div>
    
    <div class="container hero-content">
      <div class="badge animate-fade-in" style="animation-delay: 0.1s">
        <span class="badge-dot"></span> v0.7.0 Released
      </div>
      
      <h1 class="hero-title animate-fade-in" style="animation-delay: 0.2s">
        The <span class="brand-gradient">Mesh Database</span><br/>
        for Local-First Apps
      </h1>
      
      <p class="hero-subtitle animate-fade-in" style="animation-delay: 0.3s">
        Synchronize data directly between devices without a cloud server.
        Built for resilience, speed, and privacy.
      </p>
      
      <div class="hero-actions animate-fade-in" style="animation-delay: 0.4s">
        <button class="btn btn-primary" @click="goDocs">Get Started</button>
        <button class="btn btn-secondary" @click="goGithub">View on GitHub</button>
      </div>

      <div class="hero-stats animate-fade-in" style="animation-delay: 0.6s">
        <div class="stat">
          <div class="stat-value">P2P</div>
          <div class="stat-label">Networking</div>
        </div>
        <div class="stat-sep"></div>
        <div class="stat">
          <div class="stat-value">UDP</div>
          <div class="stat-label">Discovery</div>
        </div>
        <div class="stat-sep"></div>
        <div class="stat">
          <div class="stat-value">AES</div>
          <div class="stat-label">Encryption</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 60px; /* Header offset */
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  background: radial-gradient(circle at 50% 50%, #1a1a20 0%, var(--bg-primary) 70%);
}

.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: var(--accent-primary);
  top: -100px;
  right: -50px;
  animation: float 20s infinite ease-in-out;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: var(--accent-secondary);
  bottom: 0px;
  left: -50px;
  animation: float 25s infinite ease-in-out reverse;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(30px, 50px); }
}

.hero-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 100px;
  font-size: 0.85rem;
  color: var(--accent-secondary);
  margin-bottom: 24px;
}

.badge-dot {
  width: 6px;
  height: 6px;
  background-color: var(--accent-secondary);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--accent-secondary);
}

.hero-title {
  font-size: 4rem;
  line-height: 1.1;
  font-weight: 800;
  margin-bottom: 24px;
  letter-spacing: -1px;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin-bottom: 40px;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 60px;
}

.btn {
  height: 48px;
  padding: 0 32px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
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

.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover {
  border-color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 40px;
  padding-top: 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  font-family: var(--font-mono);
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.85rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-sep {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
}
</style>
