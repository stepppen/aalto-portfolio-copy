<template>
    <!-- <div class="w-1/4"></div> -->
    <div class="">
        <transition name="slide-fade">
        <header class="dynamic-header">
            <nav class="dynamic-nav">
                <nuxt-link to="/" class="flex lg:hover:px-1 slow-transition">
                    <p class="pr-2">Stepan</p>
                    <p>Vedunov</p>
                </nuxt-link>
                <ul class="flex lg:flex-col gap-2">
                    <li>
                        <nuxt-link to="/about" class="flex">
                            <p class="lg:hover:px-1 slow-transition">About</p>
                            <img class="px-2" src="../assets/icons/arrow.svg" alt="arrow-icon">
                        </nuxt-link>
                    </li>
                    <li>
                        <nuxt-link to="/projects" class="flex">
                            <p class="lg:hover:px-1 slow-transition">Archive</p>
                            <img class="px-2" src="../assets/icons/arrow.svg" alt="arrow-icon">
                        </nuxt-link>
                    </li>
                </ul>
                <p class="lg:block hidden">©2024</p>
            </nav>
        </header>
    </transition>

        <div class="flex justify-between justify-items-end p-4">
            <div class="lg:w-1/4"></div>
            <slot />
        </div>
    </div>
</template>

<style>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-to,
.slide-fade-leave-from{
    opacity: 1;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
    /* .router-link-exact-active {
        color:rgb(122, 217, 26);
    } */
</style>
