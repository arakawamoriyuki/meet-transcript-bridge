import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('app', () => {
  // State
  const version = ref('0.1.0');
  const chromeApiAvailable = ref(false);
  const openaiApiKey = ref<string | null>(null);
  const slackWebhookUrl = ref<string | null>(null);

  // Actions
  function checkChromeApi() {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chromeApiAvailable.value = true;
      return true;
    }
    chromeApiAvailable.value = false;
    return false;
  }

  async function loadSettings() {
    if (!chromeApiAvailable.value) {
      return;
    }

    try {
      const result = await chrome.storage.local.get(['openaiApiKey', 'slackWebhookUrl']);
      openaiApiKey.value = result.openaiApiKey || null;
      slackWebhookUrl.value = result.slackWebhookUrl || null;
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }

  async function saveSettings(settings: { openaiApiKey?: string; slackWebhookUrl?: string }) {
    if (!chromeApiAvailable.value) {
      throw new Error('Chrome API is not available');
    }

    try {
      await chrome.storage.local.set(settings);

      if (settings.openaiApiKey !== undefined) {
        openaiApiKey.value = settings.openaiApiKey;
      }
      if (settings.slackWebhookUrl !== undefined) {
        slackWebhookUrl.value = settings.slackWebhookUrl;
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw error;
    }
  }

  function clearSettings() {
    openaiApiKey.value = null;
    slackWebhookUrl.value = null;
  }

  return {
    // State
    version,
    chromeApiAvailable,
    openaiApiKey,
    slackWebhookUrl,

    // Actions
    checkChromeApi,
    loadSettings,
    saveSettings,
    clearSettings,
  };
});
