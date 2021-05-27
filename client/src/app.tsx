import React, { Component } from 'react'
import { Provider } from 'react-redux'
// import { persistStore, REHYDRATE } from 'redux-persist'
// import { PersistGate } from 'redux-persist/lib/integration/react'
// import { StatusBar } from "react-native";

import Index from './pages/index';
import './app.scss'
import dva from "./dva";
import models from './models/index';
import {createAction} from "./utils";

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
  require('nerv-devtools')
}

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
class App extends Component {

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
