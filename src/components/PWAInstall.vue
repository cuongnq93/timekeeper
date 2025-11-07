<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Button from '@/components/Button.vue'

const showInstallPrompt = ref(false)
const showUpdatePrompt = ref(false)
let deferredPrompt: any = null

// Handle PWA install prompt
onMounted(() => {
  // Listen for beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    showInstallPrompt.value = true
  })

  // Hide install prompt if app is already installed
  window.addEventListener('appinstalled', () => {
    showInstallPrompt.value = false
    deferredPrompt = null
  })
})

const installPWA = async () => {
  if (!deferredPrompt) return

  deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice

  if (outcome === 'accepted') {
    showInstallPrompt.value = false
  }

  deferredPrompt = null
}

const dismissInstall = () => {
  showInstallPrompt.value = false
  deferredPrompt = null
}

const reloadApp = () => {
  window.location.reload()
}

const dismissUpdate = () => {
  showUpdatePrompt.value = false
}

// Register service worker update handler
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then((registration) => {
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            showUpdatePrompt.value = true
          }
        })
      }
    })
  })
}
</script>

<template>
  <!-- Install Prompt -->
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition-all duration-300 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-full opacity-0"
  >
    <div
      v-if="showInstallPrompt"
      class="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 shadow-2xl"
    >
      <div class="container mx-auto flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="text-3xl">📱</div>
          <div>
            <div class="font-bold text-lg">Install TimeKeeper</div>
            <div class="text-sm text-blue-100">Access quickly and work offline</div>
          </div>
        </div>
        <div class="flex gap-3">
          <Button
            variant="secondary"
            size="sm"
            @click="dismissInstall"
          >
            Later
          </Button>
          <Button
            variant="primary"
            size="sm"
            @click="installPWA"
            class="text-blue-600 hover:bg-blue-50"
          >
            Install
          </Button>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Update Available Prompt -->
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="-translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition-all duration-300 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="-translate-y-full opacity-0"
  >
    <div
      v-if="showUpdatePrompt"
      class="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-green-600 to-green-500 text-white p-4 rounded-xl shadow-2xl max-w-md w-full mx-4"
    >
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="text-2xl">🔄</div>
          <div>
            <div class="font-bold">Update Available</div>
            <div class="text-sm text-green-100">A new version is ready</div>
          </div>
        </div>
        <div class="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            @click="dismissUpdate"
          >
            Later
          </Button>
          <Button
            variant="primary"
            size="sm"
            @click="reloadApp"
            class="text-green-600 hover:bg-green-50"
          >
            Update
          </Button>
        </div>
      </div>
    </div>
  </Transition>
</template>
