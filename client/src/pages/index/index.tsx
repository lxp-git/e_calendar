import Taro, {Config} from '@tarojs/taro'
import {View, Image} from '@tarojs/components'
import moment, {Moment} from "moment";
import {connect} from "@tarojs/redux";

import {calendar, LunarCalendar} from "../../utils/calendar";
import assets from '../../assets';
import application from "../../utils/Application";
import * as service from './service';
import {createAction, isLogin} from "../../utils";
import styles from './index.module.scss';
import BasePage from "../../components/BasePage";
import PageContainer from '../../components/PageContainer';
import WeekCalendar from './WeekCalendar';
import Drawer from "./Drawer";
import FloatButton from "./FloatButton";
import Calendar from './Calendar';

moment.updateLocale("zh", { week: {
    dow: 1, // 星期的第一天是星期一
    doy: 7  // 年份的第一周必须包含1月1日 (7 + 1 - 1)
  }});

class WrapComponent extends BasePage<any, any> {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '一个日历',
    // navigationBarBackgroundColor: '#1AAD19',
    navigationBarTextStyle: 'white',
    backgroundColor: '#f4f4f4',
    disableScroll: true,
  }

  state = {
    isDrawerShowed: false,
    _isFunctionsModalOpened: false,
    _table: [],
    _holidaysMap: {}, // Taro.getStorageSync(DATA_KEY) ||
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
    const { params: { scene }} = this.$router;
    dispatch(createAction('global/handleQrCode')({
      scene,
    }));
  }
  _fetch = () => {
    service.fetchHolidays().then((data) => {
      const holidaysMap = {};
      data.forEach(item => {
        holidaysMap[`${item['year']}-${item['month']}-${item['date']}`] = item;
      });
      // Taro.setStorageSync(DATA_KEY, holidaysMap);
      this.setState({
        _holidaysMap: holidaysMap,
      });
    });
  }

  componentWillMount() {
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(createAction('global/save')({ themePrimary: application.setting.themePrimary }));
    this._onSelectYearAndMonth({
      type: 'change',
      detail: {value: moment().format('YYYY-MM-DD')},
    });
    if (!isLogin()) {
      dispatch(createAction('home/login')({}));
    }
    this._fetch();
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

  onShareAppMessage(obj: Taro.ShareAppMessageObject): Taro.ShareAppMessageReturn {
    console.log('obj.from', obj.from);
    return {
      path: 'pages/index/index',
      title: '一个日历，有一些简单的节假日，记事，和大姨妈功能',
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
        title='一个日历'
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
          <View className={styles.fillContent}>
            { selectedViewModel === 'month' && <Calendar /> }
            { selectedViewModel === 'week' && <WeekCalendar /> }
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
WrapComponent.navigationOptions = ({ navigation }) => {
  return ({
    title: 'Home',
    headerStyle: {
      backgroundColor: application.setting.themePrimary,
      elevation: 0,
    },
    headerTintColor: '#fff',
    // headerTitleStyle: {
    //   fontWeight: 'bold',
    //   color: '#000',
    // },
  });
}
export default connect(({ global, home, words }) => ({ global, home, words }))(WrapComponent);
