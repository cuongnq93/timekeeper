<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from '../components/Button.vue'
import type { SignalCard } from '../types'

const router = useRouter()

// Session data interface
interface SessionData {
  totalTime: number
  finalTime: number
  manualMode: boolean
  signalTimestamps: Array<{ cardIndex: number; timestamp: number }>
  cards: SignalCard[]
}

const sessionData = ref<SessionData | null>(null)

// Load session data from localStorage
onMounted(() => {
  const saved = localStorage.getItem('sessionData')
  if (saved) {
    try {
      sessionData.value = JSON.parse(saved)
    } catch {
      router.push({ name: 'timer' })
    }
  } else {
    router.push({ name: 'timer' })
  }
})

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const overtimeSeconds = computed(() => {
  if (!sessionData.value) return 0
  return Math.max(0, sessionData.value.finalTime - sessionData.value.totalTime)
})

const isOvertime = computed(() => overtimeSeconds.value > 0)

const totalDuration = computed(() => {
  if (!sessionData.value) return '00:00'
  return formatTime(sessionData.value.finalTime)
})

// Create a summary of when each signal was shown
const signalSummary = computed(() => {
  if (!sessionData.value) return []
  return sessionData.value.signalTimestamps.map(({ cardIndex, timestamp }) => ({
    card: sessionData.value!.cards[cardIndex],
    timestamp,
    formattedTime: formatTime(timestamp)
  }))
})

const handleNewSession = () => {
  // Clear session data
  localStorage.removeItem('sessionData')
  router.push({ name: 'timer' })
}

const handleBackToTimer = () => {
  router.push({ name: 'timer' })
}
</script>

<template>
  <div v-if="sessionData" class="min-h-screen bg-gray-900 text-white flex flex-col">
    <!-- Header -->
    <header class="bg-gray-800 border-b border-gray-700 p-4">
      <div class="container mx-auto">
        <h1 class="text-2xl font-bold">Session Summary</h1>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex items-center justify-center p-8">
      <div class="max-w-4xl w-full">
        <!-- Title -->
        <div class="text-center mb-8">
          <h2 class="text-5xl font-bold mb-4">Session Complete</h2>
          <p class="text-gray-400 text-2xl">
            {{ sessionData.manualMode ? 'Manual Mode' : 'Auto Mode' }}
          </p>
        </div>

        <!-- Total Time Summary -->
        <div class="bg-gray-800 rounded-2xl p-8 mb-8 border-2 border-gray-700">
          <div class="grid grid-cols-2 gap-8">
            <div class="text-center">
              <div class="text-sm text-gray-400 mb-3">Total Duration</div>
              <div class="text-6xl font-bold font-mono">{{ totalDuration }}</div>
            </div>
            <div class="text-center">
              <div class="text-sm text-gray-400 mb-3">Target Time</div>
              <div class="text-6xl font-bold font-mono">{{ formatTime(sessionData.totalTime) }}</div>
            </div>
          </div>

          <!-- Overtime Warning -->
          <div v-if="isOvertime" class="mt-8 pt-8 border-t border-gray-700">
            <div class="text-center">
              <div class="text-lg text-red-400 mb-3 font-semibold">OVERTIME</div>
              <div class="text-5xl font-bold font-mono text-red-500">
                +{{ formatTime(overtimeSeconds) }}
              </div>
            </div>
          </div>
          <div v-else class="mt-8 pt-8 border-t border-gray-700">
            <div class="text-center">
              <div class="text-2xl text-green-400 font-semibold">✓ Finished on time!</div>
            </div>
          </div>
        </div>

        <!-- Signal Timeline (for Manual Mode) -->
        <div v-if="sessionData.manualMode && signalSummary.length > 0" class="mb-8">
          <h3 class="text-2xl font-semibold mb-6">Signal Timeline</h3>
          <div class="space-y-4">
            <div
              v-for="(signal, index) in signalSummary"
              :key="index"
              class="bg-gray-800 rounded-xl p-6 border-2 border-gray-700 flex items-center justify-between hover:border-gray-600 transition-colors"
            >
              <div class="flex items-center gap-6">
                <div
                  class="w-6 h-6 rounded-full shadow-lg"
                  :style="{ backgroundColor: signal.card.backgroundColor }"
                ></div>
                <div>
                  <div class="text-xl font-semibold">{{ signal.card.title }}</div>
                  <div class="text-base text-gray-400">{{ signal.card.message }}</div>
                </div>
              </div>
              <div class="text-4xl font-bold font-mono">
                {{ signal.formattedTime }}
              </div>
            </div>
          </div>
        </div>

        <!-- Configured Signals (for Auto Mode) -->
        <div v-if="!sessionData.manualMode" class="mb-8">
          <h3 class="text-2xl font-semibold mb-6">Configured Signals</h3>
          <div class="space-y-4">
            <div
              v-for="(card, index) in sessionData.cards"
              :key="index"
              class="bg-gray-800 rounded-xl p-6 border-2 border-gray-700 flex items-center justify-between hover:border-gray-600 transition-colors"
            >
              <div class="flex items-center gap-6">
                <div
                  class="w-6 h-6 rounded-full shadow-lg"
                  :style="{ backgroundColor: card.backgroundColor }"
                ></div>
                <div>
                  <div class="text-xl font-semibold">{{ card.title }}</div>
                  <div class="text-base text-gray-400">{{ card.message }}</div>
                </div>
              </div>
              <div class="text-4xl font-bold font-mono">
                {{ formatTime(card.time) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-6 mt-10">
          <Button
            variant="secondary"
            size="lg"
            @click="handleBackToTimer"
            class="flex-1"
          >
            Back to Timer
          </Button>
          <Button
            variant="primary"
            size="lg"
            @click="handleNewSession"
            class="flex-1"
          >
            New Session
          </Button>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 border-t border-gray-700 p-4">
      <div class="container mx-auto text-center text-sm text-gray-400">
        <p>Press <kbd class="px-2 py-1 bg-gray-700 rounded">Escape</kbd> or click "Back to Timer" to return</p>
      </div>
    </footer>
  </div>
</template>
