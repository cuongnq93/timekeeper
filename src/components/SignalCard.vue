<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { SignalCard } from '@/types'

const props = defineProps<{
  card: SignalCard
  show: boolean
}>()

const isAnimating = ref(false)

onMounted(() => {
  if (props.show) {
    isAnimating.value = true
  }
})

// Watch for show prop changes
import { watch } from 'vue'
watch(() => props.show, (newVal) => {
  isAnimating.value = newVal
})
</script>

<template>
  <Transition
    enter-active-class="card-raise"
    leave-active-class="card-lower"
    mode="out-in"
  >
    <div
      v-if="show"
      :key="card.type"
      class="fixed inset-0 z-50 flex items-center justify-center p-8 pt-32"
      :style="{
        backgroundColor: card.backgroundColor,
        color: card.textColor,
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }"
    >
      <div class="text-center max-w-4xl w-full" style="transform-style: preserve-3d;">
        <h1 class="text-9xl font-bold mb-8 drop-shadow-2xl animate-[fadeIn_0.5s_ease-out_0.3s_both]">
          {{ card.title }}
        </h1>
        <p class="text-5xl font-medium drop-shadow-lg animate-[fadeIn_0.5s_ease-out_0.5s_both]">
          {{ card.message }}
        </p>
      </div>
    </div>
  </Transition>
</template>
