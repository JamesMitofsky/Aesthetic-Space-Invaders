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
const spaceshipSize = 50

const player: Player = {
  x: (width - spaceshipSize) / 2,
  y: height - 100,
  width: spaceshipSize,
  height: spaceshipSize,
  color: 'red',
  speed: 0.5,
  missiles: [],
  lastShootTime: 0
}

const initGame = () => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement | null

  if (canvas) {
    context = canvas.getContext('2d')
    window.requestAnimationFrame(gameLoop)
  } else {
    console.error("Can't find the canvas element")
  }
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
  // create spaceship image
  const spaceshipImageElement = new Image()
  spaceshipImageElement.src = SpaceshipImage

  context.drawImage(spaceshipImageElement, player.x, player.y, spaceshipSize, spaceshipSize)
}

function drawMissiles(context: CanvasRenderingContext2D) {
  const missileSize = 10

  player.missiles.forEach((missile) => {
    context.fillStyle = 'yellow'
    context.fillRect(missile.x, missile.y, missileSize, missileSize)
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

  const margin = 30

  // handle key inputs
  if (pressedKey === 'ArrowRight' && player.x < width - margin - player.width) {
    player.x += player.speed * deltaTime
  } else if (pressedKey === 'ArrowLeft' && player.x > margin) {
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
