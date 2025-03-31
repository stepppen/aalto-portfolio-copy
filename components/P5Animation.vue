<template>
  <div class="p5-container" ref="canvasContainer"></div>
</template>

<script>
import p5 from 'p5';

export default {
  mounted() {
    console.log("P5Animation mounted");
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
      if (this.p5Instance) {
        this.p5Instance.remove();
        this.createCanvas();
      }
    },
    sketch(p) {
      // Grid properties
      const gridSize = 40; // Larger size for more minimalist feel
      let cols, rows;
      let mouseRadius = 200; // Larger radius of influence
      let canvas;
      let time = 0;
      
      // Grid points array to store and manipulate
      let gridPoints = [];
      
      p.setup = () => {
        console.log("Canvas size:", p.windowWidth, p.windowHeight);
        canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.style('display', 'block');
        canvas.style('position', 'absolute');
        canvas.style('top', '0');
        canvas.style('left', '0');
        canvas.style('z-index', '-1');
        
        // Calculate grid dimensions
        cols = Math.floor(p.width / gridSize) + 1;
        rows = Math.floor(p.height / gridSize) + 1;
        
        // Create grid points
        initializeGrid();
        
        p.background(10);
      };

      // Initialize grid points
      function initializeGrid() {
        gridPoints = [];
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            gridPoints.push({
              x: x * gridSize,
              y: y * gridSize,
              origX: x * gridSize,
              origY: y * gridSize,
              size: 1.5, // Default small size
              brightness: 100, // Default dim brightness
              offset: p.random(0, p.TWO_PI) // Random offset for animation
            });
          }
        }
      }

      p.draw = () => {
        time += 0.005; // Slower time for subtle movement
        p.background(10, 220); // Higher alpha for less trail
        
        // Create normalized mouse position
        const mouseNormX = p.map(p.mouseX, 0, p.width, -1, 1, true);
        const mouseNormY = p.map(p.mouseY, 0, p.height, -1, 1, true);
        
        // Draw grid lines first (minimalist approach)
        p.stroke(40); // Very subtle dark gray lines
        p.strokeWeight(0.1);
        
        // Draw horizontal grid lines
        for (let y = 0; y <= rows; y++) {
          p.line(0, y * gridSize, p.width, y * gridSize);
        }
        
        // Draw vertical grid lines
        for (let x = 0; x <= cols; x++) {
          p.line(x * gridSize, 0, x * gridSize, p.height);
        }
        
        // Draw points and interactive elements
        for (let i = 0; i < gridPoints.length; i++) {
          const point = gridPoints[i];
          
          // Calculate distance to mouse
          const distToMouse = p.dist(point.x, point.y, p.mouseX, p.mouseY);
          const influence = distToMouse < mouseRadius ? 
            p.map(distToMouse, 0, mouseRadius, 1, 0) : 0;
          
          // Reset position with subtle ambient movement
          point.x = point.origX + p.sin(time + point.offset) * 2;
          point.y = point.origY + p.cos(time + point.offset * 0.5) * 2;
          
          // Apply mouse influence
          if (influence > 0) {
            // Direction vector from point to mouse
            const angle = p.atan2(p.mouseY - point.y, p.mouseX - point.x);
            
            // Push-pull effect based on mouse position
            const pushPullFactor = mouseNormY > 0 ? -1 : 1; 
            const strength = influence * 20 * pushPullFactor;
            
            point.x += p.cos(angle) * strength;
            point.y += p.sin(angle) * strength;
            
            // Enhanced size and brightness near mouse
            point.size = p.map(influence, 0, 1, 1.5, 4);
            point.brightness = p.map(influence, 0, 1, 100, 200);
          } else {
            // Default values when away from mouse
            point.size = 1.5;
            point.brightness = 100;
          }
          
          // Draw point
          p.noStroke();
          p.fill(point.brightness);
          p.ellipse(point.x, point.y, point.size);
          
          // Draw connection lines between nearby points
          if (influence > 0.3) {
            // Find neighboring points
            const currentX = Math.floor(i % cols);
            const currentY = Math.floor(i / cols);
            
            // Check right neighbor
            if (currentX < cols - 1) {
              const rightNeighbor = gridPoints[i + 1];
              const lineAlpha = influence * 100;
              p.stroke(255, lineAlpha);
              p.strokeWeight(influence * 0.5);
              p.line(point.x, point.y, rightNeighbor.x, rightNeighbor.y);
            }
            
            // Check bottom neighbor
            if (currentY < rows - 1) {
              const bottomNeighbor = gridPoints[i + cols];
              const lineAlpha = influence * 100;
              p.stroke(255, lineAlpha);
              p.strokeWeight(influence * 0.5);
              p.line(point.x, point.y, bottomNeighbor.x, bottomNeighbor.y);
            }
          }
        }
      };
      
      p.windowResized = () => {
        console.log("Window resized:", p.windowWidth, p.windowHeight);
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        // Recalculate grid dimensions
        cols = Math.floor(p.width / gridSize) + 1;
        rows = Math.floor(p.height / gridSize) + 1;
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

canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style>