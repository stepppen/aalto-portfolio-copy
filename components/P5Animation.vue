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
      let font;
      let easingX = 1;
      let easing = 0.001;
      const elementsY = 30;
      // const charset = "▛▜▝▞▟";
      const charset = "....::---";

      // p.preload = () => {
      //   font = p.loadFont("/assets/fonts/IBMPlexMono-Bold.ttf");
      // };

      p.setup = () => {
        p.createCanvas(window.innerWidth, window.innerHeight);
        // p.textFont(font);
        p.textAlign(p.CENTER, p.CENTER);
        p.fill('blue')
        p.textSize((p.height / elementsY) * 2);
      };

      p.draw = () => {
        p.background(0, 0, 0);

        for (let y = 0; y < elementsY + 1; y++) {
          for (let x = 0; x < charset.length + 1; x++) {
            let posY = p.map(y, 0, elementsY, 0, p.height);
            // let noiseVal = p.noise(posY * 0.1, p.frameCount * 0.01);
            // let magX = p.map(noiseVal, 0, 0.6, -p.width * 0.6, p.width * 0.6);
            let magX = p.map(
              p.tan(p.radians(posY * 0.2 + (p.frameCount)/20)),
              -1,
              1,
              -p.width * 0.6,
              p.width * 0.6
            );
            let posX = p.map(x, 0, charset.length, -magX, magX);

            let selector = x;
            let targetX = p.mouseX;
            let dx = targetX - easingX;
            easingX += dx * p.easing;

            p.push();
            p.translate((p.width/3 + p.mouseX / 10) + posX, posY);
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
