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
      let easingMouseX = 0; // Initialize easingMouseX
      let easingMouseY = 0; // Initialize easingMouseY
      let easingFactor = 0.05;
      const elementsY = 40;
      const charset = "...................";

      p.setup = () => {
        p.createCanvas(window.innerWidth, window.innerHeight);
        p.textAlign(p.CENTER, p.CENTER);
        p.fill('blue');
        p.textSize((p.height / elementsY) * 2);
      };

      p.draw = () => {
        p.background(0, 0, 0);

        // Update easingMouseX and easingMouseY towards the current mouse position
        easingMouseX += (p.mouseX - easingMouseX) * easingFactor;
        easingMouseY += (p.mouseY - easingMouseY) * easingFactor;

        for (let y = 0; y < elementsY + 1; y++) {
          for (let x = 0; x < charset.length + 1; x++) {
            let posY = p.map(y, 0, elementsY, 0, p.height);
            let magX = p.map(
              p.tan(p.radians(posY * 0.2 + (p.frameCount) / 20)),
              -1 + (easingMouseY / 2000),
              1 + (easingMouseX / 3000),
              -p.width * 0.3,
              p.width * 0.3
            );

            let posX = p.map(x, 0, charset.length, -magX, magX);

            let selector = x;

            p.push();
            p.translate((p.width / 3) + posX, posY);
            p.text(charset[selector], 0, 0);
            p.pop();
          }
        }
      };
    },
  },
};

</script>

<style scoped>
/* Add any necessary styles */
</style>
