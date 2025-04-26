<template>
  <canvas ref="canvas" class="starfield-bg"></canvas>
</template>

<script>
export default {
  data() {
    return {
      ctx: null,
      stars: [],
      mouseX: 0,
      mouseY: 0,
      width: 0,
      height: 0,
      dpr: 1,
      animationId: null,
      isMobile: false,
      lastFrameTime: 0,
      maxStars: 70,
      connectionDistance: 150,
      starColorBase: [100, 110, 130],
      lineColorBase: [70, 80, 100, 0.2],
      resizeTimer: null
    }
  },
  mounted() {
    this.checkIfMobile();
    this.initCanvas();
    
    if (!this.isMobile) {
      window.addEventListener('mousemove', this.handleMouseMove);
    }
    
    this.animate();
    window.addEventListener('resize', this.handleResize);
  },
  methods: {
    checkIfMobile() {
      this.isMobile = window.innerWidth < 768;
      this.maxStars = this.isMobile ? 40 : 150;
      this.connectionDistance = this.isMobile ? 120 : 150;
    },
    initCanvas() {
      const canvas = this.$refs.canvas;
      this.dpr = this.isMobile ? 1 : (window.devicePixelRatio || 1);
      
      // Set display size
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      canvas.style.width = this.width + 'px';
      canvas.style.height = this.height + 'px';
      
      // Set actual size with pixel ratio adjustment
      canvas.width = this.width * this.dpr;
      canvas.height = this.height * this.dpr;
      
      // Get context and scale
      this.ctx = canvas.getContext('2d', { alpha: false });
      this.ctx.scale(this.dpr, this.dpr);
      
      // Init stars
      this.initStars();
    },
    initStars() {
      this.stars = [];
      
      // Create stars with varied sizes and speeds
      for (let i = 0; i < this.maxStars; i++) {
        this.stars.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          radius: Math.random() * 2 + 1,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5
        });
      }
    },
    animate(timestamp) {
      this.lastFrameTime = timestamp;
      
      // Clear canvas
      this.ctx.fillStyle = '#050505';
      this.ctx.fillRect(0, 0, this.width, this.height);
      
      // Update and draw stars
      this.updateAndDrawStars();
      
      // Draw connections
      this.drawConnections();
      
      this.animationId = requestAnimationFrame(this.animate);
    },
    updateAndDrawStars() {
      const mouseActive = !this.isMobile && (this.mouseX !== 0 || this.mouseY !== 0);
      
      // Draw non-highlighted stars
      this.ctx.fillStyle = `rgba(${this.starColorBase[0]}, ${this.starColorBase[1]}, ${this.starColorBase[2]}, 0.8)`;

      this.stars.forEach(star => {
        // Update position
        star.x += star.vx;
        star.y += star.vy;
        
        // Wrap around edges
        if (star.x < -10) star.x = this.width + 10;
        if (star.x > this.width + 10) star.x = -10;
        if (star.y < -10) star.y = this.height + 10;
        if (star.y > this.height + 10) star.y = -10;
        
        let radius = star.radius;
        
        // Handle mouse interaction if mouse is active
        if (mouseActive) {
          const dx = star.x - this.mouseX;
          const dy = star.y - this.mouseY;
          const distanceSquared = dx * dx + dy * dy;
          
          if (distanceSquared < 40000) { // 200²
            const distance = Math.sqrt(distanceSquared);
            
            // Gentle attraction to mouse
            const angle = Math.atan2(dy, dx);
            const force = (200 - distance) / 10000;
            
            star.vx += Math.cos(angle) * -force;
            star.vy += Math.sin(angle) * -force;
            
            // Enhanced size and brightness near mouse
            const influence = 1 - (distance / 200);
            radius = star.radius + (influence * 2);
            
            // WHITE COLOR ON HOVER
            this.ctx.fillStyle = `rgba(${
              200 + 55 * influence}, ${
              200 + 55 * influence}, ${
              200 + 55 * influence}, ${0.8})`;
          } else {
            this.ctx.fillStyle = `rgba(${this.starColorBase[0]}, ${this.starColorBase[1]}, ${this.starColorBase[2]}, 0.8)`;
          }
        }
        
        // Draw the star
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, radius, 0, Math.PI * 2);
        this.ctx.fill();
      });
    },
    drawConnections() {
      const mouseActive = !this.isMobile && (this.mouseX !== 0 || this.mouseY !== 0);
      const connectionDistanceSquared = this.connectionDistance * this.connectionDistance;
      
      // Draw non-highlighted connections
      this.ctx.strokeStyle = `rgba(${this.lineColorBase[0]}, ${this.lineColorBase[1]}, ${this.lineColorBase[2]}, ${this.lineColorBase[3]})`;
      this.ctx.lineWidth = 0.5;
      this.ctx.beginPath();
      
      // Only check a subset of all possible connections on mobile
      const starsToCheck = this.isMobile ? this.stars.length / 2 : this.stars.length;
      const skipFactor = this.isMobile ? 2 : 1;

      for (let i = 0; i < starsToCheck; i++) {
        const star1 = this.stars[i];
        
        for (let j = i + 1; j < this.stars.length; j += skipFactor) {
          const star2 = this.stars[j];
          
          // Calculate distance between stars
          const dx = star1.x - star2.x;
          const dy = star1.y - star2.y;
          const distanceSquared = dx * dx + dy * dy;
          
          if (distanceSquared < connectionDistanceSquared) {
            const distance = Math.sqrt(distanceSquared);
            // Calculate opacity based on distance
            const opacity = (1 - distance / this.connectionDistance) * this.lineColorBase[3];
            
            // Check if near mouse for highlighting
            if (mouseActive) {
              const mouseDist1 = Math.hypot(star1.x - this.mouseX, star1.y - this.mouseY);
              const mouseDist2 = Math.hypot(star2.x - this.mouseX, star2.y - this.mouseY);
              const mouseDistance = Math.min(mouseDist1, mouseDist2);
              
              if (mouseDistance < 200) {
                // WHITE HIGHLIGHT CONNECTION NEAR MOUSE
                const influence = 1 - (mouseDistance / 200);
                this.ctx.strokeStyle = `rgba(${
                  220 + 35 * influence}, ${
                  220 + 35 * influence}, ${
                  220 + 35 * influence}, ${opacity * 2})`;
              } else {
                this.ctx.strokeStyle = `rgba(${this.lineColorBase[0]}, ${this.lineColorBase[1]}, ${this.lineColorBase[2]}, ${opacity})`;
              }
            } else {
              this.ctx.strokeStyle = `rgba(${this.lineColorBase[0]}, ${this.lineColorBase[1]}, ${this.lineColorBase[2]}, ${opacity})`;
            }
            
            // Draw the connection
            this.ctx.beginPath();
            this.ctx.moveTo(star1.x, star1.y);
            this.ctx.lineTo(star2.x, star2.y);
            this.ctx.stroke();
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
        this.initCanvas();
      }, 200);
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
.starfield-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background-color: #050505;
}
</style>