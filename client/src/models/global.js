import Taro from '@tarojs/taro'
import * as qs from "qs";
import application from '../utils/Application';
import * as services from '../services';
import {createAction, isLogin} from "../utils";

export default {
  namespace: 'global',
  state: {
    themePrimary: application.setting.themePrimary,
  },

  effects: {
    * changeTheme({ payload }, { call, put, select, take }) {

    },
    * fetchConfig({ payload }, { call, put, select, take }) {
      const apiResponse  = yield call(services.config, { version: application.constants.version });
      application.setting.isNoteBookEnabled = apiResponse.functions['notebook'];
    },
    * handleQrCode({ payload: { scene, callback }}, { call, put, select, take, takeLatest }) {
      if (!isLogin()) {
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

  subscriptions: {
    setup({ dispatch, history }, done) {
      dispatch(createAction('fetchConfig')());
    }
  },
};
