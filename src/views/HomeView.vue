<script setup lang="ts">
import { onMounted } from 'vue'

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
}

let oldTimeStamp = 0
let spaceShip: HTMLImageElement | null = null
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
  missiles: []
}

// let player2 = {
//   x: width - 50,
//   y: height - 50,
//   width: 50,
//   height: 50,
//   color: "blue"
// }

const initGame = () => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement | null
  spaceShip = document.getElementById('bullets') as HTMLImageElement | null
  if (!spaceShip || !canvas) {
    console.error("Can't find the canvas or spaceship", canvas, spaceShip)
    return
  }
  player.width = spaceShip.width
  player.height = spaceShip.height
  player.x = (width - spaceShip.width) / 2
  context = canvas.getContext('2d')
  window.requestAnimationFrame(gameLoop)
}

function managePause(event: KeyboardEvent) {
  const key = event.key
  const currentKeyIsP = key === 'p'
  pressedKey = key
  const formerKeyIsP = pressedKey === 'p'
  if (currentKeyIsP) {
    paused = true
  }
  console.log('formerKeyIsP', formerKeyIsP)
  const needToUnpausePlayer = currentKeyIsP && formerKeyIsP
  console.log(needToUnpausePlayer)
  if (needToUnpausePlayer) {
    pressedKey = null
    paused = false
  }
}

const globallyAssignPressedKey = (event: KeyboardEvent) => {
  const currentlyPressedKey = event.key

  // update stored pressed key
  pressedKey = currentlyPressedKey
  // if(currentlyPressedKey === "space") {

  // }
}

const setArrowKeysNull = () => {
  if (pressedKey != 'p') {
    pressedKey = null
  }
  // console.log(pressedKey);
}

function drawSpaceship(context: CanvasRenderingContext2D, spaceship: HTMLImageElement) {
  context.drawImage(spaceship, player.x, player.y)
}

function drawMissiles(context: CanvasRenderingContext2D) {
  // draw missiles from the array of missiles in player
  // for each missile in player.missiles
  // draw the missile
  // move the missile
  player.missiles.forEach((missile) => {
    context.fillStyle = 'yellow'
    context.fillRect(missile.x, missile.y, 10, 10)
  })

  // create bullet
  // const spaceshipCenterPositionX = player.x + player.width / 2
  // const spaceshipTopPositionY = player.y
  // const bulletSize = 10
  // // set bullet positions so they are centered
  // const bulletCenterPositionX = spaceshipCenterPositionX - bulletSize / 2
  // const bulletTopPositionY = spaceshipTopPositionY - bulletSize / 2
  // context.fillStyle = 'yellow'
  // context.fillRect(bulletCenterPositionX, bulletTopPositionY, bulletSize, bulletSize)

  // // move the bullet
  // const bulletSpeed = 1
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
  if (!context || !spaceShip) {
    console.error("Can't find the context or the spaceship:", context, spaceShip)
    return
  }
  drawSpaceship(context, spaceShip)

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
    console.log('space pressed -- fire shots')
    addMissileToPlayer()
  }

  // TODO advance any missiles that exist in the array Missiles
  if (player.missiles.length > 0) {
    player.missiles.forEach((missile) => {
      missile.y -= 1
    })
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
  initGame()
})
</script>

<template>
  <body>
    <div class="canvas-container">
      <canvas id="canvas" :height="height" :width="width" />
      <div style="display: none">
        <img id="bullets" src="../assets/bullets.png" />
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
