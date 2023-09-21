<template>
  <div class="setgame-main-container overlay">
    <div class="setgame-container">
      <template v-if="props.step === 'startGame'">
        <button @click="emit('setGameMode', 'gameMode')">Commencer la partie</button>
      </template>
      <template v-if="props.step === 'gameMode'">
        <div class="game-mode-container">
          <button @click="emit('setRegister', 'register')">Solo</button>
          <button @click="emit('setRegister', 'register')" disabled>Multijoueur</button>
        </div>
      </template>
      <template v-if="props.step === 'register'">
        <div class="game-mode-container">
          <input placeholder="entrer votre prénom" v-model="firstName" />
          <button @click="emit('startGamePlay', firstName)" :disabled="firstName.length < 3">
            Jouer
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Step } from '../types/step'

const firstName = ref('')
const props = defineProps<{
  step: Step
}>()
const emit = defineEmits<{
  setGameMode: [mode: Step]
  setRegister: [register: Step]
  startGamePlay: [firstName: string]
  revenge: [restartGame: Step]
}>()
</script>

<style scoped>
.setgame-main-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.setgame-container {
  background-color: rgb(25, 23, 23);
  padding: 100px;
  width: 40%;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.game-mode-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}

button {
  background-color: aqua;
  padding: 10px;
  border-radius: 20px;
  font-size: 30px;
  width: 100%;
  margin: 20px;
}

input {
  width: 100%;
  height: 50px;
  font-size: 20px;
  padding: 10px;
  border: 5px solid grey;
  border-radius: 20px;
}
input:focus {
  outline: none;
}
</style>
