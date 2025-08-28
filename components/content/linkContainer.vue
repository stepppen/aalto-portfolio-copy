<template>
  <div class="info-tag" data-aos="fade-up">
    <p v-if="title" class="title">{{ title }}</p>
    <div class="flex flex-col align-items-start p-0">
        <a :href="link1Src || '/'" class="w-full">
      <div v-if="link1" class="flex w-full p-0">
        <p>
            {{ link1 }}
        </p>
        <MdiIcon icon="mdiArrowTopRight" size="24px"/>
      </div>
      </a>
      <a :href="link2Src || '/'" class="w-full">
      <div v-if="link2" class="flex w-full p-0">
        <p>
            {{ link2 }}
        </p>
        <MdiIcon icon="mdiArrowTopRight" size="24px"/>
      </div>
      </a>
      <a :href="link3Src || '/'" class="w-full">
      <div v-if="link3" class="flex w-full p-0">
        <p >
            {{ link3 }}

        </p>
        <MdiIcon icon="mdiArrowTopRight" size="24px"/>
      </div>
      </a>
      <a :href="link4Src || '/'" class="w-full">
      <div v-if="link4" class="flex p-0">
        <p >
            {{ link4 }}
        </p>
        <MdiIcon icon="mdiArrowTopRight" size="24px"/>
      </div>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  link1?: string
  link1Src?: string
  link2?: string
  link2Src?: string
  link3?: string
  link3Src?: string
  link4?: string
  link4Src?: string
}

defineProps<Props>()
</script>

<style scoped>
.info-tag{
    display: inline-flex;
    gap: 2px;
    margin: 12px 0;
    max-width: 100%;
    height: auto;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(4px);
    border-radius: 1.5rem;
    padding: 1rem 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.08);
    cursor: default;
}

.info-tag .title {
  display: inline-block;
  width: auto;
  margin-right: 0.5rem;
  opacity: 0.5;
  white-space: nowrap;
}

.flex {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.flex a {
  text-decoration: none;
  color: inherit;
}

.flex a:hover {
  opacity: 0.5;
}

@media (max-width: 768px) {
    .info-tag{
        flex-direction: column;
        max-width: 100%;
    }
}
</style>