import Taro from '@tarojs/taro'
import * as qs from "qs";
import application from '../utils/Application';
import * as services from '../services';
import {createAction} from "../utils";

export default {
  namespace: 'global',
  state: {
    themePrimary: application.setting.themePrimary,
  },

  effects: {
    * changeTheme({ payload }, { call, put, select, take }) {

    },
    * handleQrCode({ payload: { scene, callback }}, { call, put, select, take }) {
      if (!(application.loginUser && application.loginUser.id)) {
        yield put(createAction('home/login')());
        yield take('home/login/@@end');
      }
      let loginUser;
      try {
        if (scene) {
          const queryParamsObject = qs.parse(decodeURIComponent(scene));
          loginUser = yield call(services.qrLogin, queryParamsObject);
        }
      } catch (handleQrCodeError) {
        Taro.showToast({
          duration: 1000000,
          icon: 'none',
          title: handleQrCodeError.data.message,
        });
        console.log('handleQrCodeError', handleQrCodeError);
      }
      callback && callback(loginUser);
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
