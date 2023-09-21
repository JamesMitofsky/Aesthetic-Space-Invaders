<script setup lang="ts">
import {ref} from 'vue'
import Modal from "../components/StartGameModal.vue";
import GameObject from "../models/Game0bject";
import Player from "../models/Player";
import Enemy from "../models/Enemy";

let gameObjectList: GameObject[] = [];
const windowHeight = 600;
const windowWidth = 400;
let player: GameObject | null= null;

const updateEnemyPosition = () => {
  const enemyList = gameObjectList.filter(el => el.tag === "enemy");
  let pixelDown = 0;
  for (let enemy of enemyList) {
    console.log("toto");
    if (enemy.x < 20) {
      enemyList.forEach(enemy => {enemy.directionX = 1});
      enemyList.forEach(enemy => {enemy.y += pixelDown});
      pixelDown += 2;
    }
    if (enemy.x > 400 - 20 - enemy.width) {
      enemyList.forEach(enemy => enemy.directionX = -1);
      enemyList.forEach(enemy => {enemy.y += pixelDown});
      pixelDown += 2;
    }
    if (enemy.y + enemy.height >= 480) {
      // Si l'ennemi atteint le bas du canevas, c'est la fin du jeu
      // alert("Game Over");
      // // Rechargez la page
      // window.location.reload();
    }
    console.log(pixelDown);

    // console.log(enemy.y);
  }
}

export type Step = "startGame" | "gameMode" | "register"

let oldTimeStamp = 0

let context: CanvasRenderingContext2D | null = null

let pressedKey: string | null = null


let paused = false
const spaceshipSize = 50
const startGame = ref(false);
const step = ref<Step>("startGame");
const firstName = ref("");
const margin = 10;

// Initialize the game
const initGame = () => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement | null


  // Check if canvas exists, if so, get context and start game loop
  if (canvas) {
    context = canvas.getContext('2d')
    window.requestAnimationFrame(gameLoop)
  } else {
    console.error("Can't find the canvas element")
  }

  player = new Player();
  player.setPosition((windowWidth - player.width) / 2, windowHeight - 80);
  gameObjectList.push(player);

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 4; j++) {
      const enemy = new Enemy();
      enemy.setPosition(j * 60, i * 60);
      gameObjectList.push(enemy);
    }
  }
}

// Assign pressed key to global variable
const onKeyPressed = (event: KeyboardEvent) => {

  // Store pressed key
  const currentlyPressedKey = event.key

  // Update stored pressed key
  pressedKey = currentlyPressedKey
}

// Check if pressed key is p, if not, set pressed key to null
const setArrowKeysNull = () => {

  // If pressed key is not p, set pressed key to null and keep the game running
  if (pressedKey != 'p') {
    pressedKey = null
  }
}

const draw = () => {
  for (let gameobject of gameObjectList) {
    gameobject.draw(context);
  }
}

// Function that contains the game events
const gameLoop = (timeStamp: number) => {

  // Calculate the time since the last frame
  const deltaTime = timeStamp - oldTimeStamp

  // Set the old time stamp to the current time stamp
  oldTimeStamp = timeStamp

  // Error checking
  if (!context) {
    console.error("Can't find the context ", context)
    return
  }

  // Clear the canvas
  context.clearRect(0, 0, windowWidth, windowHeight)

  // Listen for key events and update the pressed key
  document.onkeydown = onKeyPressed
  document.onkeyup = setArrowKeysNull

  gameUpdate(deltaTime);
  draw();

  // Call the game loop again on the next frame
  window.requestAnimationFrame(gameLoop)
}

const gameUpdate = (deltaTime: number) => {
  updateEnemyPosition();
  // chek for collisions
  for (const missile of player!.children) {
    for (const gameObject of gameObjectList) {
      if (gameObject.tag ==="enemy") {
        // Check collision with enemy

        // If yes
        // Enelever le missile des enfants de player
        // Enlever l'ennemi de la liste gameobjectlist
      }

    }
  }

  // Update main objects
  for (let gameObject of gameObjectList) {
    gameObject.mainUpdate(deltaTime, pressedKey);
  }
  // Handle key inputs
  // if (pressedKey === 'ArrowRight') { // && player.x < windowWidth - margin - player.width) {
  //   player.move(1, 0, deltaTime);
  // } 
  // if (pressedKey === "ArrowLeft") {
  //   player.move(-1, 0, deltaTime);
  // }
  //else if (pressedKey === 'ArrowLeft' && player.x > margin) {
  //   player.x -= player.speed * deltaTime
  // } else if (pressedKey === ' ') {
  //   console.log('space pressed -- fire shots')

  //   // Register the time of the shot
  //   const now = Date.now()

  //   // Set the rate of fire
  //   const shootRate = 300

    // Check if the time of the shot is greater than the rate of fire to prevent spamming
    // if (now - player.lastShootTime > shootRate) {
    //   console.log('shoot now')
    //   player.lastShootTime = now
    //   addBulletToPlayer()
    // }
  // }

  // Advance any bullets that exist in the array Bullets
  // if (player.bullets.length > 0) {
  //   player.bullets.forEach((bullet) => {
  //     bullet.y -= 4
  //   })
  // }
}

const setgameMode = (gameMode: Step) => {
  step.value = gameMode;
}

const setRegister = (register: Step) => {
  step.value = register;
}


const startGamePlay = (name: string) => {
  startGame.value = true;
  firstName.value = name;
  initGame();
}
</script>

<template>
  <body>
    <template v-if="!startGame">
      <Modal :step="step" @set-game-mode="setgameMode" @set-register="setRegister" @start-game-play="startGamePlay"/>
    </template>
      <div class="canvas-container">
        <canvas id="canvas" :height="windowHeight" :width="windowWidth" />
      </div>
  </body>
</template>

<style scoped>
  .canvas-container {
    z-index: 0;
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

  .overlay {
    z-index: 1;
    background-color:rgba(118, 118, 118, 0.5);
    position:absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    width:100%;
    height:100%;
  }
</style>
../models/Game0bject.js