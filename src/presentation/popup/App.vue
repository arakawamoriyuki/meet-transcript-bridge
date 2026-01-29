<template>
  <div class="w-[400px] min-h-[500px] bg-gradient-to-br from-purple-600 to-purple-800 text-white flex flex-col">
    <!-- Header -->
    <div class="p-5 text-center border-b border-white/20">
      <h1 class="text-lg font-semibold">
        Stream Transcript Bridge
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
        <!-- Recording Control -->
        <div class="bg-white/10 rounded p-4">
          <div class="flex flex-col items-center space-y-3">
            <!-- Recording Status -->
            <div v-if="recordingStore.isRecording" class="flex items-center space-x-2">
              <span class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              <span class="text-sm font-medium">録音中</span>
              <span class="text-xs opacity-80">{{ formattedDuration }}</span>
            </div>
            <div v-else class="text-sm opacity-80">
              録音停止中
            </div>

            <!-- Recording Button -->
            <button
              @click="toggleRecording"
              :disabled="!isConfigured || recordingStore.isLoading"
              :class="[
                'w-full py-3 px-4 rounded font-medium transition-all',
                recordingStore.isRecording
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white',
                (!isConfigured || recordingStore.isLoading) && 'opacity-50 cursor-not-allowed'
              ]"
            >
              <span v-if="recordingStore.isLoading">
                処理中...
              </span>
              <span v-else-if="recordingStore.isRecording">
                録音を停止
              </span>
              <span v-else>
                録音を開始
              </span>
            </button>

            <!-- Error Message -->
            <div v-if="recordingStore.error" class="w-full bg-red-500/20 border border-red-500/50 rounded p-2 text-sm">
              <p class="text-red-200">{{ recordingStore.error }}</p>
            </div>
          </div>
        </div>

        <!-- Configuration Status -->
        <div v-if="!isConfigured" class="bg-yellow-500/20 border border-yellow-500/50 rounded p-3 text-sm">
          <p class="font-medium mb-1">設定が必要です</p>
          <p class="text-xs opacity-80">
            「設定」タブから API キーと Webhook URL を入力してください。
          </p>
        </div>

        <div v-else class="bg-green-500/20 border border-green-500/50 rounded p-3 text-sm">
          <p class="font-medium mb-1">設定完了</p>
          <p class="text-xs opacity-80">
            音声があるタブを開いて文字起こしを開始できます。
          </p>
        </div>

        <!-- Status Indicators -->
        <div class="bg-white/10 rounded p-4 space-y-2 text-sm">
          <div class="flex justify-between items-center">
            <span class="opacity-80">Chrome API</span>
            <span :class="appStore.chromeApiAvailable ? 'text-green-400' : 'text-red-400'">
              {{ appStore.chromeApiAvailable ? 'OK' : 'NG' }}
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="opacity-80">OpenAI API Key</span>
            <div class="flex items-center gap-2">
              <span :class="appStore.openaiApiKey ? 'text-green-400' : 'text-red-400'">
                {{ appStore.openaiApiKey ? 'OK' : 'NG' }}
              </span>
              <button
                v-if="!appStore.openaiApiKey"
                @click="currentTab = 'settings'"
                class="text-xs bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded"
              >
                設定
              </button>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <span class="opacity-80">Slack Webhook</span>
            <div class="flex items-center gap-2">
              <span :class="appStore.slackWebhookUrl ? 'text-green-400' : 'text-red-400'">
                {{ appStore.slackWebhookUrl ? 'OK' : 'NG' }}
              </span>
              <button
                v-if="!appStore.slackWebhookUrl"
                @click="currentTab = 'settings'"
                class="text-xs bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded"
              >
                設定
              </button>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <span class="opacity-80">Microphone</span>
            <div class="flex items-center gap-2">
              <span :class="micPermission === 'granted' ? 'text-green-400' : micPermission === 'denied' ? 'text-red-400' : 'text-yellow-400'">
                {{ micPermission === 'granted' ? 'OK' : micPermission === 'denied' ? 'NG' : '-' }}
              </span>
              <button
                v-if="micPermission !== 'granted'"
                @click="requestMicPermission"
                :disabled="isRequestingMic"
                class="text-xs bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded disabled:opacity-50"
              >
                {{ isRequestingMic ? '...' : '許可' }}
              </button>
            </div>
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { version as vueVersion } from 'vue';
import { useAppStore } from '@/stores/app';
import { useRecordingStore } from '@/stores/recording';
import SettingsForm from './components/SettingsForm.vue';

const appStore = useAppStore();
const recordingStore = useRecordingStore();
const currentTab = ref<'home' | 'settings'>('home');
const micPermission = ref<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');
const isRequestingMic = ref(false);
let durationInterval: ReturnType<typeof setInterval> | null = null;

const isConfigured = computed(() => {
  return !!(appStore.openaiApiKey && appStore.slackWebhookUrl);
});

async function checkMicPermission(): Promise<void> {
  try {
    const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
    micPermission.value = result.state as 'granted' | 'denied' | 'prompt';
    result.onchange = () => {
      micPermission.value = result.state as 'granted' | 'denied' | 'prompt';
    };
  } catch {
    micPermission.value = 'unknown';
  }
}

async function requestMicPermission(): Promise<void> {
  if (isRequestingMic.value) return;

  isRequestingMic.value = true;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // 権限取得後すぐにストリームを停止
    stream.getTracks().forEach(track => track.stop());
    micPermission.value = 'granted';
  } catch {
    micPermission.value = 'denied';
  } finally {
    isRequestingMic.value = false;
  }
}

const formattedDuration = computed(() => {
  const seconds = recordingStore.recordingDuration;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
});

async function toggleRecording() {
  if (recordingStore.isRecording) {
    await recordingStore.stopRecording();
  } else {
    const success = await recordingStore.startRecording();
    if (success) {
      // マイク状態を取得するため少し待ってからステータスを更新
      setTimeout(() => recordingStore.fetchStatus(), 500);
    }
  }
}

onMounted(async () => {
  // Chrome Extension API をチェック
  appStore.checkChromeApi();

  // マイク権限を確認
  await checkMicPermission();

  // 設定を読み込み
  if (appStore.chromeApiAvailable) {
    await appStore.loadSettings();
    await recordingStore.fetchStatus();
  }

  // 設定が未完了の場合は設定タブを表示
  if (!isConfigured.value) {
    currentTab.value = 'settings';
  }

  // 録音時間を更新するインターバル
  durationInterval = setInterval(() => {
    // recordingDuration は computed なので自動更新される
    // ここでは強制的に再計算させるためにダミー呼び出し
    if (recordingStore.isRecording) {
      recordingStore.recordingDuration;
    }
  }, 1000);
});

onUnmounted(() => {
  if (durationInterval) {
    clearInterval(durationInterval);
  }
});
</script>
