<template>
    <!-- <div class="w-1/4"></div> -->
    <div class="">
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

        <div class="flex justify-between justify-items-end p-4">
            <div class="lg:w-1/4 z-50"></div>
            <slot />
        </div>
    </div>
</template>

<style>
    /* .router-link-exact-active {
        color:rgb(122, 217, 26);
    } */
</style>
