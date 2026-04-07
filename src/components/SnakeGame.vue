<template>
  <div class="game-wrapper">
    <div class="score">得分: {{ score }}</div>
    <div class="game-board" ref="boardRef">
      <div
        v-for="i in GRID_SIZE * GRID_SIZE"
        :key="i"
        class="cell"
        :class="getCellClass(i - 1)"
      ></div>
    </div>
    <div class="controls">
      <button v-if="!isPlaying" @click="startGame" class="btn start">
        {{ gameOver ? '重新开始' : '开始游戏' }}
      </button>
      <div class="tips">
        <p>使用 方向键 或 WASD 控制蛇的移动</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const GRID_SIZE = 20
const CELL_SIZE = 20

const boardRef = ref(null)
const snake = ref([])
const food = ref(null)
const direction = ref({ x: 1, y: 0 })
const nextDirection = ref({ x: 1, y: 0 })
const score = ref(0)
const isPlaying = ref(false)
const gameOver = ref(false)
const gameLoop = ref(null)

const initGame = () => {
  snake.value = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ]
  direction.value = { x: 1, y: 0 }
  nextDirection.value = { x: 1, y: 0 }
  score.value = 0
  gameOver.value = false
  spawnFood()
}

const spawnFood = () => {
  let newFood
  do {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    }
  } while (snake.value.some(s => s.x === newFood.x && s.y === newFood.y))
  food.value = newFood
}

const getCellClass = (index) => {
  const x = index % GRID_SIZE
  const y = Math.floor(index / GRID_SIZE)

  const isSnakeHead = snake.value.length > 0 && snake.value[0].x === x && snake.value[0].y === y
  const isSnakeBody = snake.value.some((s, i) => i > 0 && s.x === x && s.y === y)
  const isFood = food.value && food.value.x === x && food.value.y === y

  return {
    'snake-head': isSnakeHead,
    'snake-body': isSnakeBody,
    'food': isFood
  }
}

const moveSnake = () => {
  direction.value = { ...nextDirection.value }

  const head = {
    x: snake.value[0].x + direction.value.x,
    y: snake.value[0].y + direction.value.y
  }

  // 撞墙检测
  if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
    endGame()
    return
  }

  // 撞自身检测
  if (snake.value.some(s => s.x === head.x && s.y === head.y)) {
    endGame()
    return
  }

  snake.value.unshift(head)

  // 吃食物检测
  if (food.value && head.x === food.value.x && head.y === food.value.y) {
    score.value += 10
    spawnFood()
  } else {
    snake.value.pop()
  }
}

const startGame = () => {
  initGame()
  isPlaying.value = true
  gameLoop.value = setInterval(moveSnake, 150)
}

const endGame = () => {
  isPlaying.value = false
  gameOver.value = true
  if (gameLoop.value) {
    clearInterval(gameLoop.value)
    gameLoop.value = null
  }
}

const handleKeydown = (e) => {
  if (!isPlaying.value) return

  const key = e.key.toLowerCase()

  switch (key) {
    case 'arrowup':
    case 'w':
      if (direction.value.y !== 1) nextDirection.value = { x: 0, y: -1 }
      break
    case 'arrowdown':
    case 's':
      if (direction.value.y !== -1) nextDirection.value = { x: 0, y: 1 }
      break
    case 'arrowleft':
    case 'a':
      if (direction.value.x !== 1) nextDirection.value = { x: -1, y: 0 }
      break
    case 'arrowright':
    case 'd':
      if (direction.value.x !== -1) nextDirection.value = { x: 1, y: 0 }
      break
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  initGame()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (gameLoop.value) {
    clearInterval(gameLoop.value)
  }
})
</script>

<style scoped>
.game-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.score {
  font-size: 24px;
  color: #00ff88;
  font-weight: bold;
}

.game-board {
  display: grid;
  grid-template-columns: repeat(20, 20px);
  grid-template-rows: repeat(20, 20px);
  gap: 1px;
  background: #16213e;
  padding: 10px;
  border: 2px solid #00ff88;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
}

.cell {
  width: 20px;
  height: 20px;
  background: #1a1a2e;
  border-radius: 2px;
}

.snake-head {
  background: #00ff88;
  box-shadow: 0 0 8px #00ff88;
}

.snake-body {
  background: #00cc6a;
}

.food {
  background: #ff6b6b;
  border-radius: 50%;
  box-shadow: 0 0 6px #ff6b6b;
}

.controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.btn {
  padding: 12px 30px;
  font-size: 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn.start {
  background: #00ff88;
  color: #1a1a2e;
  font-weight: bold;
}

.btn.start:hover {
  background: #00cc6a;
  transform: scale(1.05);
}

.tips {
  color: #888;
  font-size: 14px;
}
</style>
