import Taro from '@tarojs/taro';

class Application {
  static storageKeys = {
    auntFloEnable: false,
  }
  setting = {
    set isAuntFloEnabled(isAuntFloEnabled) {
      Taro.setStorageSync('isAuntFloEnabled', isAuntFloEnabled);
    },
    get isAuntFloEnabled() {
      return Taro.getStorageSync('isAuntFloEnabled');
    },
    set themePrimary(themePrimary) {
      Taro.setStorageSync('themePrimary', themePrimary);
    },
    get themePrimary() {
      return Taro.getStorageSync('themePrimary') || '#07C160';
    },
  }
}

export default new Application();
