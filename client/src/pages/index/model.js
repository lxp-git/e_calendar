import Taro from '@tarojs/taro';

import * as service from './service';
import application from "../../utils/Application";

export default {
  namespace: 'home',
  state: {

  },

  effects: {
    * login({ payload: { callback } }, { call, put, select, take }) {
      if (application.loginUser.id) {
        return;
      }
      const { code }  = yield call(Taro.login);
      const data = yield call(service.user.login, {code});
      application.loginUser = data;
      callback(data);
    },
    * post({ payload }, { call, put, select, take }) {
      yield call(Taro.cloud.callFunction, {
        data: {
          content: '大姨妈来了',
          status: 'done',
        },
        name: "postEvent"
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
