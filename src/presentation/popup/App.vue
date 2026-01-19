<template>
  <div class="w-[400px] min-h-[500px] bg-gradient-to-br from-purple-600 to-purple-800 text-white flex flex-col">
    <!-- Header -->
    <div class="p-5 text-center border-b border-white/20">
      <h1 class="text-lg font-semibold">
        Meet Transcript Bridge
      </h1>
      <p class="text-xs opacity-60 mt-1">
        Version {{ appStore.version }}
      </p>
    </div>

    <!-- Tabs -->
    <div class="flex border-b border-white/20">
      <button
        @click="currentTab = 'home'"
        :class="[
          'flex-1 py-3 text-sm font-medium transition-colors',
          currentTab === 'home'
            ? 'bg-white/10 border-b-2 border-white'
            : 'hover:bg-white/5'
        ]"
      >
        ホーム
      </button>
      <button
        @click="currentTab = 'settings'"
        :class="[
          'flex-1 py-3 text-sm font-medium transition-colors',
          currentTab === 'settings'
            ? 'bg-white/10 border-b-2 border-white'
            : 'hover:bg-white/5'
        ]"
      >
        設定
      </button>
    </div>

    <!-- Content -->
    <div class="flex-1 p-5 overflow-auto">
      <!-- Home Tab -->
      <div v-if="currentTab === 'home'" class="space-y-4">
        <div v-if="!isConfigured" class="bg-yellow-500/20 border border-yellow-500/50 rounded p-3 text-sm">
          <p class="font-medium mb-1">⚠️ 設定が必要です</p>
          <p class="text-xs opacity-80">
            「設定」タブから API キーと Webhook URL を入力してください。
          </p>
        </div>

        <div v-else class="bg-green-500/20 border border-green-500/50 rounded p-3 text-sm">
          <p class="font-medium mb-1">✅ 設定完了</p>
          <p class="text-xs opacity-80">
            Google Meet を開いて文字起こしを開始できます。
          </p>
        </div>

        <div class="bg-white/10 rounded p-4 space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="opacity-80">Chrome API</span>
            <span>{{ appStore.chromeApiAvailable ? '✅' : '❌' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="opacity-80">OpenAI API Key</span>
            <span>{{ appStore.openaiApiKey ? '✅' : '❌' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="opacity-80">Slack Webhook</span>
            <span>{{ appStore.slackWebhookUrl ? '✅' : '❌' }}</span>
          </div>
        </div>

        <div class="text-xs opacity-60 text-center">
          <p>Vue: {{ vueVersion }}</p>
        </div>
      </div>

      <!-- Settings Tab -->
      <div v-if="currentTab === 'settings'">
        <SettingsForm />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { version as vueVersion } from 'vue';
import { useAppStore } from '@/stores/app';
import SettingsForm from './components/SettingsForm.vue';

const appStore = useAppStore();
const currentTab = ref<'home' | 'settings'>('home');

const isConfigured = computed(() => {
  return !!(appStore.openaiApiKey && appStore.slackWebhookUrl);
});

onMounted(() => {
  // Chrome Extension API をチェック
  appStore.checkChromeApi();

  // 設定を読み込み
  if (appStore.chromeApiAvailable) {
    appStore.loadSettings();
  }

  // 設定が未完了の場合は設定タブを表示
  if (!isConfigured.value) {
    currentTab.value = 'settings';
  }
});
</script>
