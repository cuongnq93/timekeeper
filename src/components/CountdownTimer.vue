<script setup lang="ts">
import { computed } from 'vue'
import ProgressBar from './ProgressBar.vue'
import type { SignalCard } from '../types'

const props = defineProps<{
  currentTime: number
  totalTime: number
  isRunning: boolean
  cards: SignalCard[]
}>()

const emit = defineEmits<{
  start: []
  pause: []
  reset: []
}>()

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const timeRemaining = computed(() => {
  return Math.max(0, props.totalTime - props.currentTime)
})
</script>

<template>
  <div class="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto p-6">
    <!-- Timer Display -->
    <div class="text-center">
      <div class="text-8xl font-bold font-mono mb-2">
        {{ formatTime(timeRemaining) }}
      </div>
      <div class="text-xl text-gray-400">
        {{ formatTime(currentTime) }} / {{ formatTime(totalTime) }}
      </div>
    </div>

    <!-- Progress Bar -->
    <ProgressBar
      :current-time="currentTime"
      :total-time="totalTime"
      :cards="cards"
      :show-labels="true"
      height="1.5rem"
    />

    <!-- Controls -->
    <div class="flex gap-4">
      <button
        v-if="!isRunning"
        @click="emit('start')"
        class="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors"
      >
        {{ currentTime === 0 ? 'Start' : 'Resume' }}
      </button>
      <button
        v-else
        @click="emit('pause')"
        class="px-8 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-semibold transition-colors"
      >
        Pause
      </button>
      <button
        @click="emit('reset')"
        class="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
      >
        Reset
      </button>
    </div>
  </div>
</template>
