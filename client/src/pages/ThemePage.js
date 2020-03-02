import Taro, {Component} from "@tarojs/taro";
import {connect} from "@tarojs/redux";

import application from '../utils/Application';

// @connect(({ global }) => ({ global }))
class ThemePage extends Component {
  componentWillReceiveProps(nextProps, nextContext) {
    // super.componentWillReceiveProps(nextProps, nextContext);
    const { global: { themePrimary: nextThemePrimary }} = nextProps;
    const { global: { themePrimary: thisThemePrimary }} = this.props;
    console.log('nextThemePrimary', nextThemePrimary);
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
    console.log('application.setting.themePrimary', application.setting.themePrimary);
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

const ConnectThemePage = connect(({ global }) => ({ global }))(ThemePage);
ConnectThemePage.navigationOptions =  ({ navigation }) => {
  return ({
    title: 'Home',
    headerStyle: {
      backgroundColor: '#07C160',
      elevation: 0,
    },
    headerTintColor: '#fff',
    // headerTitleStyle: {
    //   fontWeight: 'bold',
    //   color: '#000',
    // },
  });
}
export default ConnectThemePage;
