<script setup lang="ts">
import { computed } from 'vue'
import Button from './Button.vue'
import type { SignalCard } from '../types'

const props = defineProps<{
  show: boolean
  totalTime: number
  finalTime: number
  manualMode: boolean
  signalTimestamps: Array<{ cardIndex: number; timestamp: number }>
  cards: SignalCard[]
}>()

const emit = defineEmits<{
  close: []
  reset: []
}>()

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const overtimeSeconds = computed(() => {
  return Math.max(0, props.finalTime - props.totalTime)
})

const isOvertime = computed(() => overtimeSeconds.value > 0)

const totalDuration = computed(() => formatTime(props.finalTime))

// Create a summary of when each signal was shown
const signalSummary = computed(() => {
  return props.signalTimestamps.map(({ cardIndex, timestamp }) => ({
    card: props.cards[cardIndex],
    timestamp,
    formattedTime: formatTime(timestamp)
  }))
})

const handleClose = () => {
  emit('close')
}

const handleReset = () => {
  emit('reset')
  emit('close')
}
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="fixed inset-0 bg-black bg-opacity-90 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      @click.self="handleClose"
    >
      <div class="bg-gray-800 rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-700">
        <!-- Header -->
        <div class="text-center mb-8">
          <h2 class="text-4xl font-bold mb-2">Session Complete</h2>
          <p class="text-gray-400 text-lg">
            {{ manualMode ? 'Manual Mode' : 'Auto Mode' }}
          </p>
        </div>

        <!-- Total Time Summary -->
        <div class="bg-gray-900 rounded-xl p-6 mb-6 border border-gray-700">
          <div class="grid grid-cols-2 gap-6">
            <div class="text-center">
              <div class="text-sm text-gray-400 mb-2">Total Duration</div>
              <div class="text-4xl font-bold font-mono">{{ totalDuration }}</div>
            </div>
            <div class="text-center">
              <div class="text-sm text-gray-400 mb-2">Target Time</div>
              <div class="text-4xl font-bold font-mono">{{ formatTime(totalTime) }}</div>
            </div>
          </div>

          <!-- Overtime Warning -->
          <div v-if="isOvertime" class="mt-6 pt-6 border-t border-gray-700">
            <div class="text-center">
              <div class="text-sm text-red-400 mb-2 font-semibold">OVERTIME</div>
              <div class="text-3xl font-bold font-mono text-red-500">
                +{{ formatTime(overtimeSeconds) }}
              </div>
            </div>
          </div>
          <div v-else class="mt-6 pt-6 border-t border-gray-700">
            <div class="text-center">
              <div class="text-lg text-green-400 font-semibold">✓ Finished on time!</div>
            </div>
          </div>
        </div>

        <!-- Signal Timeline (for Manual Mode) -->
        <div v-if="manualMode && signalSummary.length > 0" class="mb-6">
          <h3 class="text-xl font-semibold mb-4">Signal Timeline</h3>
          <div class="space-y-3">
            <div
              v-for="(signal, index) in signalSummary"
              :key="index"
              class="bg-gray-900 rounded-lg p-4 border border-gray-700 flex items-center justify-between"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-4 h-4 rounded-full"
                  :style="{ backgroundColor: signal.card.backgroundColor }"
                ></div>
                <div>
                  <div class="font-semibold">{{ signal.card.title }}</div>
                  <div class="text-sm text-gray-400">{{ signal.card.message }}</div>
                </div>
              </div>
              <div class="text-2xl font-bold font-mono">
                {{ signal.formattedTime }}
              </div>
            </div>
          </div>
        </div>

        <!-- Configured Signals (for Auto Mode) -->
        <div v-if="!manualMode" class="mb-6">
          <h3 class="text-xl font-semibold mb-4">Configured Signals</h3>
          <div class="space-y-3">
            <div
              v-for="(card, index) in cards"
              :key="index"
              class="bg-gray-900 rounded-lg p-4 border border-gray-700 flex items-center justify-between"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-4 h-4 rounded-full"
                  :style="{ backgroundColor: card.backgroundColor }"
                ></div>
                <div>
                  <div class="font-semibold">{{ card.title }}</div>
                  <div class="text-sm text-gray-400">{{ card.message }}</div>
                </div>
              </div>
              <div class="text-2xl font-bold font-mono">
                {{ formatTime(card.time) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-4 mt-8">
          <Button
            variant="secondary"
            size="lg"
            @click="handleClose"
            class="flex-1"
          >
            Close
          </Button>
          <Button
            variant="primary"
            size="lg"
            @click="handleReset"
            class="flex-1"
          >
            New Session
          </Button>
        </div>
      </div>
    </div>
  </Transition>
</template>
