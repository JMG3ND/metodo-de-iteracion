<template>
  <div class="screen">
    <span style="font-size: x-large; text-align: center;">Subele el volumen a tu naturaleza</span>
    <URange v-model="select"></URange>
    <UContainer class="pvto" :style="`opacity: ${select / 100}; scale: ${select / 10};`">Pvto</UContainer>
  </div>
</template>

<script setup>
const select = ref(0);
</script>

<style lang="scss">
.screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20%;
  gap: 3rem;
}

.pvto {
  position: relative;
  padding: 0;
  margin: 0;
}
</style>