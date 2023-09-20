<script setup lang="ts">
import p5 from 'p5'
import { onMounted } from 'vue'

onMounted(() => {
  const sketch = (p: p5) => {
    // let x = 100
    // let y = 100

    p.setup = () => {
      let canvas = p.createCanvas(400, 400)
      canvas.parent('canvas-wrapper')
    }

    p.draw = () => {
      //   p.background(0)
      //   p.fill(255)
      //   p.rect(x, y, 50, 50)
      p.background(255, 204, 0)
      p.ellipse(50, 50, 80, 80)
    }
  }
  console.log('ran')

  new p5(sketch)
})

// onUnmounted(() => {
//   // Perform cleanup tasks when the component is unmounted
//   p5Instance.remove()
// })
</script>

<template>
  <div class="canvas-wrapper"></div>
</template>
