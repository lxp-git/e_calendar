import * as qs from "qs";
import application from '../utils/Application';
import * as services from '../services';

export default {
  namespace: 'global',
  state: {
    themePrimary: application.setting.themePrimary,
  },

  effects: {
    * changeTheme({ payload }, { call, put, select, take }) {

    },
    * handleQrCode({ payload: { scene }}, { call, put, select, take }) {
      if (scene) {
        const queryParamsObject = qs.parse(decodeURIComponent(scene));
        const loginUser = yield call(services.qrLogin, queryParamsObject);
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
