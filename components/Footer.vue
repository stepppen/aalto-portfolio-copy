<template>
  <footer class="footer-container">
    <div class="divider">

    </div>
    <div class="footer-content">
      <div class="contact-links">
        <a href="mailto:stepan.vedunov@outlook.com" class="contact-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          stepan.vedunov@outlook.com
        </a>
        <a href="https://www.linkedin.com/in/stepan-v-0242b2226/" target="_blank" class="contact-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
          LinkedIn
        </a>
        <a href="https://github.com/stepppen" target="_blank" class="contact-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub
        </a>
      </div>
      <p class="copyright">© 2025 – Designed and developed by me</p>
    </div>
  </footer>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.footer-container {
  width: 100%;
  margin-top: 4rem;
  padding: 2rem 2rem;
}

.divider{
    height: 1px;
    width: 100%;
    margin-bottom: 2rem ;
    background-color: rgba(255, 255, 255, 0.1);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.contact-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.contact-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(4px);
  border-radius: 2rem;
  padding: 0 1.25rem;
  font-size: 1rem;
  font-family: var(--font-body);
  font-weight: 300;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
  text-decoration: none;
  color: white;
  cursor: pointer;
}

.contact-link:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.contact-link:active {
  transform: translateY(0);
}

.copyright {
  font-size: 0.875rem;
  opacity: 0.5;
  margin: 0;
  font-family: var(--font-body);
  font-weight: 300;
}

@media (max-width: 640px) {
  .footer-container {
    padding: 2rem 1rem;
  }
  
  .contact-links {
    gap: 0.75rem;
  }
  
  .contact-link {
    font-size: 0.9rem;
    padding: 0 1rem;
    height: 40px;
  }
  
  .copyright {
    font-size: 0.8rem;
    text-align: center;
  }
}
</style>