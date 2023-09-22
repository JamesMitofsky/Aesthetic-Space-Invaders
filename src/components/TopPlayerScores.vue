<template>
  <template v-if="topScores.length > 0">
    <h1>Top Player Scores</h1>
    <ul>
      <li v-for="score in topScores" :key="score.id">{{ score.username }} - {{ score.score }}</li>
    </ul>
  </template>
  <template v-else>
    <p>Aucun score pour le moment!</p>
  </template>
</template>

<script setup lang="ts">
import getTenBestScores from '@/database/getTenBestScores'
import { onMounted, ref } from 'vue'
import type { Database } from '../types/supabase'

const topScores = ref<Database['public']['Tables']['topScores']['Row'][]>([])

onMounted(async () => {
  // Call the getTopScores function and save the results to the topScores variable
  const topTenScores = await getTenBestScores()

  if (topTenScores) {
    topScores.value = topTenScores
    console.log('topScores', topScores.value)
  } else {
    console.error('There was a problem fetching the values from the database', topScores.value)
    return
  }
})
</script>

<style>
li {
  font-size: 20px;
  list-style: decimal;
  margin: auto;
}
</style>
