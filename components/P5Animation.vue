<template>
  <svg class="grid-background" ref="svg"></svg>
</template>

<script>
export default {
  data() {
    return {
      svgNS: "http://www.w3.org/2000/svg",
      gridSize: 40,
      mouseX: 0,
      mouseY: 0,
      targetMouseX: 0,
      targetMouseY: 0,
      animationId: null,
      pointsCache: [],
      interactionRadius: 150,
      updateDelay: null,
      isMobile: false
    }
  },
  mounted() {
    this.checkIfMobile();
    this.createGrid();
    
    // Only add mouse events if not mobile
    if (!this.isMobile) {
      window.addEventListener('mousemove', this.handleMouseMove);
    }
    
    window.addEventListener('resize', this.throttledResize);
    // Start animation loop
    this.animate();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.throttledResize);
    if (!this.isMobile) {
      window.removeEventListener('mousemove', this.handleMouseMove);
    }
    cancelAnimationFrame(this.animationId);
    clearTimeout(this.updateDelay);
  },
  methods: {
    checkIfMobile() {
      // Simple detection based on screen width
      this.isMobile = window.innerWidth < 768;
    },
    animate() {
      // Only do mouse smoothing if not mobile
      if (!this.isMobile) {
        // Smooth mouse movement with lerp (linear interpolation)
        this.mouseX += (this.targetMouseX - this.mouseX) * 0.15;
        this.mouseY += (this.targetMouseY - this.mouseY) * 0.15;
        
        // Update points based on smooth mouse position
        this.updatePointsNearMouse();
      }
      
      // Continue animation loop
      this.animationId = requestAnimationFrame(this.animate);
    },
    createGrid() {
      const svg = this.$refs.svg;
      svg.innerHTML = '';
      svg.setAttribute('width', window.innerWidth);
      svg.setAttribute('height', window.innerHeight);
      
      // Create grid lines (less frequent for better performance)
      for (let x = 0; x < window.innerWidth; x += this.gridSize) {
        const line = document.createElementNS(this.svgNS, 'line');
        line.setAttribute('x1', x);
        line.setAttribute('y1', 0);
        line.setAttribute('x2', x);
        line.setAttribute('y2', window.innerHeight);
        line.setAttribute('stroke', 'rgba(30, 30, 30, 0.1)'); // Darker grid lines
        line.setAttribute('stroke-width', '0.5');
        svg.appendChild(line);
      }
      
      for (let y = 0; y < window.innerHeight; y += this.gridSize) {
        const line = document.createElementNS(this.svgNS, 'line');
        line.setAttribute('x1', 0);
        line.setAttribute('y1', y);
        line.setAttribute('x2', window.innerWidth);
        line.setAttribute('y2', y);
        line.setAttribute('stroke', 'rgba(30, 30, 30, 0.1)'); // Darker grid lines
        line.setAttribute('stroke-width', '0.5');
        svg.appendChild(line);
      }
      
      // Create grid points and build the cache
      this.pointsCache = [];
      const cols = Math.ceil(window.innerWidth / this.gridSize);
      const rows = Math.ceil(window.innerHeight / this.gridSize);
      
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const circle = document.createElementNS(this.svgNS, 'circle');
          const posX = x * this.gridSize;
          const posY = y * this.gridSize;
          
          circle.setAttribute('cx', posX);
          circle.setAttribute('cy', posY);
          circle.setAttribute('r', 1.5);
          circle.setAttribute('fill', 'rgba(80, 80, 80, 0.5)');
          circle.classList.add('grid-point');
          svg.appendChild(circle);
          
          // Store in cache for quick access
          this.pointsCache.push({
            element: circle,
            x: posX,
            y: posY,
            currentSize: 1.5,
            targetSize: 1.5,
            currentOpacity: 0.5,
            targetOpacity: 0.5,
            currentColor: [80, 80, 80], // Darker RGB values
            targetColor: [80, 80, 80]  // Darker RGB values
          });
        }
      }
    },
    updatePointsNearMouse() {
      // Skip this entirely on mobile devices
      if (this.isMobile) return;
      
      // Update only points that need to change
      this.pointsCache.forEach(point => {
        const dx = point.x - this.mouseX;
        const dy = point.y - this.mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Calculate target values based on distance
        if (distance < this.interactionRadius) {
          // Use smooth easing based on distance
          const influence = 1 - (distance / this.interactionRadius);
          
          // Larger dots near mouse
          point.targetSize = 1.5 + (influence * 5);
          
          // Higher opacity near mouse
          point.targetOpacity = 0.5 + (influence);
          
          // Whiter color near mouse (interpolate from default to white)
          point.targetColor = [
            80 + (influence * 175), // Towards 255 (white)
            80 + (influence * 175), // Towards 255 (white)
            80 + (influence * 175)  // Towards 255 (white)
          ];
        } else {
          // Default values when away from mouse
          point.targetSize = 1.5;
          point.targetOpacity = 0.5;
          point.targetColor = [80, 80, 80]; // Default darker color
        }
        
        // Smooth transition to target values
        point.currentSize += (point.targetSize - point.currentSize) * 0.2;
        point.currentOpacity += (point.targetOpacity - point.currentOpacity) * 0.2;
        
        // Smooth color transition
        point.currentColor = [
          point.currentColor[0] + (point.targetColor[0] - point.currentColor[0]) * 0.2,
          point.currentColor[1] + (point.targetColor[1] - point.currentColor[1]) * 0.2,
          point.currentColor[2] + (point.targetColor[2] - point.currentColor[2]) * 0.2
        ];
        
        // Only update DOM if values changed significantly
        if (
          Math.abs(point.currentSize - parseFloat(point.element.getAttribute('r'))) > 0.05 ||
          Math.abs(point.currentColor[0] - point.targetColor[0]) > 3
        ) {
          point.element.setAttribute('r', point.currentSize);
          point.element.setAttribute('fill', 
            `rgba(${Math.round(point.currentColor[0])}, 
                  ${Math.round(point.currentColor[1])}, 
                  ${Math.round(point.currentColor[2])}, 
                  ${point.currentOpacity})`
          );
        }
      });
    },
    throttledResize() {
      if (this.updateDelay) return;
      this.updateDelay = setTimeout(() => {
        // Check if mobile status changed on resize
        const wasMobile = this.isMobile;
        this.checkIfMobile();
        
        // If switching between mobile and desktop, update event listeners
        if (wasMobile !== this.isMobile) {
          if (this.isMobile) {
            // Switching to mobile: remove mouse events
            window.removeEventListener('mousemove', this.handleMouseMove);
            
            // Reset all points to default state
            this.pointsCache.forEach(point => {
              point.currentSize = 1.5;
              point.targetSize = 1.5;
              point.currentOpacity = 0.5;
              point.targetOpacity = 0.5;
              point.currentColor = [80, 80, 80];
              point.targetColor = [80, 80, 80];
              
              point.element.setAttribute('r', 1.5);
              point.element.setAttribute('fill', 'rgba(80, 80, 80, 0.5)');
            });
          } else {
            // Switching to desktop: add mouse events
            window.addEventListener('mousemove', this.handleMouseMove);
          }
        }
        
        this.createGrid();
        this.updateDelay = null;
      }, 200);
    },
    handleMouseMove(e) {
      // Only update if not mobile (extra safety check)
      if (!this.isMobile) {
        this.targetMouseX = e.clientX;
        this.targetMouseY = e.clientY;
      }
    }
  }
}
</script>

<style>
.grid-background {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  background-color: #050505; /* Darker background */
  width: 100%;
  height: 100%;
}
</style>