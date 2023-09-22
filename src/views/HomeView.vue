<script setup lang="ts">
import TopPlayerScoresVue from '@/components/TopPlayerScores.vue'
import addNewScore from '@/database/addNewScore'
import { onUnmounted, ref, watch } from 'vue'
import Modal from '../components/GameModal.vue'
import Enemy from '../models/Enemy'
import GameObject from '../models/GameObject'
import Player from '../models/Player'
import type { Key } from '../types/key'
import type { Step } from '../types/step'

let gameObjectList: GameObject[] = []
const windowHeight = 700
const windowWidth = 600
let player: GameObject | null = null
let score = ref(0)
const oldTimeStamp = ref(0)
let context: CanvasRenderingContext2D | null = null
let pressedKey: Key = null
const step = ref<Step>('landingPage')
const firstName = ref('')
const gameNumber = ref(0)

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
  context?.closePath()
}
// Initialize the game
const initGame = () => {
  drawCanvas()
  player = new Player()
  player.setPosition((windowWidth - player.width) / 2, windowHeight - 80)
  gameObjectList.push(player)

  for (let aliensPerColumn = 0; aliensPerColumn < 5; aliensPerColumn++) {
    for (let aliensPerRow = 0; aliensPerRow < 7; aliensPerRow++) {
      const enemy = new Enemy()
      enemy.setPosition(aliensPerRow * enemy.width, aliensPerColumn * enemy.height)
      gameObjectList.push(enemy)
    }
  }
}

const collision = (object1: GameObject, object2: GameObject) => {
  if (
    object1.x > object2.x &&
    object1.x < object2.x + object2.width &&
    object1.y > object2.y &&
    object1.y < object2.y + object2.height
  ) {
    return true
  }
}

const updateEnemyPosition = () => {
  const enemyList = gameObjectList.filter((el) => el.tag === 'enemy')
  for (let enemy of enemyList) {
    if (enemy.x < 0) {
      enemyList.forEach((enemy) => {
        enemy.directionX = 1
      })
      enemyList.forEach((enemy) => {
        enemy.y += enemy.speedY
      })
    }
    if (enemy.x + enemy.width > windowWidth) {
      enemyList.forEach((enemy) => (enemy.directionX = -1))
      enemyList.forEach((enemy) => {
        enemy.y += enemy.speedY
      })
    }
    if (player) {
      if (enemy.y + enemy.height > player.y + player.height || collision(player, enemy)) {
        step.value = 'gameOver'
      }
    }
  }
  if (enemyList.length === 0) {
    step.value = 'gameOver'
  }
}

const adjustEnemiesSpeed = (gameObjectList: GameObject[]) => {
  const enemyList = gameObjectList.filter((el) => el.tag === 'enemy')
  if (enemyList.length <= 5) {
    enemyList.forEach((enemy) => {
      enemy.speed = 0.4
      enemy.speedY = 15
    })
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
  pressedKey = null
}

const draw = () => {
  for (let gameobject of gameObjectList) {
    gameobject.draw(context)
  }
}
// Function that contains the game events
const gameLoop = (timeStamp: number) => {
  // Calculate the time since the last frame
  const deltaTime = timeStamp - oldTimeStamp.value
  // Set the old time stamp to the current time stamp
  oldTimeStamp.value = timeStamp
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
  if (step.value !== 'gameOver') {
    gameUpdate(deltaTime)
  }
  draw()
  // Call the game loop again on the next frame
  window.requestAnimationFrame(gameLoop)
}

const gameUpdate = (deltaTime: number) => {
  updateEnemyPosition()
  // chek for collisions
  adjustEnemiesSpeed(gameObjectList)
  if (player) {
    for (const missile of player.children) {
      for (const gameObject of gameObjectList) {
        if (gameObject.tag === 'enemy') {
          if (collision(missile, gameObject)) {
            // Remove missile from player children
            const indexOfMissileToRemove = gameObjectList.findIndex(
              (el) => el.x === missile.x && el.y === missile.y
            )
            player.children.splice(indexOfMissileToRemove, 1)
            // Remove enemy from gameobjectlist
            gameObjectList = gameObjectList.filter((object) => object !== gameObject)
            score.value++
          }
        }
      }
    }
  } else {
    console.error('player is null')
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

const startGamePlay = (name: string) => {
  step.value = 'playGameNow'
  firstName.value = name
  initGame()
}

const refreshPage = () => {
  gameObjectList = []
  clearCanvas()
  window.location.reload()
  step.value = 'landingPage'
  oldTimeStamp.value = 0
  gameNumber.value++
}

onUnmounted(() => {
  clearCanvas()
})

watch(step, (newValue, oldValue) => {
  if (newValue === 'gameOver' && oldValue === 'playGameNow') {
    console.log('Sending score to server')
    addNewScore(score.value, firstName.value)
  }
})
</script>

<template>
  <body>
    <div class="flex" :key="gameNumber">
      <p>{{ `score: ${score}` }}</p>
      <template v-if="step !== 'playGameNow'">
        <Modal
          :step="step"
          @set-game-mode="setgameMode"
          @set-register="setRegister"
          @start-game-play="startGamePlay"
        />
      </template>
      <div class="score">
        <TopPlayerScoresVue />
      </div>
      <div class="canvas-container">
        <canvas id="canvas" :height="windowHeight" :width="windowWidth" />
      </div>
      <template v-if="step === 'gameOver'">
        <div class="game-over">
          <h1>GAME OVER</h1>
          <button @click="refreshPage()">Rejouer</button>
        </div>
      </template>
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

.game-over,
.game-win {
  position: absolute;
  z-index: 1;
  background-color: rgba(25, 23, 23, 0.7);
  height: 100vh;
  width: 100vw;
  font-size: 40px;
  color: white;
  font-weight: bolder;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.flex {
  position: relative;
  background-image: url('../assets/sky.png');
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

button {
  background-color: aqua;
  padding: 10px;
  border-radius: 20px;
  font-size: 30px;
  margin: 20px;
}

.score {
  position: absolute;
  top: 30px;
  left: 30px;
  background-color: gray;
  padding: 20px;
  border-radius: 10px;
  color: white;
  font-weight: bold;
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
