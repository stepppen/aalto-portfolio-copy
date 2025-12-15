<template>
  <div class="hero-bg">
    <div class="circle circle1"></div>
    <div class="circle circle2"></div>
  </div>
</template>

<script setup>
onMounted(() => {
  const circle1 = document.querySelector('.circle1');
  const circle2 = document.querySelector('.circle2');

  document.addEventListener('mousemove', (event) => {
    const { clientX: mouseX, clientY: mouseY } = event;

    // Circle 1
    circle1.style.top = `${-5 + mouseY * 0.05}%`;
    circle1.style.left = `${-5 + mouseX * 0.05}%`;
    circle1.style.width = `${400 + mouseX * 0.2}px`;
    circle1.style.height = `${300 + mouseY * 0.2}px`;
    const scaleFactor1 = 1 + Math.sin(mouseX * 0.01) * 0.2;
    circle1.style.transform = `scale(${scaleFactor1})`;

    // Circle 2
    circle2.style.bottom = `${-5 + mouseY * 0.05}%`;
    circle2.style.right = `${20 + mouseX * 0.05}%`;
    circle2.style.width = `${400 + mouseX * 0.3}px`;
    circle2.style.height = `${600 + mouseY * 0.3}px`;
    const rotation = 20 + mouseX * 0.05;
    circle2.style.transform = `rotate(${rotation}deg)`;
  });
});
</script>
<style>
.hero-bg {
    position: fixed;
  top: 0;
  left: 0;
  z-index: -10;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  /* background: linear-gradient(
    135deg,
    #05040e,
    #110625 50%,
    #161f36 80%,
    #061b34
  ); */
    background: linear-gradient(
    135deg,
    #06060c,
    #090f19 50%,
    #0f1523 80%,
    #071527
  );
/* background: linear-gradient(
  135deg,
  #0f0b09,
  #16100e 30%,
  #1f1313 60%,
  #271a1b 85%,
  #1b1511
); */
  overflow: hidden;
}

.circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.8;
  background: radial-gradient(
    circle at center,
    rgba(90, 125, 190, 0.05),
    rgba(70, 99, 145, 0.05)
  );
  filter: blur(50px);
  transition: all 0.2s ease;
  pointer-events: none;
}

.circle1 {
  top: -5%;
  left: -5%;
  width: 400px;
  height: 300px;
}

.circle2 {
  bottom: -5%;
  right: 20%;
  width: 400px;
  height: 600px;
  transform: rotate(20deg);
}
</style>