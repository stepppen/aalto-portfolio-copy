export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('scroll-animate', {
    beforeMount(el: HTMLElement) {
      el.style.opacity = '0'
      el.style.transform = 'translateY(-200px)'
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease'
    },
    mounted(el: HTMLElement){
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
            observer.unobserve(el)
          }
        })
      }, { threshold: 0.9 })

      observer.observe(el)
    }
  })
})