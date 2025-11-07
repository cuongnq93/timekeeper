<script setup lang="ts">
import { computed } from 'vue'
import type { SignalCard } from '../types'

const props = defineProps<{
  currentTime: number
  totalTime: number
  cards: SignalCard[]
  showLabels?: boolean // Hiển thị label thời gian hay không
  height?: string // Chiều cao của progress bar
}>()

// Tính % hiện tại
const progressPercentage = computed(() => {
  return (props.currentTime / props.totalTime) * 100
})

// Tạo các segments cho progress bar
const progressSegments = computed(() => {
  const segments: Array<{
    start: number
    end: number
    color: string
    filledPercent: number
  }> = []

  const sortedCards = [...props.cards].sort((a, b) => a.time - b.time)

  for (let i = 0; i < sortedCards.length; i++) {
    const card = sortedCards[i]
    const startTime = i === 0 ? 0 : sortedCards[i - 1].time
    const endTime = card.time

    const startPercent = (startTime / props.totalTime) * 100
    const endPercent = (endTime / props.totalTime) * 100
    const currentPercent = (props.currentTime / props.totalTime) * 100

    let filledPercent = 0
    if (currentPercent >= endPercent) {
      filledPercent = 100
    } else if (currentPercent > startPercent) {
      const segmentWidth = endPercent - startPercent
      const filledWidth = currentPercent - startPercent
      filledPercent = (filledWidth / segmentWidth) * 100
    }

    segments.push({
      start: startPercent,
      end: endPercent,
      color: card.backgroundColor,
      filledPercent
    })
  }

  // Thêm segment cuối
  if (sortedCards.length > 0) {
    const lastCard = sortedCards[sortedCards.length - 1]
    const startTime = lastCard.time

    const startPercent = (startTime / props.totalTime) * 100
    const endPercent = 100
    const currentPercent = (props.currentTime / props.totalTime) * 100

    let filledPercent = 0
    if (currentPercent >= endPercent) {
      filledPercent = 100
    } else if (currentPercent > startPercent) {
      const segmentWidth = endPercent - startPercent
      const filledWidth = currentPercent - startPercent
      filledPercent = (filledWidth / segmentWidth) * 100
    }

    segments.push({
      start: startPercent,
      end: endPercent,
      color: lastCard.backgroundColor,
      filledPercent
    })
  }

  return segments
})

// Current indicator color
const currentIndicatorColor = computed(() => {
  const sortedCards = [...props.cards].sort((a, b) => a.time - b.time)

  for (let i = sortedCards.length - 1; i >= 0; i--) {
    if (props.currentTime >= sortedCards[i].time) {
      return sortedCards[i].backgroundColor
    }
  }

  return sortedCards[0]?.backgroundColor || '#22c55e'
})

// Time markers
const timeMarkers = computed(() => {
  return props.cards.map(card => ({
    position: (card.time / props.totalTime) * 100,
    label: formatTime(card.time),
    color: card.backgroundColor
  }))
})

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
</script>

<template>
  <div class="w-full relative" :class="showLabels ? 'mb-8' : ''">
    <div class="w-full relative" :style="{ height: height || '1.5rem' }">
      <!-- Background layer -->
      <div class="absolute inset-0 bg-gray-700 rounded-full"></div>

      <!-- Segments layer -->
      <div class="absolute inset-0 rounded-full flex overflow-hidden">
        <div
          v-for="(segment, index) in progressSegments"
          :key="'segment-' + index"
          class="h-full relative"
          :style="{ width: `${segment.end - segment.start}%` }"
        >
          <!-- Background màu nhạt -->
          <div
            class="absolute inset-0 transition-opacity duration-300"
            :style="{
              backgroundColor: segment.color,
              opacity: 0.3
            }"
          ></div>
          <!-- Fill màu đậm theo % -->
          <div
            class="absolute top-0 left-0 h-full transition-all duration-300"
            :style="{
              width: `${segment.filledPercent}%`,
              backgroundColor: segment.color,
              opacity: 1
            }"
          ></div>
        </div>
      </div>

      <!-- Progress Indicator -->
      <div
        class="absolute top-0 bottom-0 flex items-center transition-all duration-300 z-10"
        :style="{ left: `${progressPercentage}%`, transform: 'translateX(-50%)' }"
      >
        <div
          class="rounded-full border-2 border-white shadow-lg"
          :class="showLabels ? 'w-3 h-3' : 'w-2 h-2'"
          :style="{ backgroundColor: currentIndicatorColor, borderWidth: showLabels ? '2px' : '1px' }"
        ></div>
      </div>

      <!-- Time Markers -->
      <div
        v-for="(marker, index) in timeMarkers"
        :key="'marker-' + index"
        class="absolute flex flex-col items-center z-10"
        :style="{
          left: `${marker.position}%`,
          transform: 'translateX(-50%)',
          top: '10%',
          bottom: '10%'
        }"
      >
        <!-- Marker line với padding để tránh bo góc -->
        <div
          class="w-0.5 h-full opacity-50"
          :style="{ backgroundColor: marker.color }"
        ></div>
        <!-- Marker dot -->
        <div
          class="rounded-full border-2 border-white absolute"
          :class="showLabels ? 'w-3 h-3' : 'w-2 h-2'"
          :style="{
            backgroundColor: marker.color,
            top: '50%',
            transform: 'translateY(-50%)',
            borderWidth: showLabels ? '2px' : '1px'
          }"
        ></div>
        <!-- Marker label -->
        <div
          v-if="showLabels"
          class="absolute text-xs text-gray-400 font-medium whitespace-nowrap"
          :style="{ bottom: `calc(-1.5rem - 10%)` }"
        >
          {{ marker.label }}
        </div>
      </div>
    </div>
  </div>
</template>
