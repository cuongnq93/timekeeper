<script setup lang="ts">
import { computed } from 'vue'
import ProgressBar from '@/components/ProgressBar.vue'
import Button from '@/components/Button.vue'
import type { SignalCard } from '@/types'

const props = defineProps<{
  currentTime: number
  totalTime: number
  cards: SignalCard[]
}>()

const emit = defineEmits<{
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

const progressPercentage = computed(() => {
  return Math.min(100, (props.currentTime / props.totalTime) * 100)
})

const isOvertime = computed(() => {
  return props.currentTime > props.totalTime
})

const overtimeSeconds = computed(() => {
  return Math.max(0, props.currentTime - props.totalTime)
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
          <div class="text-xs font-medium mb-2 text-center" :class="isOvertime ? 'text-red-400 animate-pulse' : 'text-gray-300'">
            <span v-if="isOvertime">OVERTIME</span>
            <span v-else>Progress - {{ Math.round(progressPercentage) }}%</span>
          </div>
          <ProgressBar
            :current-time="currentTime"
            :total-time="totalTime"
            :cards="cards"
            :show-labels="false"
            height="1rem"
          />
        </div>

        <!-- Time Remaining / Overtime / End Button -->
        <div class="text-white text-right flex items-center gap-4">
          <div v-if="!isOvertime">
            <div class="text-xs font-medium text-gray-300 mb-1">Remaining</div>
            <div class="text-2xl font-bold font-mono">
              {{ formatTime(timeRemaining) }}
            </div>
          </div>
          <div v-else>
            <div class="text-xs font-medium text-red-400 mb-1 animate-pulse">Overtime</div>
            <div class="text-2xl font-bold font-mono text-red-500 animate-pulse">
              +{{ formatTime(overtimeSeconds) }}
            </div>
          </div>

          <!-- END Button -->
          <Button
            variant="primary"
            size="sm"
            @click="emit('end')"
          >
            END
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
