<template>
    <div class="toggle-container">
        <div class="tab-toggle" :class="{'projects-mode': currentPath === 'projects'}">
            <div class="nav-button" 
            @click="navigateTo('/')" 
            :class="{active: currentPath === 'home'
            }">
                Home
            </div>
             <div 
             class="nav-button projects-button" 
             :class="{active: currentPath === 'projects', 
             visible : currentPath === 'projects'
             }">
                Projects
            </div>
             <div 
             class="nav-button" 
             @click="navigateTo('/about')" 
             :class="{active: currentPath === 'about'

             }">
                About
            </div>
            <div class="active-button" :style="sliderPos"></div>
        </div>
    </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const currentPath = ref('home')

const navigateTo = (path) => {
    router.push(path)
}



const sliderPos = computed (() => {
    const isProjectsVisible = currentPath.value === "projects";
    let tabCount = 2;
    let visibleIndex = 0;

    if(isProjectsVisible){
        tabCount = 3
        if (currentPath.value === 'home') visibleIndex = 0
        else if (currentPath.value === 'projects') visibleIndex = 1
        else if (currentPath.value === 'about') visibleIndex = 2
    }else{
        if (currentPath.value === 'home') visibleIndex = 0
        else if (currentPath.value === 'about') visibleIndex = 1
    }
    return{
        width: `calc(${100/tabCount}% - 4px)`,
        transform: `translateX(${visibleIndex * 100}%)`
    }
})

watch (
    () => route.path,
    (newPath) => {
        if (newPath === '/'){
            currentPath.value = "home"
        } else if (newPath.startsWith("/projects/")){
            currentPath.value = "projects"
        } else {
            currentPath.value = "about"
        }
    }, { immediate: true }
)
</script>
<style scoped>
.toggle-container{
    display: flex;
    position: center;
    margin: 0 1rem;
}
.tab-toggle{
    display: flex;
    position: relative;
    background-color: rgb(255,255,255,0.08);
    border: rgb(255,255,255,0.1);
    border-radius: 30px;
    padding: 4px;
    height: 40px;
    cursor: pointer;
    user-select: none;
    max-width: 250px;
    backdrop-filter: blur(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    animation: smoothFadeIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.tab-toggle:hover{
    background-color: rgb(255,255,255,0.1);
    border-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-1px); 
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}



.nav-button{
    display: flex;
    flex: 1;
    align-items: center;
    z-index: 1;
    justify-content: center;
    height: 100%;
    color: rgb(255, 255, 255, 0.7);
    border-radius: 25px;
    white-space: nowrap;
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    opacity: 1;
    transform: scaleX(1);
    font-size: 14px;
    font-weight: 300;
}

.nav-button.projects-button{
    flex: 0;
    padding: 0;
    opacity: 0;
    transform: scaleX(0);
    overflow: hidden;
}

.nav-button.projects-button.visible{
    flex: 1;
    padding: 0 1rem;
    opacity: 1;
    transform: scaleX(1);
}

.tab-toggle .nav-button.active {
    color: #111;
    font-weight: 600;
}

.nav-button:hover{
    color: white;
}


.nav-button:not(.active):hover{
    background-color: rgb(255, 255, 255, 0.05);
}




.active-button{
    position: absolute;
    z-index: 0;
    left: 4px;
    top: 4px;
    height: calc(100% - 8px);
    background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
    border-radius: 25px;
    box-shadow: 
        0 2px 8px rgba(0, 0, 0, 0.15),
        0 1px 3px rgba(0, 0, 0, 0.1);
    transition: 
        transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
        width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.tab-toggle.projects-mode{
    min-width: 140px;
    max-width: 400px;
}


@keyframes smoothFadeIn{
    from{
        opacity: 0;
        transform: translateY(-10px) scale(0.95);
    } to{
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@media (max-width: 768px) {
  .nav-button {
    padding: 0 1.5rem;
    font-size: 13px;
  }
  
  .tab-toggle.projects-mode {
    min-width: 300px;
    max-width: 400px;
  }
}
</style>