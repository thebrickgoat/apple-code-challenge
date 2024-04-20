<script setup>
defineProps({})
import { ref } from 'vue'
//one - build a container for the content
//two - flip the content so that it reflects the content of the page correctly. since this is a webapp using a browser that is presumably controlled on install, and that the entire contet of the screen needs to be fliped, we can just use the css transform property to flip the content with out touching the data or fooling around with the canvas or cutting up and reversing strings.
//bonus - make it an import, and just add vue-flipped attribute to the container that you need flipped

//make the flipped attribute a prop so its easy to turn on and off for degugging

const isFlippedX = ref(true)
const isFlippedY = ref(false)
</script>

<template>
  <section>
    <h1>Challenge One</h1>
    <div class="c1" :class="{ 'c1--flipped': isFlippedX, 'c1--flipped-y': isFlippedY }">
      <h2>Flipped Content</h2>
      <img src="https://via.placeholder.com/350" alt="placeholder image" />
      <p>Some content that is flipped</p>
      <button @click="isFlippedX = !isFlippedX">Click to flip X Axis</button>
      <button @click="isFlippedY = !isFlippedY">Click to flip Y Axis</button>
    </div>
  </section>
</template>

<style scoped>
/* using bem style naming conventions since no framework ui is being used here */
.c1 {
  margin: 1rem auto;
  border: 1px solid var(--color-border);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 4px 8px 0px;
  text-align: center;
}

.c1--flipped {
  transform: rotateY(180deg);
  /* or  transform: scaleX(-1)*/
}

.c1--flipped-y {
  transform: rotateX(180deg);
  /* or  transform: scaleX(-1)*/
}

.c1 img,
.c1 button {
  width: auto;
  display: block;
  margin: 1rem auto;
}
</style>
