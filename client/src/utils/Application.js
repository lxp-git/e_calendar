import Taro from '@tarojs/taro';
import dva  from '../dva';
import {createAction} from "./index";

class Application {
  themes = [
    { themePrimary: '#fce15c' }, { themePrimary: '#f9b550' }, { themePrimary: '#d0d958' }, { themePrimary: '#67ac5b' },
    { themePrimary: '#fc6c8d' }, { themePrimary: '#ce4646' }, { themePrimary: '#a2c2ff' }, { themePrimary: '#47a8ed' },
    { themePrimary: '#c0b8a3' }, { themePrimary: '#a6926d' }, { themePrimary: '#a590d1' }, { themePrimary: '#6b549a' },
    { themePrimary: '#ffffff' }, { themePrimary: '#999999' }, { themePrimary: '#333333' }, { themePrimary: '#000000' },
  ];
  themes0 = [
    { themePrimary: '#f44336' }, { themePrimary: '#e91e63' }, { themePrimary: '#9c27b0' }, { themePrimary: '#673ab7' },
    { themePrimary: '#3f51b5' }, { themePrimary: '#2196f3' }, { themePrimary: '#03a9f4' }, { themePrimary: '#00bcd4' },
    { themePrimary: '#009688' }, { themePrimary: '#4caf50' }, { themePrimary: '#8bc34a' }, { themePrimary: '#cddc39' },
    { themePrimary: '#ffeb3b' }, { themePrimary: '#ffc107' }, { themePrimary: '#ff9800' }, { themePrimary: '#ff5722' },
    { themePrimary: '#795548' }, { themePrimary: '#9e9e9e' }, { themePrimary: '#607d8b' }, { themePrimary: '#000000' },
  ];
  colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4',
    '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107',
    '#ff9800', '#ff5722', '#795548', '#9e9e9e', '#607d8b', '#000000'];
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
  set loginUser(newLoginUser) {
    Taro.setStorageSync('loginUser', newLoginUser);
  }
  get loginUser() {
    return Taro.getStorageSync('loginUser');
  }
  set cookiesMap(newCookiesMap) {
    Taro.setStorageSync('cookiesMap', newCookiesMap);
  }
  get cookiesMap() {
    return Taro.getStorageSync('cookiesMap') || {};
  }
  baseUrl = 'https://app.liuxuanping.com/public/api.php/calendar';
}

export default new Application();
