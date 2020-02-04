import Taro, {Component, Config} from '@tarojs/taro'
import {Text, View} from '@tarojs/components'
import styles from './index.module.scss';
import {AtListItem} from "taro-ui";
import application from "../../utils/Application";
import moment, {Moment} from "moment";
import {calendar, LunarCalendar} from "../../utils/calendar";

const weekMap = [
  "一","二","三","四","五","六","日",
];
const singleMoment = moment();
export default class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationStyle: "custom",
    backgroundColor: '#000000',
    navigationBarTextStyle: "white",
    pageOrientation: "landscape",
    disableScroll: true,
  }

  state = {
    _open: false,
    _hour: singleMoment.format('HH'),
    _minute: singleMoment.format('mm'),
    _second: singleMoment.format('ss'),
    _hourMinute: singleMoment.format('HH:mm')
  }
  timer;
  _lunarCalendar;

  _fetch = () => {

  }

  componentWillMount() {
    this._lunarCalendar = this._momentToLunarCalendar(singleMoment);
  }

  componentDidMount() {
    this._fetch();
    const singleMoment = moment();
    calendar.solar2lunar(singleMoment.year(), singleMoment.month() + 1, singleMoment.date())
  }

  componentWillUnmount() {
    Taro.setKeepScreenOn({
      keepScreenOn: false,
    });
    clearInterval(this.timer);
  }

  componentDidShow() {
    this.timer = setInterval(() => {
      const singleMoment = moment();
      this.setState({
        _hour: singleMoment.format('HH'),
        _minute: singleMoment.format('mm'),
        _second: singleMoment.format('ss'),
        _hourMinute: singleMoment.format('HH:mm'),
      });
    }, 1000);
    Taro.setKeepScreenOn({
      keepScreenOn: true,
    });
  }

  componentDidHide() {
    Taro.setKeepScreenOn({
      keepScreenOn: false,
    });
    clearInterval(this.timer);
  }

  _momentToLunarCalendar = (dayMoment: Moment): LunarCalendar => {
    return calendar.solar2lunar(dayMoment.year(), dayMoment.month() + 1, dayMoment.date())
  }

  render() {
    const { _hour, _minute, _second, _hourMinute } = this.state;
    return (
      <View className={styles.index}>
        <View className={styles.date}>{moment().format('YYYY-MM-DD')} 农历{this._lunarCalendar.IMonthCn}{this._lunarCalendar.IDayCn} 星期{weekMap[moment().weekday()]}</View>
        <View className={styles.center}>
          <View className={styles.hour}>
            {_hour}
          </View>
          <View className={styles.bigSplit}>:</View>
          <View className={styles.minute}>
            <Text className={styles.minute1}>
              {parseInt((_minute/10))}
            </Text>
            <Text className={styles.minute2}>
              {_minute%10}
            </Text>
          </View>
          {/*<View className={styles.smallSplit}></View>*/}
          <View className={styles.second}>
            <View className={styles.second1}>
              {parseInt((_second/10))}
            </View>
            <View className={styles.second2}>
              {_second%10}
            </View>
          </View>
        </View>
      </View>
    )
  }
}
