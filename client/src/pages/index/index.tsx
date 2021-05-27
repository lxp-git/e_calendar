import Taro from '@tarojs/taro'
import React, { Component } from 'react'
import {View, Image, Input} from '@tarojs/components'
import moment, {Moment} from "moment";
import {connect} from "react-redux";

import {calendar, LunarCalendar} from "../../utils/calendar";
import assets from '../../assets';
import application from "../../utils/Application";
import * as service from './service';
import {createAction, isLogin} from "../../utils";
import './index.global.scss';
import BasePage from "../../components/BasePage";
import PageContainer from '../../components/PageContainer';
import WeekCalendar from './WeekCalendar';
import Drawer from "./Drawer";
import Calendar from './Calendar';
import Diary from './Diary';

moment.updateLocale("zh", { week: {
    dow: 1, // 星期的第一天是星期一
    doy: 7  // 年份的第一周必须包含1月1日 (7 + 1 - 1)
  }});

@connect(({ global, home, words }) => ({ global, home, words }))
class Index extends BasePage<any, any> {

  state = {
    isDrawerShowed: false,
    _isFunctionsModalOpened: false,
    _table: [],
    _auntFloMap: {}, /// Taro.getStorageSync(EVENT_DATA_KEY) || {},
  }
  _timer;
  _touchStartEvent;

  _onSelectYearAndMonth = (date) => {
    date.type = "change";
    const { dispatch } = this.props;
    dispatch(createAction('home/selectYearAndMonth')({ date }));
  }

  _momentToLunarCalendar = (dayMoment): LunarCalendar => {
    return calendar.solar2lunar(dayMoment.year(), dayMoment.month() + 1, dayMoment.date())
  }

  _qrCodeLogin = () => {
    if (Taro.getEnv() !== Taro.ENV_TYPE.WEAPP) return;
    const { dispatch } = this.props;
    const scene  = Taro.getCurrentInstance().router?.params.scene;
    dispatch(createAction('global/handleQrCode')({
      scene,
    }));
  }

  componentWillMount() {
  }

  componentDidMount() {
    Taro.showShareMenu({
      withShareTicket: true,
      showShareItems: [ 'qq', 'qzone', 'wechatFriends', 'wechatMoment' ],
    });

    const { dispatch } = this.props;
    dispatch(createAction('global/save')({ themePrimary: application.setting.themePrimary }));
    this._onSelectYearAndMonth({
      type: 'change',
      detail: {value: moment().format('YYYY-MM-DD')},
    });
    if (!isLogin()) {
      dispatch(createAction('home/login')({}));
    }
    // this._fetchEvent(); // 获取大姨妈以及笔记事件，在_onSelectYearAndMonth
    this._qrCodeLogin();
    /// debug
    // Taro.navigateTo({ url: '/pages/pomodoro/index' });
    // setTimeout(() => {
    //   Taro.navigateTo({ url: '/pages/event/index?date=2020-3-7' });
    // }, 1000);
    // Taro.navigateTo({ url: '/pages/clock/index' });
    // Taro.navigateTo({ url: '/pages/token/index' });
    // Taro.navigateTo({ url: '/pages/words/index' });
  }

  componentWillUnmount() {
    clearInterval(this._timer);
  }



  onShareAppMessage() {
    // console.log('obj.from', obj.from);
    return {
      path: 'pages/index/index',
      title: '一个日历，做一个简洁实用的小程序日历工具',
    }
  }

  onShareTimeline(obj) {
    return {
      title: '一个日历，做一个简洁实用的小程序日历工具',
    }
  }

  render() {
    const { global: { selectedViewModel } } = this.props;
    const {isDrawerShowed} = this.state;
    return (
      <PageContainer
        isCustomLeftButton
        onLeftButtonClick={() => {
          this.setState({ isDrawerShowed: true });
        }}
        title={selectedViewModel === 'diary' ? ({ mode }) => {
          let placeholderStyle = "font-size: 14px;";
          switch (mode) {
            case "light": placeholderStyle += "color: #dddddd;"; break;
            case "dark": placeholderStyle += "color: #d5d5d5;"; break;
          }
          return <Input placeholderStyle={placeholderStyle} placeholder='搜索你的记事...' />;
        } : "一个日历"}
        renderLeftButton={
          <Image
            style={{
              display: "flex",
              justifyContent: 'center',
              alignItems: 'center',
              width: Taro.pxTransform(44),
              height: Taro.pxTransform(44),
            }}
            src={assets.images.iconMenuWhite}
          />
        }
        style={{ height: '100%', overflow: 'hidden' }}
      >
        <View style={{ display: 'flex', flex: 1, height: '100%', flexDirection: 'column' }} >
          {/*<WeekCalendar style={{ display: "flex", flexDirection: "column", flex: 1 }} />*/}
          <View
            style={{
              display: "flex",
              flex: 1,
              width: "100%",
              height: 0,
            }}
          >
            { selectedViewModel === 'month' && <Calendar /> }
            { selectedViewModel === 'week' && <WeekCalendar /> }
            { selectedViewModel === 'diary' && <Diary /> }
          </View>
        </View>
        <Drawer isDrawerShowed={isDrawerShowed} onClose={() => { this.setState({ isDrawerShowed: false }) }} />
      </PageContainer>
    )
  }
}
// const Index = connect(({ global, home, words }) => ({ global, home, words }))(WrapComponent)
// Index.config = {};
// Index.config['navigationBarTitleText'] = "一个日历";
// Index.config['navigationBarTextStyle'] = "white";
// Index.config['backgroundColor'] = "#f4f4f4";
// WrapComponent.navigationOptions = ({ navigation }) => {
//   return ({
//     title: 'Home',
//     headerStyle: {
//       backgroundColor: application.setting.themePrimary,
//       elevation: 0,
//     },
//     headerTintColor: '#fff',
//     // headerTitleStyle: {
//     //   fontWeight: 'bold',
//     //   color: '#000',
//     // },
//   });
// }
export default Index;
