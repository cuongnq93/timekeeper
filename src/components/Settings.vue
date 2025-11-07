<script setup lang="ts">
import { ref, watch } from 'vue'
import Button from '@/components/Button.vue'
import type { TimerConfig, SignalCard } from '@/types'
import { DEFAULT_CONFIG } from '@/types'

const props = defineProps<{
  config: TimerConfig
  show: boolean
}>()

const emit = defineEmits<{
  update: [config: TimerConfig]
  close: []
}>()

// Local copy of config
const localConfig = ref<TimerConfig>(JSON.parse(JSON.stringify(props.config)))

watch(() => props.config, (newConfig) => {
  localConfig.value = JSON.parse(JSON.stringify(newConfig))
}, { deep: true })

const formatTimeInput = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const parseTimeInput = (timeStr: string): number => {
  const parts = timeStr.split(':')
  const mins = parseInt(parts[0]) || 0
  const secs = parseInt(parts[1]) || 0
  return mins * 60 + secs
}

const updateCardTime = (index: number, timeStr: string) => {
  const seconds = parseTimeInput(timeStr)
  localConfig.value.cards[index].time = seconds
}

const updateTotalTime = (timeStr: string) => {
  localConfig.value.totalTime = parseTimeInput(timeStr)
}

const saveSettings = () => {
  emit('update', localConfig.value)
  emit('close')
}

const resetToDefault = () => {
  localConfig.value = JSON.parse(JSON.stringify(DEFAULT_CONFIG))
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
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-40"
      @click.self="emit('close')"
    >
      <div class="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-3xl font-bold">Settings</h2>
          <button
            @click="emit('close')"
            class="text-gray-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        <div class="space-y-6">
          <!-- Total Time -->
          <div>
            <label class="block text-sm font-medium mb-2">
              Total Time (MM:SS)
            </label>
            <input
              type="text"
              :value="formatTimeInput(localConfig.totalTime)"
              @input="updateTotalTime(($event.target as HTMLInputElement).value)"
              class="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="2:30"
            />
          </div>

          <!-- Signal Cards -->
          <div
            v-for="(card, index) in localConfig.cards"
            :key="index"
            class="border border-gray-700 rounded-lg p-4"
          >
            <h3 class="text-xl font-semibold mb-4">{{ card.title }}</h3>

            <div class="space-y-3">
              <!-- Time -->
              <div>
                <label class="block text-sm font-medium mb-2">
                  Show at (MM:SS)
                </label>
                <input
                  type="text"
                  :value="formatTimeInput(card.time)"
                  @input="updateCardTime(index, ($event.target as HTMLInputElement).value)"
                  class="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <!-- Message -->
              <div>
                <label class="block text-sm font-medium mb-2">
                  Message
                </label>
                <input
                  type="text"
                  v-model="card.message"
                  class="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <!-- Colors -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium mb-2">
                    Background Color
                  </label>
                  <div class="flex gap-2">
                    <input
                      type="color"
                      v-model="card.backgroundColor"
                      class="h-10 w-20 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      v-model="card.backgroundColor"
                      class="flex-1 px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium mb-2">
                    Text Color
                  </label>
                  <div class="flex gap-2">
                    <input
                      type="color"
                      v-model="card.textColor"
                      class="h-10 w-20 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      v-model="card.textColor"
                      class="flex-1 px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <!-- Preview -->
              <div
                class="p-4 rounded-lg text-center font-bold"
                :style="{
                  backgroundColor: card.backgroundColor,
                  color: card.textColor
                }"
              >
                {{ card.title }}
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-4 mt-6">
          <Button
            variant="success"
            size="md"
            @click="saveSettings"
            class="flex-1"
          >
            Save
          </Button>
          <Button
            variant="secondary"
            size="md"
            @click="resetToDefault"
          >
            Reset to Default
          </Button>
        </div>
      </div>
    </div>
  </Transition>
</template>
