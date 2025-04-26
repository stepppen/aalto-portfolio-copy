<!-- <template>
  <div class="p5-container" ref="canvasContainer"></div>
</template>

<script>
import p5 from 'p5';

export default {
  data() {
    return {
      isMobile: false,
      p5Instance: null
    }
  },
  mounted() {
    this.isMobile = window.innerWidth < 768;
    this.createCanvas();
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
    if (this.p5Instance) {
      this.p5Instance.remove();
    }
  },
  methods: {
    createCanvas() {
      this.p5Instance = new p5(this.sketch, this.$refs.canvasContainer);
    },
    handleResize() {
      this.isMobile = window.innerWidth < 768;
      if (this.p5Instance) {
        if (this.p5Instance.windowResized) {
          this.p5Instance.windowResized();
        }
      }
    },
    sketch(p) {
      let cols, rows;
      const gridSize = p.windowWidth < 768 ? 50 : 40; // Spacing between grid points
      let time = 0;
      let gridPoints = [];
      
      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(10);
        p.frameRate(30); // Lower frame rate for better performance
        
        // Calculate grid dimensions
        cols = Math.floor(p.width / gridSize) + 2;
        rows = Math.floor(p.height / gridSize) + 2;
        
        // Create grid points
        initializeGrid();
      };
      
      function initializeGrid() {
        gridPoints = [];
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            gridPoints.push({
              x: x * gridSize,
              y: y * gridSize,
              size: 1.5,
              offset: p.random(0, p.TWO_PI)
            });
          }
        }
      }
      
      p.draw = () => {
        // Clear with a semi-transparent background for subtle trails
        p.background(10, 240);
        
        // Update time very slowly - minimal animation
        time += 0.001;
        
        // Draw grid lines (very subtle)
        p.stroke(30);
        p.strokeWeight(0.5);
        
        // Skip some grid lines for better performance
        for (let y = 0; y < rows; y += 2) {
          p.line(0, y * gridSize, p.width, y * gridSize);
        }
        
        for (let x = 0; x < cols; x += 2) {
          p.line(x * gridSize, 0, x * gridSize, p.height);
        }
        
        // Draw points with minimal animation
        p.noStroke();
        p.fill(150);
        
        for (let i = 0; i < gridPoints.length; i++) {
          const point = gridPoints[i];
          
          // Very subtle movement for visual interest
          const offsetX = p.sin(time + point.offset) * 2;
          const offsetY = p.cos(time + point.offset * 0.5) * 2;
          
          // Draw the point
          p.ellipse(
            point.x + offsetX, 
            point.y + offsetY, 
            point.size
          );
        }
      };
      
      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        
        // Recalculate grid dimensions
        cols = Math.floor(p.width / gridSize) + 2;
        rows = Math.floor(p.height / gridSize) + 2;
        
        // Reinitialize grid
        initializeGrid();
      };
    }
  }
};
</script>

<style>
.p5-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style> -->

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
      updateDelay: null
    }
  },
  mounted() {
    this.createGrid();
    window.addEventListener('resize', this.throttledResize);
    window.addEventListener('mousemove', this.handleMouseMove);
    // Start animation loop
    this.animate();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.throttledResize);
    window.removeEventListener('mousemove', this.handleMouseMove);
    cancelAnimationFrame(this.animationId);
    clearTimeout(this.updateDelay);
  },
  methods: {
    animate() {
      // Smooth mouse movement with lerp (linear interpolation)
      this.mouseX += (this.targetMouseX - this.mouseX) * 0.15;
      this.mouseY += (this.targetMouseY - this.mouseY) * 0.15;
      
      // Update points based on smooth mouse position
      this.updatePointsNearMouse();
      
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
        line.setAttribute('stroke', 'rgba(50, 50, 50, 0.2)');
        line.setAttribute('stroke-width', '0.5');
        svg.appendChild(line);
      }
      
      for (let y = 0; y < window.innerHeight; y += this.gridSize) {
        const line = document.createElementNS(this.svgNS, 'line');
        line.setAttribute('x1', 0);
        line.setAttribute('y1', y);
        line.setAttribute('x2', window.innerWidth);
        line.setAttribute('y2', y);
        line.setAttribute('stroke', 'rgba(50, 50, 50, 0.2)');
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
            targetColor: [80, 80, 80]
          });
        }
      }
    },
    updatePointsNearMouse() {
      // Update only points that need to change
      this.pointsCache.forEach(point => {
        const dx = point.x - this.mouseX;
        const dy = point.y - this.mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Calculate target values based on distance
        if (distance < this.interactionRadius) {
          // Use smooth easing based on distance
          const influence = 1 - (distance / this.interactionRadius);
          point.targetSize = 1.5 + (influence * 5);
          point.targetOpacity = 0.5 + (influence);
          point.targetColor = [180, 180, 180];
        } else {
          point.targetSize = 1.5;
          point.targetOpacity = 0.5;
          point.targetColor = [80, 80, 80];
        }
        
        // Smooth transition to target values
        point.currentSize += (point.targetSize - point.currentSize) * 0.2;
        point.currentOpacity += (point.targetOpacity - point.currentOpacity) * 0.2;

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
        this.createGrid();
        this.updateDelay = null;
      }, 200);
    },
    handleMouseMove(e) {
      this.targetMouseX = e.clientX;
      this.targetMouseY = e.clientY;
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
  background-color: #0c0c0c;
}

/* Remove individual transitions as we're handling animation in JS */
.grid-point {
  /* No transitions needed here anymore */
}
</style>