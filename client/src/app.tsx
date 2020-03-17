import Taro, { Component, Config } from '@tarojs/taro'
import {Provider} from "@tarojs/redux";
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

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/index/index',
      'pages/setting/index',
      'pages/event/index',
      'pages/clock/index',
      'pages/token/index',
      'pages/words/index',
      'pages/privacy/index',
      'pages/login/index',
      'pages/pomodoro/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: 'Calendar',
      navigationBarTextStyle: 'white',
      navigationStyle: "custom",
    },
    cloud: true,
  }

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
        <Index />
      </Provider>
    );
  }
}
Taro.render(<App />, document.getElementById('app'))
