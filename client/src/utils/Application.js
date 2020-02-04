import Taro from '@tarojs/taro';
import dva  from '../dva';
import {createAction} from "./index";

class Application {
  static storageKeys = {
    auntFloEnable: false,
  }
  setting = {
    set isAuntFloEnabled(isAuntFloEnabled) {
      Taro.setStorageSync('isAuntFloEnabled', isAuntFloEnabled);
    },
    get isAuntFloEnabled() {
      return Taro.getStorageSync('isAuntFloEnabled') || false;
    },
    set themePrimary(themePrimary) {
      dva.getDispatch()(createAction('global/save')({
        themePrimary,
      }))
      Taro.setStorageSync('themePrimary', themePrimary);
    },
    get themePrimary() {
      return Taro.getStorageSync('themePrimary') || '#07C160';
    },
  }
}

export default new Application();
