import React, { Component, PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
// import { persistStore, REHYDRATE } from 'redux-persist'
// import { PersistGate } from 'redux-persist/lib/integration/react'
// import { StatusBar } from "react-native";

import './app.scss'
import dva from "./dva";
import models from './models';
import {createAction} from "./utils";

const dvaApp = dva.createApp({
  initialState: { },
  models: models,
  onError(e, dispatch) {
    console.log('dva error', e);
    dispatch(createAction("sys/error")(e));
  },
});
global.dvaApp = dvaApp;
const store = global.dvaApp.getStore();
class App extends Component<PropsWithChildren> {

  componentDidMount () {
    // if (process.env.TARO_ENV === 'weapp') {
    //   Taro.cloud.init()
    // }
    // if (Taro.getEnv() === Taro.ENV_TYPE.RN) {
    //   StatusBar.setBackgroundColor(application.setting.themePrimary);
    //   StatusBar.setBarStyle('light-content');
    // }
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    );
  }
}

export default App
