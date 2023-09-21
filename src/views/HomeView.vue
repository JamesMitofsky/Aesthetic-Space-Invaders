<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import Modal from '../components/GameModal.vue'
import Enemy from '../models/Enemy'
import GameObject from '../models/GameObject'
import Player from '../models/Player'
import type { Key } from '../types/key'
import type { Step } from '../types/step'

let gameObjectList: GameObject[] = []
const windowHeight = 600
const windowWidth = 400
let player: GameObject | null = null
let score = ref(0)
let oldTimeStamp = 0
let context: CanvasRenderingContext2D | null = null
let pressedKey: Key = null
const startGame = ref(false)
const step = ref<Step>('startGame')
const firstName = ref('')


const drawCanvas = () => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement | null
  // Check if canvas exists, if so, get context and start game loop
  if (canvas) {
    context = canvas.getContext('2d')
    window.requestAnimationFrame(gameLoop)
  } else {
    console.error("Can't find the canvas element")
  }
}

const clearCanvas = () => {
  context?.closePath();
}
// Initialize the game
const initGame = () => {
  drawCanvas()
  player = new Player()
  player.setPosition((windowWidth - player.width) / 2, windowHeight - 80)
  gameObjectList.push(player)

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 4; j++) {
      const enemy = new Enemy()
      enemy.setPosition(j * 60, i * 60)
      gameObjectList.push(enemy)
    }
  }
}

const updateEnemyPosition = () => {
  const enemyList = gameObjectList.filter((el) => el.tag === 'enemy')
  let pixelDown = 0
  for (let enemy of enemyList) {
    if (enemy.x < 20) {
      enemyList.forEach((enemy) => {
        enemy.directionX = 1
      })
      enemyList.forEach((enemy) => {
        enemy.y += pixelDown
      })
      pixelDown += 2
    }
    if (enemy.x > 400 - 20 - enemy.width) {
      enemyList.forEach((enemy) => (enemy.directionX = -1))
      enemyList.forEach((enemy) => {
        enemy.y += pixelDown
      })
      pixelDown += 2
    }
    if (enemy.y + enemy.height >= 480) {
      step.value = "gameOver"
      startGame.value = false
    }
  }
}

// Assign pressed key to global variable
const onKeyPressed = (event: KeyboardEvent) => {
  // Store pressed key
  const currentlyPressedKey = event.key as Key

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
    gameobject.draw(context)
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

  gameUpdate(deltaTime)
  draw()

  // Call the game loop again on the next frame
  window.requestAnimationFrame(gameLoop)
}

const gameUpdate = (deltaTime: number) => {
  updateEnemyPosition()
  // chek for collisions
  if (player) {
    for (const missile of player.children) {
      for (const gameObject of gameObjectList) {
        if (gameObject.tag === 'enemy') {
          if(missile.x > gameObject.x && missile.x < gameObject.x + gameObject.width && missile.y > gameObject.y && missile.y < gameObject.y + gameObject.height) {
            console.log("collision")
            // Remove missile from player children
              player.children = player!.children.filter((child) => child !== missile)
              // Remove enemy from gameobjectlist
              gameObjectList = gameObjectList.filter((object) => object !== gameObject)
              score.value ++;
            }
        }
      }
    }
  } else {
    console.error("player is null");
  }

  // Update main objects
  for (let gameObject of gameObjectList) {
    gameObject.mainUpdate(deltaTime, pressedKey)
  }
}

const setgameMode = (gameMode: Step) => {
  step.value = gameMode
}

const setRegister = (register: Step) => {
  step.value = register
}

// const restartGame = (restartGame: Step) => {
//   step.value = restartGame;
//   startGame.value = true;
//   console.log(step.value);
// }

const startGamePlay = (name: string) => {
  startGame.value = true
  firstName.value = name
  initGame()
}

onUnmounted(() => {
  clearCanvas();
})
</script>

<template>
  <body class="no-scroll">
    <div class="flex">
      <p> {{ `score: ${score}`}}</p>
      <template v-if="!startGame">
        <Modal
          :step="step"
          @set-game-mode="setgameMode"
          @set-register="setRegister"
          @start-game-play="startGamePlay"
          @revenge="restartGame"
        />
      </template>
      <div class="canvas-container">
        <canvas id="canvas" :height="windowHeight" :width="windowWidth" />
      </div>
    </div>
  </body>
</template>

<style scoped>
.canvas-container {
  z-index: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.no-scroll {
  overflow: hidden;
}

.flex {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

p {
  font-size: 30px;
  color: white;
}

#canvas {
  background-color: black;
  border: 2px solid aqua;
}

.overlay {
  z-index: 1;
  background-color: rgba(118, 118, 118, 0.5);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}
</style>
