<template>
  <svg class="constellation-bg" ref="svg"></svg>
</template>

<script>
export default {
  data() {
    return {
      svgNS: "http://www.w3.org/2000/svg",
      particles: [],
      connections: [],
      mouseX: 0,
      mouseY: 0,
      maxParticles: 70, 
      connectionDistance: 150,
      animationId: null,
      isMobile: false
    }
  },
  mounted() {
    this.checkIfMobile();
    this.initBackground();
    
    if (!this.isMobile) {
      window.addEventListener('mousemove', this.handleMouseMove);
    }
    
    this.animate();
    window.addEventListener('resize', this.handleResize);
  },
  methods: {
    initBackground() {
      const svg = this.$refs.svg;
      svg.innerHTML = '';
      svg.setAttribute('width', window.innerWidth);
      svg.setAttribute('height', window.innerHeight);
      
      this.particles = [];
      this.connections = [];
      
      // Create particles group
      const particlesGroup = document.createElementNS(this.svgNS, 'g');
      svg.appendChild(particlesGroup);
      
      // Create connections group (drawn first, below particles)
      const connectionsGroup = document.createElementNS(this.svgNS, 'g');
      svg.insertBefore(connectionsGroup, particlesGroup);
      
      // Create particles
      for (let i = 0; i < this.maxParticles; i++) {
        const particle = {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 3 + 1,
          vx: Math.random() * 0.5 - 0.25,
          vy: Math.random() * 0.5 - 0.25,
          element: document.createElementNS(this.svgNS, 'circle')
        };
        
        particle.element.setAttribute('cx', particle.x);
        particle.element.setAttribute('cy', particle.y);
        particle.element.setAttribute('r', particle.size);
        particle.element.setAttribute('fill', 'rgba(120, 120, 120, 0.6)');
        
        particlesGroup.appendChild(particle.element);
        this.particles.push(particle);
      }
    },
    animate() {
      // Move particles
      this.particles.forEach(particle => {
        // Apply gentle movement
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = window.innerWidth;
        if (particle.x > window.innerWidth) particle.x = 0;
        if (particle.y < 0) particle.y = window.innerHeight;
        if (particle.y > window.innerHeight) particle.y = 0;
        
        // Update DOM (only necessary attributes)
        particle.element.setAttribute('cx', particle.x);
        particle.element.setAttribute('cy', particle.y);
        
        // Adjust particle based on mouse proximity
        if (!this.isMobile) {
          const dx = particle.x - this.mouseX;
          const dy = particle.y - this.mouseY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 200) {
            // Gently repel from mouse
            const angle = Math.atan2(dy, dx);
            const force = (200 - distance) / 3000;
            particle.vx += Math.cos(angle) * force;
            particle.vy += Math.sin(angle) * force;
            
            // Limit velocity
            const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
            if (speed > 2) {
              particle.vx = (particle.vx / speed) * 2;
              particle.vy = (particle.vy / speed) * 2;
            }
            
            // Enhance appearance near mouse
            particle.element.setAttribute('fill', `rgba(200, 200, 220, ${0.6 + (200-distance)/400})`);
            particle.element.setAttribute('r', particle.size + (200-distance)/40);
          } else {
            // Return to normal appearance
            particle.element.setAttribute('fill', 'rgba(120, 120, 120, 0.6)');
            particle.element.setAttribute('r', particle.size);
          }
        }
      });
      
      // Update connections
      this.updateConnections();
      
      this.animationId = requestAnimationFrame(this.animate);
    },
    updateConnections() {
      const connectionsGroup = this.$refs.svg.querySelector('g:first-child');
      connectionsGroup.innerHTML = ''; // Clear existing connections
      
      // Only check particles within connectionDistance of each other
      for (let i = 0; i < this.particles.length; i++) {
        const p1 = this.particles[i];
        
        for (let j = i + 1; j < this.particles.length; j++) {
          const p2 = this.particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < this.connectionDistance) {
            // Draw line with opacity based on distance
            const line = document.createElementNS(this.svgNS, 'line');
            line.setAttribute('x1', p1.x);
            line.setAttribute('y1', p1.y);
            line.setAttribute('x2', p2.x);
            line.setAttribute('y2', p2.y);
            
            // Calculate opacity based on distance
            const opacity = 0.2 * (1 - distance / this.connectionDistance);
            
            // Check if near mouse for highlighting
            const mouseDistance = Math.min(
              Math.sqrt(Math.pow(p1.x - this.mouseX, 2) + Math.pow(p1.y - this.mouseY, 2)),
              Math.sqrt(Math.pow(p2.x - this.mouseX, 2) + Math.pow(p2.y - this.mouseY, 2))
            );
            
            if (mouseDistance < 200 && !this.isMobile) {
              // Highlight connection near mouse
              line.setAttribute('stroke', `rgba(180, 180, 255, ${opacity * 2})`);
              line.setAttribute('stroke-width', '0.8');
            } else {
              line.setAttribute('stroke', `rgba(100, 100, 100, ${opacity})`);
              line.setAttribute('stroke-width', '0.5');
            }
            
            connectionsGroup.appendChild(line);
          }
        }
      }
    },
    handleMouseMove(e) {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    },
    handleResize() {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        this.checkIfMobile();
        this.initBackground();
      }, 200);
    },
    checkIfMobile() {
      this.isMobile = window.innerWidth < 768;
      this.maxParticles = this.isMobile ? 40 : 70;
    }
  },
  beforeUnmount() {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('resize', this.handleResize);
  }
}
</script>

<style>
.constellation-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background-color: #050505;
}
</style>