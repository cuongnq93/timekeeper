<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import CountdownTimer from './components/CountdownTimer.vue'
import SignalCard from './components/SignalCard.vue'
import TimerOverlay from './components/TimerOverlay.vue'
import Settings from './components/Settings.vue'
import { DEFAULT_CONFIG } from './types'
import type { TimerConfig, SignalType } from './types'

// Load config from localStorage or use default
const loadConfig = (): TimerConfig => {
  const saved = localStorage.getItem('timerConfig')
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch {
      return JSON.parse(JSON.stringify(DEFAULT_CONFIG))
    }
  }
  return JSON.parse(JSON.stringify(DEFAULT_CONFIG))
}

// Debug mode - đọc từ query params
const getDebugSettings = () => {
  const params = new URLSearchParams(window.location.search)
  const debug = params.get('debug') === '1'
  const speed = params.get('speed') || 'x1'

  let multiplier = 1
  if (debug) {
    if (speed === 'x2') multiplier = 2
    else if (speed === 'x4') multiplier = 4
    else if (speed === 'x10') multiplier = 10
  }

  return { debug, speed, multiplier }
}

const debugSettings = ref(getDebugSettings())

// State
const config = ref<TimerConfig>(loadConfig())
const currentTime = ref(0)
const isRunning = ref(false)
const currentSignalIndex = ref<number | null>(null)
const showSignal = ref(false)
const showSettings = ref(false)
const manualMode = ref(false)

// Save config to localStorage whenever it changes
watch(config, (newConfig) => {
  localStorage.setItem('timerConfig', JSON.stringify(newConfig))
}, { deep: true })

// Timer interval
let timerInterval: number | null = null

// Current signal card to display
const currentSignalCard = computed(() => {
  if (currentSignalIndex.value === null) return null
  return config.value.cards[currentSignalIndex.value]
})

// Check if we should show a signal based on current time
const checkSignals = () => {
  if (manualMode.value) return

  for (let i = config.value.cards.length - 1; i >= 0; i--) {
    const card = config.value.cards[i]
    if (currentTime.value >= card.time) {
      if (currentSignalIndex.value !== i) {
        currentSignalIndex.value = i
        showSignal.value = true
      }
      return
    }
  }

  // No signal should be shown
  if (currentSignalIndex.value !== null) {
    showSignal.value = false
    currentSignalIndex.value = null
  }
}

// Timer functions
const startTimer = () => {
  if (isRunning.value) return

  isRunning.value = true
  // Sử dụng speedMultiplier để tăng tốc trong debug mode
  const intervalMs = 1000 / debugSettings.value.multiplier
  timerInterval = setInterval(() => {
    currentTime.value++
    checkSignals()

    // Stop at total time
    if (currentTime.value >= config.value.totalTime) {
      pauseTimer()
    }
  }, intervalMs)
}

const pauseTimer = () => {
  isRunning.value = false
  if (timerInterval !== null) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

const resetTimer = () => {
  pauseTimer()
  currentTime.value = 0
  currentSignalIndex.value = null
  showSignal.value = false
}

// Manual signal control
const nextSignal = () => {
  if (currentSignalIndex.value === null) {
    currentSignalIndex.value = 0
  } else if (currentSignalIndex.value < config.value.cards.length - 1) {
    currentSignalIndex.value++
  }
  showSignal.value = true
}

const prevSignal = () => {
  if (currentSignalIndex.value !== null && currentSignalIndex.value > 0) {
    currentSignalIndex.value--
    showSignal.value = true
  } else {
    showSignal.value = false
    currentSignalIndex.value = null
  }
}

const toggleSignal = () => {
  showSignal.value = !showSignal.value
}

// Keyboard controls
const handleKeyPress = (e: KeyboardEvent) => {
  // Ignore if settings is open
  if (showSettings.value) return

  switch (e.key) {
    case ' ':
      e.preventDefault()
      if (manualMode.value) {
        toggleSignal()
      } else {
        if (isRunning.value) {
          pauseTimer()
        } else {
          startTimer()
        }
      }
      break
    case 'ArrowRight':
      e.preventDefault()
      if (manualMode.value) {
        nextSignal()
      }
      break
    case 'ArrowLeft':
      e.preventDefault()
      if (manualMode.value) {
        prevSignal()
      }
      break
    case 'r':
    case 'R':
      e.preventDefault()
      resetTimer()
      break
    case 's':
    case 'S':
      e.preventDefault()
      showSettings.value = true
      break
    case 'm':
    case 'M':
      e.preventDefault()
      manualMode.value = !manualMode.value
      if (!manualMode.value) {
        checkSignals()
      }
      break
  }
}

// Update config
const updateConfig = (newConfig: TimerConfig) => {
  config.value = newConfig
  resetTimer()
}

// Lifecycle
onMounted(() => {
  window.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
  if (timerInterval !== null) {
    clearInterval(timerInterval)
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white flex flex-col">
    <!-- Header -->
    <header class="bg-gray-800 border-b border-gray-700 p-4">
      <div class="container mx-auto flex justify-between items-center">
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold">Toastmaster Timer</h1>
          <span
            v-if="debugSettings.debug"
            class="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full animate-pulse"
          >
            DEBUG {{ debugSettings.speed }}
          </span>
        </div>
        <div class="flex gap-4 items-center">
          <button
            @click="manualMode = !manualMode"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              manualMode
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-700 hover:bg-gray-600'
            ]"
          >
            {{ manualMode ? 'Manual Mode' : 'Auto Mode' }}
          </button>
          <button
            @click="showSettings = true"
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
          >
            Settings
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex items-center justify-center p-8">
      <CountdownTimer
        :current-time="currentTime"
        :total-time="config.totalTime"
        :is-running="isRunning"
        :cards="config.cards"
        @start="startTimer"
        @pause="pauseTimer"
        @reset="resetTimer"
      />
    </main>

    <!-- Footer / Help -->
    <footer class="bg-gray-800 border-t border-gray-700 p-4">
      <div class="container mx-auto text-center text-sm text-gray-400">
        <div v-if="manualMode" class="space-y-1">
          <p><strong>Manual Mode:</strong> Space = Toggle Signal | ← → = Navigate Signals | R = Reset | S = Settings | M = Switch Mode</p>
        </div>
        <div v-else class="space-y-1">
          <p><strong>Auto Mode:</strong> Space = Start/Pause | R = Reset | S = Settings | M = Switch Mode</p>
          <p class="text-xs">Signals will appear automatically at:
            <span v-for="(card, i) in config.cards" :key="i">
              {{ Math.floor(card.time / 60) }}:{{ (card.time % 60).toString().padStart(2, '0') }}
              <span v-if="i < config.cards.length - 1"> | </span>
            </span>
          </p>
        </div>
        <div v-if="debugSettings.debug" class="mt-2 pt-2 border-t border-gray-700">
          <p class="text-xs text-red-400">
            <strong>DEBUG MODE:</strong> Timer running at {{ debugSettings.multiplier }}x speed
          </p>
        </div>
        <div v-else class="mt-2 pt-2 border-t border-gray-700">
          <p class="text-xs opacity-50">
            Debug mode: Add <code class="bg-gray-700 px-1 rounded">?debug=1&speed=x2</code> to URL (x2, x4, x10)
          </p>
        </div>
      </div>
    </footer>

    <!-- Signal Card Overlay -->
    <SignalCard
      v-if="currentSignalCard"
      :card="currentSignalCard"
      :show="showSignal"
    />

    <!-- Timer Overlay (hiển thị trên Signal Card) -->
    <TimerOverlay
      v-if="showSignal"
      :current-time="currentTime"
      :total-time="config.totalTime"
      :cards="config.cards"
    />

    <!-- Settings Modal -->
    <Settings
      :config="config"
      :show="showSettings"
      @update="updateConfig"
      @close="showSettings = false"
    />
  </div>
</template>

