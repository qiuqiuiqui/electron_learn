<template>
  <div class="app-container">
    <h1>贪吃蛇游戏</h1>
    <SnakeGame />
  </div>
</template>

<script setup>
import SnakeGame from './components/SnakeGame.vue'
</script>

<style scoped>
.app-container {
  text-align: center;
  color: #fff;
}

h1 {
  margin-bottom: 20px;
  font-size: 28px;
  color: #00ff88;
  text-shadow: 0 0 10px #00ff88;
}
</style>
