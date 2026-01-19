<template>
  <div class="w-full">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="openaiApiKey" class="block text-sm font-medium mb-1">
          OpenAI API Key
        </label>
        <input
          id="openaiApiKey"
          v-model="formData.openaiApiKey"
          type="password"
          placeholder="sk-..."
          class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-white/40"
          :class="{ 'border-red-400': errors.openaiApiKey }"
        />
        <p v-if="errors.openaiApiKey" class="text-red-300 text-xs mt-1">
          {{ errors.openaiApiKey }}
        </p>
      </div>

      <div>
        <label for="slackWebhookUrl" class="block text-sm font-medium mb-1">
          Slack Webhook URL
        </label>
        <input
          id="slackWebhookUrl"
          v-model="formData.slackWebhookUrl"
          type="password"
          placeholder="https://hooks.slack.com/services/..."
          class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-white/40"
          :class="{ 'border-red-400': errors.slackWebhookUrl }"
        />
        <p v-if="errors.slackWebhookUrl" class="text-red-300 text-xs mt-1">
          {{ errors.slackWebhookUrl }}
        </p>
      </div>

      <div v-if="successMessage" class="text-green-300 text-sm">
        {{ successMessage }}
      </div>

      <div v-if="errorMessage" class="text-red-300 text-sm">
        {{ errorMessage }}
      </div>

      <button
        type="submit"
        :disabled="isSaving"
        class="w-full py-2 px-4 bg-white text-purple-700 font-medium rounded hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {{ isSaving ? '保存中...' : '保存' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useAppStore } from '@/stores/app';

const appStore = useAppStore();

const formData = reactive({
  openaiApiKey: '',
  slackWebhookUrl: '',
});

const errors = reactive({
  openaiApiKey: '',
  slackWebhookUrl: '',
});

const isSaving = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

onMounted(() => {
  // 既存の設定を読み込み
  if (appStore.openaiApiKey) {
    formData.openaiApiKey = appStore.openaiApiKey;
  }
  if (appStore.slackWebhookUrl) {
    formData.slackWebhookUrl = appStore.slackWebhookUrl;
  }
});

function validateForm(): boolean {
  errors.openaiApiKey = '';
  errors.slackWebhookUrl = '';

  let isValid = true;

  // OpenAI API キーの検証
  if (!formData.openaiApiKey.trim()) {
    errors.openaiApiKey = 'API キーを入力してください';
    isValid = false;
  } else if (!formData.openaiApiKey.startsWith('sk-')) {
    errors.openaiApiKey = 'API キーは sk- で始まる必要があります';
    isValid = false;
  }

  // Slack Webhook URL の検証
  if (!formData.slackWebhookUrl.trim()) {
    errors.slackWebhookUrl = 'Webhook URL を入力してください';
    isValid = false;
  } else if (!formData.slackWebhookUrl.startsWith('https://hooks.slack.com/')) {
    errors.slackWebhookUrl = '正しい Slack Webhook URL を入力してください';
    isValid = false;
  }

  return isValid;
}

async function handleSubmit() {
  successMessage.value = '';
  errorMessage.value = '';

  if (!validateForm()) {
    return;
  }

  isSaving.value = true;

  try {
    await appStore.saveSettings({
      openaiApiKey: formData.openaiApiKey.trim(),
      slackWebhookUrl: formData.slackWebhookUrl.trim(),
    });

    successMessage.value = '設定を保存しました';

    // 3秒後にメッセージを消す
    setTimeout(() => {
      successMessage.value = '';
    }, 3000);
  } catch (error) {
    console.error('Failed to save settings:', error);
    errorMessage.value = '設定の保存に失敗しました';
  } finally {
    isSaving.value = false;
  }
}
</script>
