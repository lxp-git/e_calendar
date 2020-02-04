// import Taro from "@tarojs/taro";

export default {
  namespace: 'event',
  state: {

  },

  effects: {
    * fetch({ payload }, { call, put, select, take }) {
      yield call(Taro.cloud.callFunction, {
        data: {
          start: (new Date()).toISOString(),
          end: (new Date()).toISOString(),
        },
        name: "event"
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
