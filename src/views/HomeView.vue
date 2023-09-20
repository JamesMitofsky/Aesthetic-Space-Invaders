<script setup lang="ts">
import { onMounted } from 'vue'
import SpaceshipImage from '../assets/spaceship.png'
import BulletImage from '../assets/bullets.png'

type Bullets = {
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
  bullets: Bullets
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
  bullets: [],
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

function drawBullets(context: CanvasRenderingContext2D) {
  const bulletSize = 10

  player.bullets.forEach((bullet) => {
    
  const bulletImageElement = new Image()
  bulletImageElement.src = BulletImage

  context.drawImage(bulletImageElement, bullet.x, bullet.y, bulletSize, bulletSize)
  })

}

function addBulletToPlayer() {
  const bulletSize = 10
  player.bullets.push({
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

  drawBullets(context)
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
      addBulletToPlayer()
    }
  }

  // TODO advance any bullets that exist in the array Bullets
  if (player.bullets.length > 0) {
    player.bullets.forEach((bullet) => {
      bullet.y -= 1
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
