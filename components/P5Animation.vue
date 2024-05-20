<template>
  <div ref="canvasContainer"></div>
</template>

<script>
import p5 from 'p5';

export default {
  mounted() {
    this.createCanvas();
  },
  methods: {
    createCanvas() {
      new p5(this.sketch, this.$refs.canvasContainer);
    },
    sketch(p) {
      let distMouse = 50;
      let cols; let rows; let size = 35; let offset = 20;
      let blocks = [];

      p.setup = () => {
        p.createCanvas(window.innerWidth, window.innerHeight);
        p.rectMode(p.CENTER);
        p.angleMode(p.DEGREES);
        cols = window.innerWidth/size;
        rows = window.innerHeight/size;

        for (let i=0; i<cols; i++) {
        blocks[i] = [];
        for (let j=0; j<rows; j++) {
          blocks[i][j] = new Block(size/2 + i*size, size/2 + j*size);
        }
      }

      };

      p.draw = () => {
        p.background(0);
        for (let i=0; i<cols; i++) {
          for (let j=0; j<rows; j++) {
            blocks[i][j].move();
            blocks[i][j].display();
          }
        } 
      };

      class Block {
        constructor(x, y) {
          this.x = x; 
          this.y = y;
          this.angle = 0;
          this.c = 70;
        }
        
        display() {
          p.noFill();
          p.stroke(this.c);
          p.push();
          p.translate(this.x, this.y);
          p.rotate(this.angle);
          
          if (this.angle > 0 && this.angle < 45) {
            this.drawRect();
          } else {
            this.drawX();
          }
          p.pop();
        }
        
        move() {
          // If the mouse is moving, check distance between mouse loc and center of square
          let distance; 
          if (p.pmouseX - p.mouseX != 0 || p.pmouseY - p.mouseY != 0) {
            distance = p.dist(p.mouseX, p.mouseY, this.x, this.y);
          if (distance < distMouse) {
            this.angle += 3;
            this.c = "#35a7b8";
            }
          }
          
          // If squares are already rotating, keep rotating until angle = 90
          if (this.angle > 0 && this.angle < 90) {
            this.angle += 1;
            if (this.c > 70) {
              this.c -= 3;
            }
            
          } else {
            this.angle = 0;
            this.c = "#103339";
          }
          
        }
        
        drawRect() {
          p.ellipse(0, 0, size - offset);
        }
        
        drawX() {
          let margin = -size/2;
          // p.rect(margin + offset/2, margin + offset/2, margin + size - offset/2, margin + size - offset/2);
          p.line(margin + offset/2, margin + offset/2, margin + size - offset/2, margin + size - offset/2);
          p.line(margin + size - offset/2, margin + offset/2, margin + offset/2, margin + size - offset/2);
        }
      }
  
    },
  },
};

</script>

<style scoped>
</style>