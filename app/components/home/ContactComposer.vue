<script setup lang="ts">
// Mail-composer-style contact form. It sends through Netlify Forms (the site is static on
// Netlify): Netlify finds the form in the prerendered HTML, stores each message and emails it
// on. With JS the form posts in place and shows a status; without JS it posts normally.
// If sending fails, the status points to the address instead.
const props = defineProps<{ email: string; heading: string }>()
const { t } = useLang()
const FORM = 'contact'
const name = ref('')
const from = ref('')
const subject = ref('')
const message = ref('')
const state = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')
const status = ref('')

async function send(e: Event) {
  e.preventDefault()
  const form = e.target as HTMLFormElement
  if (state.value === 'sending') return
  state.value = 'sending'
  status.value = t('contact.sending')
  try {
    const body = new URLSearchParams(new FormData(form) as unknown as Record<string, string>).toString()
    const res = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body })
    if (!res.ok) throw new Error(String(res.status))
    state.value = 'sent'
    status.value = t('contact.sent')
    name.value = from.value = subject.value = message.value = ''
  } catch {
    state.value = 'error'
    status.value = t('contact.failed')
  }
}

async function copy() {
  try {
    await navigator.clipboard.writeText(props.email)
    status.value = t('contact.copied')
  } catch {
    status.value = t('contact.copyFail')
  }
  setTimeout(() => { if (state.value !== 'error') status.value = '' }, 2500)
}
</script>

<template>
  <section id="contact" class="container section contact" aria-labelledby="contact-title">
    <h2 id="contact-title" class="t-display contact__title reveal">{{ heading }}</h2>
    <form :name="FORM" class="composer reveal" method="post" action="/" data-netlify="true" netlify-honeypot="company" @submit="send">
      <input type="hidden" name="form-name" :value="FORM">
      <p class="sr-only"><label>{{ t('contact.honeypot') }} <input name="company" tabindex="-1" autocomplete="off"></label></p>
      <div class="composer__row">
        <span class="composer__label t-mono muted" aria-hidden="true">{{ t('contact.to') }}</span>
        <a :href="`mailto:${email}`" class="composer__to">{{ email }}</a>
        <button type="button" class="composer__copy t-mono" @click="copy">{{ t('contact.copy') }}<span class="sr-only">{{ t('contact.copyLabel') }}</span></button>
      </div>
      <div class="composer__row">
        <label for="c-name" class="composer__label t-mono muted">{{ t('contact.name') }}</label>
        <input id="c-name" v-model="name" name="name" autocomplete="name" class="composer__input">
      </div>
      <div class="composer__row">
        <label for="c-from" class="composer__label t-mono muted">{{ t('contact.from') }}</label>
        <input id="c-from" v-model="from" name="email" type="email" autocomplete="email" required class="composer__input">
      </div>
      <div class="composer__row">
        <label for="c-subject" class="composer__label t-mono muted">{{ t('contact.subject') }}</label>
        <input id="c-subject" v-model="subject" name="subject" class="composer__input">
      </div>
      <div class="composer__row composer__row--msg">
        <label for="c-message" class="composer__label t-mono muted">{{ t('contact.message') }}</label>
        <textarea id="c-message" v-model="message" name="message" rows="5" required class="composer__input"></textarea>
      </div>
      <div class="composer__foot">
        <p class="t-mono muted" role="status">{{ status }}<a v-if="state === 'error'" :href="`mailto:${email}`"> {{ email }}</a></p>
        <button type="submit" class="composer__send" :disabled="state === 'sending'">{{ t('contact.send') }}</button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.contact { display: grid; justify-items: center; gap: var(--space-12); text-align: center; }

.contact__title { font-size: var(--text-statement); letter-spacing: var(--tracking-heading); max-width: 18ch; }

.composer {
  width: min(100%, 40rem);
  text-align: left;
  border: 1px solid var(--line);
  border-radius: var(--radius-card);
  background: var(--bg);
}

.composer__row {
  display: grid;
  grid-template-columns: 6rem 1fr auto;
  align-items: center;
  gap: var(--space-3);
  min-height: 3.25rem;
  padding: 0 var(--space-4);
  border-bottom: 1px solid var(--line);
}

.composer__row--msg { align-items: start; padding-top: var(--space-3); }

.composer__label { white-space: nowrap; }

.composer__to { overflow-wrap: anywhere; text-decoration: none; }

.composer__input {
  grid-column: 2 / -1;
  width: 100%;
  min-height: var(--layout-tap);
  border: 0;
  background: transparent;
  padding: 0;
}

textarea.composer__input { resize: vertical; padding-block: var(--space-1); min-height: 7rem; }

.composer__input:focus-visible { outline-offset: 2px; }

.composer__copy {
  min-height: 2rem;
  padding: 0 var(--space-3);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-pill);
  background: var(--bg);
}

.composer__copy:hover { background: var(--panel); }

.composer__foot { display: flex; justify-content: space-between; align-items: center; gap: var(--space-4); padding: var(--space-3) var(--space-4); }

.composer__send {
  min-height: var(--layout-tap);
  padding: 0 var(--space-6);
  border: 0;
  border-radius: var(--radius-pill);
  background: var(--ink);
  color: var(--bg);
 
}

.composer__send:hover { opacity: 0.88; }

@media (width >= 64rem) {
  .contact__title { font-size: var(--text-display); max-width: 20ch; }
}

@media (width < 30rem) {
  .composer__row { grid-template-columns: 1fr auto; padding-block: var(--space-2); }

  .composer__label { grid-column: 1 / -1; }

  .composer__input { grid-column: 1 / -1; }
}
</style>
