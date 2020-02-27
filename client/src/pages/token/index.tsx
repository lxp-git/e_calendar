import Taro, {Component, Config} from '@tarojs/taro'
import {View, Text, Picker, Button, Image} from '@tarojs/components'
import {connect} from "@tarojs/redux";
import {AtActivityIndicator} from "taro-ui";

import styles from './index.module.scss';
import ThemePage from "../ThemePage";
import { createAction } from '../../utils';

@connect(({ home, loading }) => ({ home, loading }))
export default class Index extends ThemePage {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '扫码登录',
    // navigationBarBackgroundColor: '#1AAD19',
    navigationBarTextStyle: 'white',
    backgroundColor: '#f4f4f4',
  }

  state = {
    second: 3,
    loading: true,
  }

  componentWillMount() {
  }

  _login = () => {
    const { dispatch } = this.props;
    dispatch(createAction('home/login')({
      callback: (loginUser) => {
        this._qrCodeLogin();
      },
    }));
  }

  _qrCodeLogin = () => {
    const { params: { scene = '0000000000000' }} = this.$router;
    const { dispatch } = this.props;
    dispatch(createAction('global/handleQrCode')({
      scene,
      callback: (loginUser) => {
        if (!loginUser) {
          return;
        }
        this.setState({
          loading: false,
          second: 10,
        });
        const timer = setInterval(() => {
          const { second } = this.state;
          if (second === 1) {
            clearInterval(timer);
            Taro.navigateTo({
              url: '/pages/index/index',
            });
          }
          this.setState({
            loading: false,
            second: second - 1,
          });
        }, 1000);
      }
    }));
  }

  componentDidMount() {
    this._qrCodeLogin();
  }

  render() {
    // const { loading: { models: { global = true }} } = this.props;
    const { second, loading } = this.state;

    return loading ? (
      <View
        style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          width: '100%', height: '100%',
        }}
      >
        <View
          style={{
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center',
          }}
        >
          <AtActivityIndicator size={80} />
          <View style={{ marginTop: Taro.pxTransform(40) }}>正在登录</View>
        </View>
      </View>
    ) : (
      <View className={styles.index}>
        登录成功，{second}秒后回到首页
      </View>
    );
  }
}
