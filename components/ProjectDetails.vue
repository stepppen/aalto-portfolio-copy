<template>
    <div lang="en" class="lg:w-custom-80 overflow-hidden">
      <transition name="fade-img">
        <div v-if="imageDisplayed" class="imageDisplayed">
            <div v-show="showImage" class="aspect-[4/3] flex justify-center align-center overflow-hidden">
                <img :src="project.thumb" alt="project img" class="object-cover min-w-full">
            </div>
        </div>
      </transition>

        <!-- Head -->
        <transition name="fade-img">
            <div v-if="imageDisplayed">
                <h2 class="my-7"> {{ project.title }}</h2>
                <div class="grid gap-16 text-grid">
                    <div class="project-text">
                        <h3 class="heading-4 w-32 pb-4">Overview</h3>
                        <p class="text-justify">{{project.overview}}</p>
                    </div>
                    <div class="flex flex-col w-full gap-4">
                        <div class="flex">
                            <h3 class="heading-4 w-32">Year</h3>
                            <p class="">{{project.year}}</p>
                        </div>
                        <div class="flex">
                            <h3 class="heading-4 w-32">Context</h3>
                            <div class="w-1/2">
                                <p v-for="context in project.projContext" :key="context">{{ context }}</p>
                            </div>
                        </div>
                        <div class="flex">
                            <h3 class="heading-4 w-32">Team</h3>
                            <div>
                                <p v-for="member in project.teamMembers" :key="member">{{ member }}</p>
                            </div>
                        </div>
                        <div class="flex">
                            <h3 class="heading-4 w-32">Role</h3>
                            <div>
                                <p v-for="role in project.roles" :key="role">{{ role }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="h-48"></div>

        
        <!-- Process_01 -->
        <div v-if="project.video" class="aspect-[16/9] flex justify-center align-center overflow-hidden">
            <iframe v-if="project.videoNeuranect" src="https://www.youtube.com/embed/60ArR2pHCS4?si=p6_0hCMpdkbtN7p-" title="YouTube video player" frameborder="0" class="object-cover min-w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            <iframe v-if="project.videoTsunComp" src="https://www.youtube.com/embed/KK_POE7b3FM?si=bdWUbyQ3XOBhkGbr" title="YouTube video player2" frameborder="0" class="object-cover min-w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            <iframe v-if="project.videoZVV" src="https://www.youtube.com/embed/qb8BCE7JLU4?si=vXDeVmZpiaNSij23" title="YouTube video player" frameborder="0" class="object-cover min-w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            <iframe v-if="project.videoDataVis" src="https://www.youtube.com/embed/SpYpkgrMYyM?si=l4NlxlCvQnofn714" title="YouTube video player" frameborder="0" class="object-cover min-w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            <!-- <img v-if="project.img1" :src="project.img1" alt="project img" class="object-cover min-w-full"> -->
        </div>

        <div class="h-48"></div>
        <div v-if="project.process" class="grid text-grid">
            <div class="project-text">
                <h3 class="heading-4 w-32 pb-4">Process</h3>
                <p class="text-justify pb-16">{{project.process}}</p>
            </div>
        </div>
        <div>
            <div>
                <img v-if="project.imgGridOne" :src="project.imgGridOne" alt="project img" loading="lazy" class="object-cover min-w-full py-2 ">
            </div>
            <div class="grid text-grid md:gap-4 lg:gap-0">
                <img v-if="project.imgGridTwo" :src="project.imgGridTwo" alt="project img" loading="lazy" class="object-cover min-w-full  md:pr-2 py-2">
                <img v-if="project.imgGridThree" :src="project.imgGridThree" alt="project img" loading="lazy" class="object-cover min-w-full md:pl-2 py-2">
            </div>
            <div>
                <img v-if="project.imgGridFour" :src="project.imgGridFour" alt="project img" loading="lazy" class="object-cover min-w-full py-2 ">
                <img v-if="project.imgGridExtra" :src="project.imgGridExtra" alt="project img" loading="lazy" class="object-cover min-w-full py-2">
            </div>
        </div>

        <!-- Process_02 -->
        <div v-if="project.process" class="h-48"></div>
        <div v-if="project.processTwo" class="grid text-grid">
            <div></div>
            <div class="project-text">
                <h3 class="heading-4 w-32 pb-4">Design</h3>
                <p class="text-justify pb-16">{{project.processTwo}}</p>
            </div>
        </div>
        <div>
            <div>
                <img v-if="project.imgGridFive" :src="project.imgGridFive" alt="project img" loading="lazy" class="object-cover min-w-full py-2 ">
            </div>
            <div class="grid text-grid md:gap-4 lg:gap-0">
                <img v-if="project.imgGridSix" :src="project.imgGridSix" alt="project img" loading="lazy" class="object-cover min-w-full  md:pr-2 py-2">
                <img v-if="project.imgGridSeven" :src="project.imgGridSeven" alt="project img" loading="lazy" class="object-cover min-w-full  md:pl-2 py-2">
            </div>
            <div>
                <img v-if="project.imgGridEight" :src="project.imgGridEight" alt="project img" loading="lazy" class="object-cover min-w-full py-2">
            </div>
            <div class="grid text-grid md:gap-4 lg:gap-0">
                <img v-if="project.imgGridNine" :src="project.imgGridNine" alt="project img" loading="lazy" class="object-cover min-w-full  md:pr-2 py-2">
                <img v-if="project.imgGridTen" :src="project.imgGridTen" alt="project img" loading="lazy" class="object-cover min-w-full md:pl-2 py-2">
            </div>
        </div>


        <!-- Solution & Learnings-->
        <div v-if="project.solution" class="h-48"></div>
        <div v-if="project.solution" class="grid text-grid">
            <div class="project-text">
                <h3 class="heading-4 w-32 pb-4">Solution</h3>
                <p class="text-justify pb-16">{{project.solution}}</p>
            </div>
        </div>
        <div>
            <img v-if="project.imgFinalOne" :src="project.imgFinalOne" alt="project img" loading="lazy" class="object-cover min-w-full py-2 ">
            <img v-if="project.imgFinalTwo" :src="project.imgFinalTwo" alt="project img" loading="lazy" class="object-cover min-w-full py-2 ">
        </div>
        <div class="grid text-grid md:gap-4 lg:gap-0">
                <img v-if="project.imgFinalThree" :src="project.imgFinalThree" alt="project img" loading="lazy" class="object-cover min-w-full md:pr-2 py-2">
                <img v-if="project.imgFinalFour" :src="project.imgFinalFour" alt="project img" loading="lazy" class="object-cover min-w-full md:pl-2 py-2">
        </div>
        <div>
            <img v-if="project.imgFinalFive" :src="project.imgFinalFive" alt="project img" loading="lazy" class="object-cover min-w-full py-2 ">
            <img v-if="project.imgFinalSix" :src="project.imgFinalSix" alt="project img" loading="lazy" class="object-cover min-w-full py-2 ">
            <img v-if="project.imgFinalSeven" :src="project.imgFinalSeven" alt="project img" loading="lazy" class="object-cover min-w-full py-2 ">
        </div>
        <div class="grid text-grid pt-16">
            <div></div>
            <div v-if="project.learnings" class="project-text">
                <h3 class="heading-4 w-32 pb-4">Learnings</h3>
                <p class="text-justify">{{project.learnings}}</p>
            </div>
        </div>
        <div v-if="project.learnings" class="h-32"></div>



        </div>
        </transition>


    </div>
</template>

<script setup>

const { project } = defineProps(['project']);
const teamMembers = project.team.split('\n').map(member => member.trim());
const roles = project.role.split('\n').map(role => role.trim());
const projContext = project.context.split('\n').map(context => context.trim());

const showImage = ref(false);
let imageDisplayed = ref(false);

project.teamMembers = teamMembers;
project.roles = roles;
project.projContext = projContext;

onMounted(() => {
      setTimeout(() => {
        imageDisplayed.value = true;
        
      }, 200);
    });

// // Watch for changes in the project prop and set showImage to true when a project is clicked
watch(() => project, () => {
  showImage.value = true;
}, { immediate: true }); // Set immediate to true to trigger the watch callback immediately
</script>

<style lang="scss" scoped>
/* Define the fade transition */

@media (min-width: 1024px){
    .text-justify {
    width: 80%;
}
}

@media (min-width: 1920px){
    .text-justify {
    width: 60%;
}
}

.fade-img-enter-active {
      transition: all 0.3s ease-out;
    }
.fade-img-enter-to {
    opacity: 1;
}

.fade-img-enter-from {
    transform: translateY(20px);
    opacity: 0;
}
</style>