import Taro, {Component, Config} from '@tarojs/taro'
import {View, Text, Picker, Button, Image} from '@tarojs/components'
import styles from './index.module.scss';

import ThemePage from "../ThemePage";
import {connect} from "@tarojs/redux";

const systemInfo = Taro.getSystemInfoSync();

@connect(({ home }) => ({ home }))
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

  componentWillMount() {
  }

  componentDidMount() {
  }

  render() {
    const { global: { themePrimary }} = this.props;
    const {_table, _selectedMoment, _holidaysMap} = this.state;
    const _selectedLunarCalendar = this._momentToLunarCalendar(_selectedMoment);
    return (
      <View className={styles.index}>
        登录成功
      </View>
    )
  }
}
