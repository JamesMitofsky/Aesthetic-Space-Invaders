<script setup>
import { onMounted} from 'vue';

let oldTimeStamp = 0;
let context = null;
const height = 600;
const width = 400;
let spaceShip = null;
let pressedKey = null;
// let lastPressedKey = null;
let paused = false;

let player = {
  x: 0,
  y: height - 100,
  width: 0,
  height: 0,
  color: "red",
  speed: 0.5
}

// let player2 = {
//   x: width - 50,
//   y: height - 50,
//   width: 50,
//   height: 50,
//   color: "blue"
// }

const initGame =() => {
  const canvas = document.getElementById("canvas");
  spaceShip = document.getElementById("bullets");
  player.width = spaceShip.width;
  player.height = spaceShip.height;
  player.x = (width - spaceShip.width) / 2;
  context = canvas.getContext('2d');
  window.requestAnimationFrame(gameLoop);
}

const globallyAssignPressedKey = (event) => {
  const key = event.key;
  const currentKeyIsP = key === "p";
  pressedKey = key;
  const formerKeyIsP = pressedKey === "p";
  if (currentKeyIsP) {
    paused = true;
  }
  console.log("formerKeyIsP",  formerKeyIsP);
  const needToUnpausePlayer = currentKeyIsP && formerKeyIsP;
  console.log(needToUnpausePlayer);
  if (needToUnpausePlayer) {
    pressedKey = null;
    paused = false;
  }
  // console.log(pressedKey);
}

const setArrowKeysNull = () => {
  if(pressedKey != "p") {
    pressedKey = null;
  }
  // console.log(pressedKey);
}

const draw = () => {
  context.drawImage(spaceShip, player.x, player.y);
}

const gameLoop = (timeStamp) => {
  const deltaTime = timeStamp - oldTimeStamp;
  oldTimeStamp = timeStamp;
  context.clearRect(0, 0, width, height);
  // const currentlyPressedKey = pressedKey;

  document.onkeydown = globallyAssignPressedKey;
  document.onkeyup = setArrowKeysNull;
  // else if (pressedKey === "p" && ) {

  // }
  
  // else {
  //   document.onkeydown = globallyAssignPressedKey;
  // }
  gameUpdate(deltaTime);
  draw();
  window.requestAnimationFrame(gameLoop);
}

const gameUpdate = (deltaTime) => {
  if (paused) {return}
  if (pressedKey === "ArrowRight" && player.x < (width - 30) - player.width) {
    player.x += 10;
    // player.x += player.speed * deltaTime;
  }
  if (pressedKey === "ArrowLeft" && player.x > 30) {
    player.x -= player.speed * deltaTime;
  }
  // if (player.x < width - player.width) {
  //   player.x += 1;
  // }
  // if (player3.x < width - player3.width) {
  //   player3.x += 1;
  // }
  // if (player2.x > 0) {
  //   player2.x -= 1;
  // }
  //context.fillRect(player.x, player.y, spaceShip.width, spaceShip.height);
}

onMounted(() => {
  initGame();
})

</script>

<template>
  <body>
    <div class="canvas-container">
      <canvas id="canvas" :height="height" :width="width"/>
      <div style="display: none;">
        <img id="bullets" src="../assets/bullets.png"/>
      </div>
    </div>
  </body>
</template>

<style scoped>
  .canvas-container {
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #canvas {
    background-color: black;
    border: 2px solid aqua;
  }
</style>

