<template>
  <div class="p5-container" ref="canvasContainer"></div>
</template>

<script>
import p5 from 'p5';

export default {
  mounted() {
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
      const particles = [];
      const particleCount = 100;
      const connectionDistance = 150;
      let mouseInfluenceRadius = 200;
      
      p.setup = () => {
        // Create a canvas that matches the container size
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        // Set the canvas element styling
        canvas.style('display', 'block');
        p.background(10, 15, 20);
        
        // Create particles
        for (let i = 0; i < particleCount; i++) {
          particles.push({
            position: p.createVector(p.random(p.width), p.random(p.height)),
            velocity: p.createVector(p.random(-0.3, 0.3), p.random(-0.3, 0.3)),
            size: p.random(2, 4),
            offset: p.random(1000)
          });
        }
      };

      p.draw = () => {
        p.background(10, 15, 20, 20);
        
        // Update and draw particles
        particles.forEach((particle, i) => {
          // Add subtle noise-based movement
          const noiseVal = p.noise(particle.position.x * 0.003, particle.position.y * 0.003, p.frameCount * 0.01 + particle.offset);
          const noiseAngle = p.map(noiseVal, 0, 1, 0, p.TWO_PI * 2);
          particle.velocity.x += p.cos(noiseAngle) * 0.01;
          particle.velocity.y += p.sin(noiseAngle) * 0.01;
          
          // Mouse influence
          const mousePos = p.createVector(p.mouseX, p.mouseY);
          const dist = p5.Vector.dist(particle.position, mousePos);
          
          if (dist < mouseInfluenceRadius && (p.mouseX !== 0 || p.mouseY !== 0)) {
            // Create a repulsion force
            const force = p5.Vector.sub(particle.position, mousePos);
            force.normalize();
            force.mult(0.5 * (1 - dist / mouseInfluenceRadius));
            particle.velocity.add(force);
          }
          
          // Limit velocity
          particle.velocity.limit(1.5);
          
          // Update position
          particle.position.add(particle.velocity);
          
          // Wrap around screen edges
          if (particle.position.x < 0) particle.position.x = p.width;
          if (particle.position.x > p.width) particle.position.x = 0;
          if (particle.position.y < 0) particle.position.y = p.height;
          if (particle.position.y > p.height) particle.position.y = 0;
          
          // Draw connections between particles
          particles.forEach((other, j) => {
            if (i !== j) {
              const d = p5.Vector.dist(particle.position, other.position);
              if (d < connectionDistance) {
                const alpha = p.map(d, 0, connectionDistance, 255, 0);
                p.stroke(100, 150, 200, alpha * 0.5);
                p.strokeWeight(0.5);
                p.line(
                  particle.position.x, 
                  particle.position.y, 
                  other.position.x, 
                  other.position.y
                );
              }
            }
          });
          
          // Draw particle
          p.noStroke();
          p.fill(180, 200, 240, 150);
          p.ellipse(particle.position.x, particle.position.y, particle.size);
        });
      };
      
      // Add window resize handling
      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    }
  }
};
</script>

<style scoped>
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
</style>