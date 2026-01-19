<template>
  <div class="w-[300px] min-h-[200px] bg-gradient-to-br from-purple-600 to-purple-800 text-white">
    <div class="p-5 text-center">
      <h1 class="text-lg font-semibold mb-4">
        Meet Transcript Bridge
      </h1>
      <p class="text-sm leading-relaxed mb-2">
        Hello World with Vue 3 + Pinia! 🎉
      </p>
      <p class="text-xs opacity-80 mt-4">
        Version {{ appStore.version }}
      </p>
      <div class="mt-4 text-xs opacity-60">
        <p>Vue: {{ vueVersion }}</p>
        <p>Chrome API: {{ appStore.chromeApiAvailable ? '✅' : '❌' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { version as vueVersion } from 'vue';
import { useAppStore } from '@/stores/app';

const appStore = useAppStore();

onMounted(() => {
  // Chrome Extension API をチェック
  appStore.checkChromeApi();

  // 設定を読み込み
  if (appStore.chromeApiAvailable) {
    appStore.loadSettings();
  }
});
</script>
