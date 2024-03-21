<template>
    <div class="flex z-10">
        <header class="lg:w-2/3 lg:fixed">
            <nav class=" h-screen relative p-4 flex flex-col justify-between">
                <nuxt-link to="/" class="flex hover:px-1 slow-transition">
                    <p class="pr-2">Stepan</p>
                    <p>Vedunov</p>
                </nuxt-link>
                <ul class="flex flex-col gap-2">
                    <li>
                        <nuxt-link to="/about" class="flex">
                            <p class="hover:px-1 slow-transition">About</p>
                            <img class="px-2" src="../assets/icons/arrow.svg" alt="arrow-icon">
                        </nuxt-link>
                    </li>
                    <li>
                        <nuxt-link to="/projects" class="flex">
                            <p class="hover:px-1 slow-transition">Archive</p>
                            <img class="px-2" src="../assets/icons/arrow.svg" alt="arrow-icon">
                        </nuxt-link>
                    </li>
                </ul>
                <p>©2024</p>
            </nav>
        </header>

        <div class="flex justify-between">
            <div class="w-1/2"></div>
            <slot />
        </div>
    </div>
</template>

<script>
let hover = ref(false);

</script>

<style>
p {
    font-family: Barlow, sans-serif;
    font-size: 18px;
    font-weight: 300;
}

.slow-transition{
    transition: 0.1s ease-in-out;
}
    /* .router-link-exact-active {
        color:rgb(122, 217, 26);
    } */
</style>