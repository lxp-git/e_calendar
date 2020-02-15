import Taro, {Component} from "@tarojs/taro";
import {connect} from "@tarojs/redux";

import application from '../utils/Application';

@connect(({ global }) => ({ global }))
export default class ThemePage extends Component {
  componentWillReceiveProps(nextProps, nextContext) {
    // super.componentWillReceiveProps(nextProps, nextContext);
    const { global: { themePrimary: nextThemePrimary }} = nextProps;
    const { global: { themePrimary: thisThemePrimary }} = this.props;
    if (nextThemePrimary && thisThemePrimary != nextThemePrimary) {
      Taro.setNavigationBarColor({
        // frontColor: nextThemePrimary >= '#fce15c' ? '#000000' : '#ffffff', // application.setting.themePrimary
        frontColor: '#ffffff',
        backgroundColor: nextThemePrimary,
        animation: {
          duration: 600,
          timingFunc: 'easeInOut'
        }
      }).then(res => {

      });
    }
  }

  componentDidShow() {
    Taro.setNavigationBarColor({
      // frontColor: application.setting.themePrimary >= '#fce15c' ? '#000000' : '#ffffff', // application.setting.themePrimary
      frontColor: '#ffffff',
      backgroundColor: application.setting.themePrimary,
      animation: {
        duration: 0,
        timingFunc: 'easeInOut'
      }
    }).then(res => {

    });
  }
}
