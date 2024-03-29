import Taro from '@tarojs/taro';
import { create } from 'dva-core';
// import { createLogger } from 'redux-logger';
import createLoading from 'dva-loading';
import { persistReducer, persistStore } from 'redux-persist'
import autoMergeLevel from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import storage from "./utils/storage";
// import application from "./utils/Application";
// import { PersistGate } from 'redux-persist/es/integration/react'

let app;
let store;
let dispatch;

const persistConfig = {
  key: 'root',
  keyPrefix: 'cache-',
  debug: true,
  blacklist: ['dva', '@@dva', 'home'],
  storage: {
    getItem(key) {
      // return new Promise(resolve => )
      // return Taro.getStorage({
      //   key,
      // });
      return new Promise((resolve) => resolve(storage.getAsync(key)));
    },
    setItem(key, args) {
      return Taro.setStorage({
        key,
        data: args,
      });
    },
    removeItem(key) {
      return Taro.removeStorage({
        key
      });
    },
  },
  stateReconciler: autoMergeLevel,
}
// const persistEnhancer = () => createStore => (reducer, initialState, enhancer) =>
//   createStore(persistReducer(persistConfig, reducer), initialState, enhancer);
const persistEnhancer = () => createStore => (reducer, initialState, enhancer) => {
  const createdStore = createStore(persistReducer(persistConfig, reducer), initialState, enhancer);
  const persist = persistStore(createdStore, null);
  return { ...createdStore, persist };
};
function createApp(opt) {
  // redux日志
  // opt.onAction = [createLogger()];
  // opt.onReducer = reducer => persistReducer(persistConfig, reducer);
  opt.extraEnhancers = [persistEnhancer()];
  // console.log('application.caches.reduxPersist', application.caches.reduxPersist);
  // opt.initialState = JSON.parse(application.caches.reduxPersist);
  // console.log('opt.initialState', opt.initialState);
  app = create(opt);
  app.use(createLoading({}));

  // 适配支付宝小程序
  if (Taro.getEnv() === Taro.ENV_TYPE.ALIPAY) {
    global = {};
  }

  if (!global.registered) opt.models.forEach(model => app.model(model));
  global.registered = true;
  app.start();

  store = app._store;
  app.getStore = () => store;

  dispatch = store.dispatch;

  app.dispatch = dispatch;
  return app;
}

export default {
  createApp,
  getDispatch() {
    return app.dispatch;
  },
  app,
};
