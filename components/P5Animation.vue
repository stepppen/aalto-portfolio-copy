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
  
</template>