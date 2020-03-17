import Taro, {Component, Config} from '@tarojs/taro';
import {Text, View} from '@tarojs/components';
import moment, {Moment} from "moment";
import {calendar, LunarCalendar} from "../../utils/calendar";

const weekMap = [
  "一","二","三","四","五","六","日",
];
let singleMoment = moment();
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
    singleMoment = moment();
    this._lunarCalendar = this._momentToLunarCalendar(singleMoment);
  }

  componentDidMount() {
    // this._fetch();
    // calendar.solar2lunar(singleMoment.year(), singleMoment.month() + 1, singleMoment.date())
  }

  componentWillUnmount() {
    Taro.setKeepScreenOn({
      keepScreenOn: false,
    });
    clearInterval(this.timer);
  }

  componentDidShow() {
    this.timer = setInterval(() => {
      singleMoment = moment();
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
      <View
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "black",
          color: "white",
          lineHeight: 1,
        }}
      >
        <Text style={{ lineHeight: 1,
          fontSize: Taro.pxTransform(28) }}
        >{moment().format('YYYY-MM-DD')} 农历{this._lunarCalendar.IMonthCn}{this._lunarCalendar.IDayCn} 星期{weekMap[moment().weekday()]}</Text>
        <View
          style={{
            lineHeight: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: 'center',
            justifyContent: 'center',
            verticalAlign: 'center',
          }}
        >
          <Text style={{ lineHeight: 1, fontSize: Taro.pxTransform(180), }}>
            {_hour}
          </Text>
          <Text
            style={{
              lineHeight: 1,
              display: "flex",
              alignSelf: "center",
              fontSize: Taro.pxTransform(180),
            }}
          >:</Text>
          <View style={{ lineHeight: 1, fontSize: Taro.pxTransform(180), }}>
            <Text
              style={{
                lineHeight: 1,
                width: Taro.pxTransform(90),
                fontSize: Taro.pxTransform(180),
              }}
            >
              {parseInt((_minute/10))}
            </Text>
            <Text
              style={{
                lineHeight: 1,
                width: Taro.pxTransform(90),
                fontSize: Taro.pxTransform(180),
              }}
            >
              {_minute%10}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignSelf: "flex-end",
              lineHeight: 1,
              fontSize: Taro.pxTransform(80),
              width: Taro.pxTransform(100),
              marginBottom: Taro.pxTransform(10),
              marginLeft: Taro.pxTransform(10),
            }}
          >
            <Text
              style={{
                width: Taro.pxTransform(50),
                lineHeight: 1,
              }}
            >
              {parseInt((_second/10))}
            </Text>
            <Text
              style={{
                width: Taro.pxTransform(50),
                lineHeight: 1,
              }}
            >
              {_second%10}
            </Text>
          </View>
        </View>
      </View>
    )
  }
}
