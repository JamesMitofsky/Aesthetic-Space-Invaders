<script setup lang="ts">
import {ref} from 'vue'
import SpaceshipImage from '../assets/spaceship.png'
import Modal from "../components/StartGameModal.vue";
import BulletImage from '../assets/bullets.png'

// Create type Bullets
type Bullets = {
  x: number
  y: number
}[]

// Create type Player
type Player = {
  x: number
  y: number
  width: number
  height: number
  color: string
  speed: number
  bullets: Bullets
  lastShootTime: number
}

export type Step = "startGame" | "gameMode" | "register"

// Used to store the last time the game loop was run
let oldTimeStamp = 0

// Used to store the context of the canvas element on the page
let context: CanvasRenderingContext2D | null = null

// Used to store the last key pressed
let pressedKey: string | null = null

const height = 600
const width = 400
let paused = false
const spaceshipSize = 50
const startGame = ref(false);
const step = ref<Step>("startGame");
const firstName = ref("");

// Declare player object
const player: Player = {
  x: (width - spaceshipSize) / 2,
  y: height - 100,
  width: spaceshipSize,
  height: spaceshipSize,
  color: 'red',
  speed: 0.5,
  bullets: [],
  lastShootTime: 0
}

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
}

// Assign pressed key to global variable
const globallyAssignPressedKey = (event: KeyboardEvent) => {

  // Store pressed key
  const currentlyPressedKey = event.key
  console.log(currentlyPressedKey)

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

// Function to draw the spaceship on the canvas
function drawSpaceship(context: CanvasRenderingContext2D) {

  // Ceate a new image element
  const spaceshipImageElement = new Image()

  // Set the source of the image element to the spaceship image
  spaceshipImageElement.src = SpaceshipImage

  // Draw the spaceship image element on the canvas
  context.drawImage(spaceshipImageElement, player.x, player.y, spaceshipSize, spaceshipSize)
}

// Function to draw the bullets on the canvas
function drawBullets(context: CanvasRenderingContext2D) {

  // Set the size of the bullets
  const bulletSize = 10

  // Loop through the bullets array and draw each bullet
  player.bullets.forEach((bullet) => {
  
  // Create a new image element
  const bulletImageElement = new Image()

  // Set the source of the image element to the bullet image
  bulletImageElement.src = BulletImage

  // Draw the bullet image element on the canvas
  context.drawImage(bulletImageElement, bullet.x, bullet.y, bulletSize, bulletSize)
  })

}

// Function to add the bullets to the player object
function addBulletToPlayer() {

  // Set the size of the bullets
  const bulletSize = 10

  // push each new bullet into the bullets array
  player.bullets.push({

    // Set the x and y coordinates of the bullet
    x: player.x + player.width / 2 - bulletSize / 2,
    y: player.y - bulletSize / 2
  })
}

const draw = () => {
  // Error checking
  if (!context) {
    console.error("Can't find the context:", context)
    return
  }
  drawSpaceship(context)

  drawBullets(context)
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
  context.clearRect(0, 0, width, height)

  // Listen for key events and update the pressed key
  document.onkeydown = globallyAssignPressedKey
  document.onkeyup = setArrowKeysNull

  gameUpdate(deltaTime)
  draw()

  // Call the game loop again on the next frame
  window.requestAnimationFrame(gameLoop)
}

const gameUpdate = (deltaTime: number) => {
  if (paused) {
    return
  }

  const margin = 30

  // Handle key inputs
  if (pressedKey === 'ArrowRight' && player.x < width - margin - player.width) {
    player.x += player.speed * deltaTime
  } else if (pressedKey === 'ArrowLeft' && player.x > margin) {
    player.x -= player.speed * deltaTime
  } else if (pressedKey === ' ') {
    // Console.log('space pressed -- fire shots')

    // Register the time of the shot
    const now = Date.now()

    // Set the rate of fire
    const shootRate = 300

    // Check if the time of the shot is greater than the rate of fire to prevent spamming
    if (now - player.lastShootTime > shootRate) {
      console.log('shoot now')
      player.lastShootTime = now
      addBulletToPlayer()
    }
  }

  // Advance any bullets that exist in the array Bullets
  if (player.bullets.length > 0) {
    player.bullets.forEach((bullet) => {
      bullet.y -= 1
    })
  }
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
        <canvas id="canvas" :height="height" :width="width" />
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
