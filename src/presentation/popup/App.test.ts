import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import App from './App.vue';
import { useAppStore } from '@/stores/app';

describe('App.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('タイトルが表示される', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia()],
      },
    });

    expect(wrapper.text()).toContain('Meet Transcript Bridge');
  });

  it('Hello World メッセージが表示される', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia()],
      },
    });

    expect(wrapper.text()).toContain('Hello World with Vue 3 + Pinia!');
  });

  it('バージョン情報が表示される', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia()],
      },
    });

    expect(wrapper.text()).toContain('Version 0.1.0');
  });

  it('Vue のバージョンが表示される', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia()],
      },
    });

    expect(wrapper.text()).toMatch(/Vue: \d+\.\d+\.\d+/);
  });

  it('Chrome API の状態が表示される', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia()],
      },
    });

    const store = useAppStore();
    store.chromeApiAvailable = true;

    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Chrome API: ✅');
  });

  it('Chrome API が利用不可の場合、❌ が表示される', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia()],
      },
    });

    const store = useAppStore();
    store.chromeApiAvailable = false;

    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Chrome API: ❌');
  });

  it('マウント時に Chrome API をチェックする', () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = useAppStore();
    const checkChromeApiSpy = vi.spyOn(store, 'checkChromeApi');

    mount(App, {
      global: {
        plugins: [pinia],
      },
    });

    expect(checkChromeApiSpy).toHaveBeenCalled();
  });

  it('Chrome API が利用可能な場合、設定を読み込む', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = useAppStore();
    store.chromeApiAvailable = true;
    const loadSettingsSpy = vi.spyOn(store, 'loadSettings');

    mount(App, {
      global: {
        plugins: [pinia],
      },
    });

    // onMounted は非同期なので少し待つ
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(loadSettingsSpy).toHaveBeenCalled();
  });
});
