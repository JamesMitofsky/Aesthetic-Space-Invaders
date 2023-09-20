<script setup lang="ts">
import { onMounted } from 'vue'
import SpaceshipImage from '../assets/spaceship.png'

type Missiles = {
  x: number
  y: number
}[]

type Player = {
  x: number
  y: number
  width: number
  height: number
  color: string
  speed: number
  missiles: Missiles
  lastShootTime: number
}

let oldTimeStamp = 0
let context: CanvasRenderingContext2D | null = null
let pressedKey: string | null = null
const height = 600
const width = 400
let paused = false

const player: Player = {
  x: 0,
  y: height - 100,
  width: 0,
  height: 0,
  color: 'red',
  speed: 0.5,
  missiles: [],
  lastShootTime: 0
}

const initGame = () => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement | null

  if (!canvas) {
    console.error("Can't find the canvas element")
    return
  }

  context = canvas.getContext('2d')
  window.requestAnimationFrame(gameLoop)
}

const globallyAssignPressedKey = (event: KeyboardEvent) => {
  const currentlyPressedKey = event.key
  console.log(currentlyPressedKey)

  // update stored pressed key
  pressedKey = currentlyPressedKey
}

const setArrowKeysNull = () => {
  if (pressedKey != 'p') {
    pressedKey = null
  }
}

function drawSpaceship(context: CanvasRenderingContext2D) {
  const spaceshipImageElement = new Image()
  spaceshipImageElement.src = SpaceshipImage
  spaceshipImageElement.width = 50
  spaceshipImageElement.height = 50
  context.drawImage(spaceshipImageElement, player.x, player.y, 50, 50)

  // context.drawImage(spaceship, player.x, player.y, 50, 50)
}

function drawMissiles(context: CanvasRenderingContext2D) {
  player.missiles.forEach((missile) => {
    context.fillStyle = 'yellow'
    context.fillRect(missile.x, missile.y, 10, 10)
  })
}

function addMissileToPlayer() {
  const bulletSize = 10
  player.missiles.push({
    x: player.x + player.width / 2 - bulletSize / 2,
    y: player.y - bulletSize / 2
  })
}

const draw = () => {
  // error checking
  if (!context) {
    console.error("Can't find the context:", context)
    return
  }
  drawSpaceship(context)

  drawMissiles(context)
}

const gameLoop = (timeStamp: number) => {
  const deltaTime = timeStamp - oldTimeStamp
  oldTimeStamp = timeStamp
  if (!context) {
    console.error("Can't find the context ", context)
    return
  }
  context.clearRect(0, 0, width, height)

  document.onkeydown = globallyAssignPressedKey
  document.onkeyup = setArrowKeysNull

  gameUpdate(deltaTime)
  draw()
  window.requestAnimationFrame(gameLoop)
}

const gameUpdate = (deltaTime: number) => {
  if (paused) {
    return
  }

  // handle key inputs
  if (pressedKey === 'ArrowRight' && player.x < width - 30 - player.width) {
    player.x += player.speed * deltaTime
  } else if (pressedKey === 'ArrowLeft' && player.x > 30) {
    player.x -= player.speed * deltaTime
  } else if (pressedKey === ' ') {
    // console.log('space pressed -- fire shots')
    const now = Date.now()
    const shootRate = 300
    if (now - player.lastShootTime > shootRate) {
      console.log('shoot now')
      player.lastShootTime = now
      addMissileToPlayer()
    }
  }

  // TODO advance any missiles that exist in the array Missiles
  if (player.missiles.length > 0) {
    player.missiles.forEach((missile) => {
      missile.y -= 1
    })
  }
}

onMounted(() => {
  initGame()
})
</script>

<template>
  <body>
    <div class="canvas-container">
      <canvas id="canvas" :height="height" :width="width" />
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
