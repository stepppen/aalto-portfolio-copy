<template>
  <div ref="container" class="led-matrix"></div>
</template>

<script>
import p5 from 'p5';

export default {
  name: 'LedMatrix',
  mounted() {
    const sketch = (s) => {
      const cols = Math.floor(s.windowWidth / 22);  // e.g. 18px cell
      const rows = Math.floor(s.windowHeight / 22);   
      let cellSize;
      const matrix = [];
      const margin = 2;
      let smoothMouseX = 0;
      let smoothMouseY = 0;

      s.setup = () => {
        s.pixelDensity(1);
        smoothMouseX = s.mouseX;
        smoothMouseY = s.mouseY;
        s.colorMode(s.RGB, 255);
        s.createCanvas(s.windowWidth, s.windowHeight).parent(this.$refs.container);
        s.noStroke();
        cellSize = Math.floor(Math.min(s.windowWidth / cols, s.windowHeight / rows));
        for (let y = 0; y < rows; y++) {
          matrix[y] = [];
          for (let x = 0; x < cols; x++) {
            matrix[y][x] = {
              brightness: 0, // can still be used for interpolation
              baseColor: s.color(20, 20, 40),       // Dark blue
              targetColor: s.color(80, 80, 140),  // Light bluish white
              currentColor: s.color(20, 20, 40)     // Start at base
            };
          }
        }
      };

      s.draw = () => {
        s.background(0);
        const mx = s.mouseX;
        const my = s.mouseY;
        // Smooth follow
        smoothMouseX += (s.mouseX - smoothMouseX) * 0.1;
        smoothMouseY += (s.mouseY - smoothMouseY) * 0.1;
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const cell = matrix[y][x];
            const cx = x * cellSize + cellSize;
            const cy = y * cellSize + cellSize;
            const d = s.dist(smoothMouseX, smoothMouseY, cx, cy);
            const interactionRadius = cellSize * 4;
            const target = d < interactionRadius
              ? s.map(d, interactionRadius, 0, 60, 255)
              : 30;
            cell.brightness = s.lerp(cell.brightness, target, 0.2);

            let lerpAmt = d < interactionRadius ? s.map(d, interactionRadius, 0, 0, 1) : 0;
            cell.currentColor = s.lerpColor(cell.baseColor, cell.targetColor, lerpAmt);
            s.fill(cell.currentColor);
            s.rect(x * cellSize, y * cellSize, cellSize - margin, cellSize - margin);
          }
        }
      };

      s.windowResized = () => {
        s.resizeCanvas(s.windowWidth, s.windowHeight);
        cellSize = Math.floor(Math.min(s.windowWidth / cols, s.windowHeight / rows));
      };
    };

    this.p = new p5(sketch);
  },
  beforeUnmount() {
    this.p.remove(); // Clean up p5 instance
  }
};
</script>

<style scoped>
.led-matrix {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  background-color: #000;
  overflow: hidden;
}
</style>