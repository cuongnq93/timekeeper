<script setup lang="ts">
const props = defineProps<{
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}>()

const emit = defineEmits<{
  click: []
}>()

const variantClasses = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-700 hover:bg-gray-600 text-white',
  success: 'bg-green-600 hover:bg-green-700 text-white',
  warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white'
}

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg'
}
</script>

<template>
  <button
    @click="emit('click')"
    :disabled="props.disabled"
    :class="[
      'rounded-lg font-semibold transition-colors cursor-pointer',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900',
      variantClasses[props.variant || 'primary'],
      sizeClasses[props.size || 'md'],
      props.disabled ? 'opacity-50 cursor-not-allowed' : ''
    ]"
  >
    <slot></slot>
  </button>
</template>
