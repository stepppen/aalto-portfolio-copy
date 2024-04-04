<template>
  <div class="container border">
    <div class="d-flex justify-content-center" id="p5Canvas"></div>
  </div>
</template>

<script setup>
const elementsY = 31;

var charset = "░▒▓█"; 

let font;

function preload() {
  font = loadFont("IBMPlexMono-Bold.otf");  
}

function setup() {
  createCanvas(700, 700);
}

function draw() {
  background(255);

  var elements = 10;
  fill(0);
  noStroke();
  
  textFont(font);
  textAlign(CENTER,CENTER);
  textSize(30);

  for (let y = 0; y < elementsY + 1; y++) {
    for (let x = 0; x < charset.length + 1; x++) {
      
      let posY = map(y, 0, elementsY, 0, height);
      let magX = map(sin(radians(posY * 1 + frameCount)), -1, 1, -width*0.4, 200);
      let posX = map(x, 0, charset.length,-magX, magX);
      
      
      let selector = x;
      
      push();
      translate(width/2+posX, posY);
      text(charset[selector],0,0);
      pop();
    }
  }
}

</script>

<style>
.full-size {
  height: 100vh;
  width: 100vw;
}
</style>
