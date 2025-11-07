<script setup lang="ts">
import { computed } from 'vue'
import ProgressBar from './ProgressBar.vue'
import type { SignalCard } from '../types'

const props = defineProps<{
  currentTime: number
  totalTime: number
  cards: SignalCard[]
}>()

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const timeRemaining = computed(() => {
  return Math.max(0, props.totalTime - props.currentTime)
})

const progressPercentage = computed(() => {
  return (props.currentTime / props.totalTime) * 100
})
</script>

<template>
  <div class="fixed top-0 left-0 right-0 z-[60] bg-black bg-opacity-80 backdrop-blur-sm">
    <div class="container mx-auto px-6 py-4">
      <div class="flex items-center justify-between gap-6">
        <!-- Current Time -->
        <div class="text-white">
          <div class="text-xs font-medium text-gray-300 mb-1">Elapsed</div>
          <div class="text-2xl font-bold font-mono">
            {{ formatTime(currentTime) }}
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="flex-1 max-w-2xl">
          <div class="text-xs font-medium text-gray-300 mb-2 text-center">
            Progress - {{ Math.round(progressPercentage) }}%
          </div>
          <ProgressBar
            :current-time="currentTime"
            :total-time="totalTime"
            :cards="cards"
            :show-labels="false"
            height="1rem"
          />
        </div>

        <!-- Time Remaining -->
        <div class="text-white text-right">
          <div class="text-xs font-medium text-gray-300 mb-1">Remaining</div>
          <div class="text-2xl font-bold font-mono">
            {{ formatTime(timeRemaining) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
