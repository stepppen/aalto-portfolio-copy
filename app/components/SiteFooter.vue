<script setup lang="ts">
const { data } = await useSite()
const open = useSetupPanel()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer container">
    <hr class="hairline">
    <div class="footer__row">
      <p class="t-mono muted">© {{ year }} · all content loaded</p>

      <ul class="footer__icons" role="list" aria-label="Elsewhere">
        <li>
          <a :href="`mailto:${data?.site.email}`" aria-label="Email">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 6 8.5 7 8.5-7" /></svg>
          </a>
        </li>
        <li>
          <a :href="data?.site.linkedin" aria-label="LinkedIn" rel="me">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.5h.06c.53-1 1.83-1.75 3.44-1.75 3.7 0 4.2 2.3 4.2 5.4v5.85h-4v-5.2c0-1.25 0-2.85-1.75-2.85s-2 1.35-2 2.75v5.3h-4v-11Z" /></svg>
          </a>
        </li>
        <li>
          <a :href="data?.site.github" aria-label="GitHub" rel="me">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" /></svg>
          </a>
        </li>
      </ul>

      <ul class="footer__links t-mono" role="list">
        <li><a :href="data?.site.cv" class="link-quiet" download="Stepan_Vedunov_CV.pdf">cv.pdf</a></li>
        <li><button type="button" class="footer__setup link-quiet" aria-haspopup="dialog" @click="open = true">setup</button></li>
      </ul>
    </div>
  </footer>
</template>

<style scoped>
.footer { margin-top: var(--space-section); padding-bottom: var(--space-8); }

.footer__row {
  display: grid;
  grid-template-columns: 1fr;
  justify-items: start;
  gap: var(--space-2);
  padding-top: var(--space-4);
}

.footer__icons, .footer__links { display: flex; padding: 0; list-style: none; }

.footer__icons { gap: var(--space-1); margin-left: calc(-1 * var(--space-3)); }

.footer__icons a {
  display: grid;
  place-items: center;
  width: var(--layout-tap);
  height: var(--layout-tap);
  color: var(--ink-muted);
  border-radius: var(--radius-control);
}

.footer__icons a:hover { color: var(--ink); }

.footer__links { gap: var(--space-4); }

.footer__links a, .footer__setup {
  display: inline-flex;
  align-items: center;
  min-height: var(--layout-tap);
}

.footer__setup { padding: 0; border: 0; background: none; font: inherit; }

@media (width >= 48rem) {
  .footer__row { grid-template-columns: 1fr auto 1fr; align-items: center; }

  .footer__icons { margin-left: 0; justify-self: center; }

  .footer__links { justify-self: end; }
}
</style>
