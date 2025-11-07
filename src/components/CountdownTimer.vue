<script setup lang="ts">
import { computed } from 'vue'
import ProgressBar from './ProgressBar.vue'
import Button from './Button.vue'
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
  end: []
}>()

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const timeRemaining = computed(() => {
  return Math.max(0, props.totalTime - props.currentTime)
})

const isOvertime = computed(() => {
  return props.currentTime > props.totalTime
})

const overtimeSeconds = computed(() => {
  return Math.max(0, props.currentTime - props.totalTime)
})
</script>

<template>
  <div class="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto p-6">
    <!-- Timer Display -->
    <div class="text-center">
      <div v-if="!isOvertime" class="text-8xl font-bold font-mono mb-2">
        {{ formatTime(timeRemaining) }}
      </div>
      <div v-else class="text-center">
        <div class="text-8xl font-bold font-mono mb-2 text-red-500 animate-pulse">
          +{{ formatTime(overtimeSeconds) }}
        </div>
        <div class="text-2xl font-bold text-red-400 animate-pulse mb-2">
          OVERTIME
        </div>
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
      <Button
        v-if="!isRunning"
        variant="success"
        size="lg"
        @click="emit('start')"
      >
        {{ currentTime === 0 ? 'Start' : 'Resume' }}
      </Button>
      <Button
        v-else
        variant="warning"
        size="lg"
        @click="emit('pause')"
      >
        Pause
      </Button>
      <Button
        v-if="currentTime > 0"
        variant="primary"
        size="lg"
        @click="emit('end')"
      >
        End Session
      </Button>
      <Button
        variant="danger"
        size="lg"
        @click="emit('reset')"
      >
        Reset
      </Button>
    </div>
  </div>
</template>
