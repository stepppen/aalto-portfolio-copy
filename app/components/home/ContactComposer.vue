<script setup lang="ts">
// Mail-composer-style contact block. "Send" opens the visitor's mail app with everything
// filled in (mailto:), no backend. "From" became "Your name": a mailto link can't set the sender.
// Without JS the form still submits to mailto: with subject and body.
const props = defineProps<{ email: string; heading: string }>()
const name = ref('')
const subject = ref('')
const message = ref('')
const status = ref('')

const href = computed(() => {
  const body = [message.value.trim(), name.value.trim() ? `\n\n${name.value.trim()}` : ''].join('')
  const q = new URLSearchParams()
  if (subject.value.trim()) q.set('subject', subject.value.trim())
  if (body.trim()) q.set('body', body)
  const qs = q.toString().replace(/\+/g, '%20')
  return `mailto:${props.email}${qs ? `?${qs}` : ''}`
})

function send(e: Event) {
  e.preventDefault()
  window.location.href = href.value
  status.value = 'Opening your mail app…'
}

async function copy() {
  try {
    await navigator.clipboard.writeText(props.email)
    status.value = 'Address copied.'
  } catch {
    status.value = "Couldn't copy. Select the address instead."
  }
  setTimeout(() => (status.value = ''), 2500)
}
</script>

<template>
  <section id="contact" class="container section contact" aria-labelledby="contact-title">
    <h2 id="contact-title" class="t-display contact__title reveal">{{ heading }}</h2>
    <form class="composer reveal" :action="`mailto:${email}`" method="get" enctype="text/plain" @submit="send">
      <div class="composer__row">
        <span class="composer__label t-mono muted" aria-hidden="true">To</span>
        <a :href="`mailto:${email}`" class="composer__to">{{ email }}</a>
        <button type="button" class="composer__copy t-mono" @click="copy">Copy<span class="sr-only"> email address</span></button>
      </div>
      <div class="composer__row">
        <label for="c-name" class="composer__label t-mono muted">Your name</label>
        <input id="c-name" v-model="name" name="name" autocomplete="name" class="composer__input">
      </div>
      <div class="composer__row">
        <label for="c-subject" class="composer__label t-mono muted">Subject</label>
        <input id="c-subject" v-model="subject" name="subject" class="composer__input">
      </div>
      <div class="composer__row composer__row--msg">
        <label for="c-message" class="composer__label t-mono muted">Message</label>
        <textarea id="c-message" v-model="message" name="body" rows="5" class="composer__input"></textarea>
      </div>
      <div class="composer__foot">
        <p class="t-mono muted" role="status">{{ status }}</p>
        <button type="submit" class="composer__send">Send</button>
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
