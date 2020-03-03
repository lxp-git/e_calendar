import * as service from './service'

export default {
  namespace: 'setting',
  state: {
    isThemeModelOpened: false,
  },

  effects: {
    * fetch({ payload }, { call, put, select, take }) {
      // yield call(Taro.cloud.callFunction, {
      //   data: {
      //     start: (new Date()).toISOString(),
      //     end: (new Date()).toISOString(),
      //   },
      //   name: "event"
      // });
      yield call(service.fetch, {
        start: (new Date()).toISOString(),
        end: (new Date()).toISOString(),
      });
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
