import Taro, {Config} from '@tarojs/taro'
import {View, Text, Picker, Button, Image} from '@tarojs/components'
import moment, {Moment} from "moment";
import {ITouchEvent} from "@tarojs/components/types/common";
import {connect} from "@tarojs/redux";

import TimerComponent from "./timer_component";
import {calendar, LunarCalendar} from "../../utils/calendar";
import assets from '../../assets';
import application from "../../utils/Application";
import ThemePage from "../ThemePage";
import * as service from './service';
import {createAction} from "../../utils";
import DateDetail from "./DateDetail";
import WordCard from "../../components/WordCard";
import TaroButton from "../../components/TaroButton";
import styles from './index.module.scss';

const systemInfo = Taro.getSystemInfoSync();
const gridItemWidth = (systemInfo.screenWidth - 10) / 7;
const textPrimaryColor = '#333333';
const Event = {
  HOLIDAY: 'HOLIDAY',
  WORKING_DAY: 'WORKING_DAY',
}

moment.updateLocale("zh", { week: {
    dow: 1, // 星期的第一天是星期一
    // doy: 7  // 年份的第一周必须包含1月1日 (7 + 1 - 1)
  }});

@connect(({ global, home, words }) => ({ global, home, words }))
class Index extends ThemePage {

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
  }

  state = {
    _table: [],
    _holidaysMap: {}, // Taro.getStorageSync(DATA_KEY) ||
    _auntFloMap: {}, /// Taro.getStorageSync(EVENT_DATA_KEY) || {},
  }
  _timer;
  _touchStartEvent;

  _onDayClick = (dayMoment) => {
    const { dispatch } = this.props;
    dispatch(createAction('home/save')({
      selectedMoment: dayMoment,
    }));
    Taro.vibrateShort();
  }

  _backToToday = () => {
    this._onSelectYearAndMonth({ type: 'change', detail: {
        value: moment().format('YYYY-MM-DD') }});
  }

  _momentToLunarCalendar = (dayMoment: Moment): LunarCalendar => {
    return calendar.solar2lunar(dayMoment.year(), dayMoment.month() + 1, dayMoment.date())
  }

  _onSelectYearAndMonth = (date) => {
    date.type = "change";
    const { dispatch } = this.props;
    dispatch(createAction('home/selectYearAndMonth')({ date }));
  }

  _onCalendarBodyTouchStart = (event: ITouchEvent) => {
    if (event.type === 'touchstart') {
      this._touchStartEvent = event;
    }
  }

  _onCalendarBodyTouchMove = (event: ITouchEvent) => {
    // if (event.type === "touchmove") {
    //   this._touchStartEvent = event;
    // }
  }

  _onCalendarBodyTouchEnd = (event: ITouchEvent) => {
    if (event.type === "touchend" && this._touchStartEvent != null) {
      const startX = this._touchStartEvent.changedTouches[0].clientX;
      const endX = event.changedTouches[0].clientX;
      if (Math.abs(startX - endX) > 50) {
        const { home: { selectedMoment }} = this.props;
        if (startX > endX) {
          const newMoment = selectedMoment.clone();
          newMoment.add(1, 'month');
          this._onSelectYearAndMonth({ type: 'change', detail: {
            value: newMoment.format('YYYY-MM-DD') }});
        } else {
          const newMoment = selectedMoment.clone();
          newMoment.subtract(1, 'month');
          this._onSelectYearAndMonth({ type: 'change', detail: {
              value: newMoment.format('YYYY-MM-DD') }});
        }
      }
    }
    this._touchStartEvent = null;
  }

  _onLongPressCalendar = (dayMoment: Moment) => {
    if (!(application.setting.isAuntFloEnabled)) {
      return;
    }
    const actionList = [
      '大姨妈来了'
    ];
    const mapKey = `${dayMoment.year()}-${dayMoment.month() + 1}-${dayMoment.date()}`;
    const { home: { auntFloMap: _auntFloMap } } = this.props;
    if (_auntFloMap && _auntFloMap[mapKey]) {
      actionList[0] = "大姨妈没来";
    }
    if (actionList.length > 0) {
      Taro.showActionSheet({
        itemList: actionList,
        success: ({ tapIndex, errMsg}: { tapIndex: number, errMsg: string }) => {
          console.log('errMsg', errMsg);
          if (actionList[tapIndex] === "大姨妈来了") {
            const data = {
              content: '大姨妈来了',
              status: 'done',
              'notify_at': dayMoment.toISOString(),
            };
            service.event.post(data).then((result) => {
              _auntFloMap[mapKey] = {
                ...result,
              };
              this.setState({
                _auntFloMap,
              });
            }).catch((error) => console.log("error",error));
            _auntFloMap[mapKey] = data;
          } else {
            service.event.delete(_auntFloMap[mapKey].id);
            _auntFloMap[mapKey] = null;
          }
          this.setState({
            _auntFloMap,
          });
        },
      });
    }
  }

  _fetchEvent = () => {
    const { dispatch } = this.props;
    dispatch(createAction('home/fetchEvent')({}));
  }

  _qrCodeLogin = () => {
    if (Taro.getEnv() !== Taro.ENV_TYPE.WEAPP) return;
    const { dispatch } = this.props;
    const { params: { scene }} = this.$router;
    dispatch(createAction('global/handleQrCode')({
      scene,
    }));
  }

  _fetchWords = () => {
    const { dispatch } = this.props;
    dispatch(createAction('words/fetch')({}));
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

  _login = () => {
    const { dispatch } = this.props;
    dispatch(createAction('home/login')({
      callback: () => {
        this._fetchEvent();
        this._qrCodeLogin();
      },
    }));
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
    this._fetch();
    // this._login();
    this._fetchEvent();
    this._qrCodeLogin();
    this._fetchWords();
    /// debug
    // Taro.navigateTo({ url: '/pages/setting/index' });
    // Taro.navigateTo({ url: '/pages/event/index' });
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
    const { global: { themePrimary }, words, home = {} } = this.props;
    const { selectedMoment = moment(), auntFloMap, table: _table = [] } = home;
    const {_holidaysMap} = this.state;
    const _selectedLunarCalendar = this._momentToLunarCalendar(selectedMoment);
    return (
      <View
        style={{
          "display": "flex",
          "width": "100%",
          "height": "100%",
          "flexDirection": "column",
          backgroundColor: '#f4f4f4',
        }}
      >
        <View
          style={{
            "display": "flex",
            "flexDirection": "row",
            "justifyContent": "space-between",
            "paddingTop": 0,
            "paddingRight": 0,
            "paddingBottom": 0,
            "paddingLeft": 0,
            "alignItems": "center",
            "backgroundColor": "white"
          }}
        >
          <Picker
            mode='date'
            onChange={this._onSelectYearAndMonth}
            value={selectedMoment.format('YYYY-MM-DD')}
            start='1950-01-01'
            end='2099-12-31'
          >
            <TaroButton>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: 'center',
                  "paddingTop": Taro.pxTransform(32),
                  "paddingRight": Taro.pxTransform(32),
                  "paddingBottom": Taro.pxTransform(32),
                  "paddingLeft": Taro.pxTransform(32),
                  "fontWeight": "bold",
                  "color": "#444444"
                }}
              >
                <Text>{selectedMoment.format('YYYY年MM月')}</Text>
                <Image
                  src='https://cdn.liuxuanping.com/baseline_keyboard_arrow_down_black_18dp.png'
                  style={{ width: Taro.pxTransform(32), height: Taro.pxTransform(32), tintColor: '#333333' }}
                />
              </View>
            </TaroButton>
          </Picker>
          <TimerComponent
            onClick={this._backToToday}
          />
        </View>
        <View style={{
          "backgroundColor": "white",
          "width": "100%",
          "display": "flex",
          "flexDirection": "row",
          "justifyContent": "center",
          "alignItems": "center",
          paddingLeft: Taro.pxTransform(10),
          paddingRight: Taro.pxTransform(10),
        }}
        >
          {application.constants.WEEK_DAY_CHINESE.map(itemString =>
            <Text
              style={{
                "display": "flex",
                "flexGrow": 1,
                "flexShrink": 1,
                "flexBasis": 0,
                "textAlign": "center",
                "justifyContent": "center",
                color: (itemString == '六' || itemString == '日') ? themePrimary : textPrimaryColor,
              }}
              key={itemString}
            >{itemString}</Text>)}
        </View>
        <View
          style={{
            "display": "flex",
            "flexDirection": "column",
            "justifyContent": "center",
            "alignItems": "center",
            "backgroundColor": "white",
            "paddingTop": Taro.pxTransform(10),
            "paddingRight": Taro.pxTransform(10),
            "paddingBottom": Taro.pxTransform(10),
            "paddingLeft": Taro.pxTransform(10)
          }}
          onTouchStart={this._onCalendarBodyTouchStart}
          onTouchMove={this._onCalendarBodyTouchMove}
          onTouchEnd={this._onCalendarBodyTouchEnd}
        >
          {_table.map((row, weekIndex) => (
            <View
              style={{
                "width": "100%",
                "display": "flex",
                "flexDirection": "row",
                "justifyContent": "center",
                "alignItems": "center"
              }}
              key={"week" + weekIndex}
            >
              {row.map((dayMoment: Moment, dayIndex) => {
                const lunarCalendar: LunarCalendar = this._momentToLunarCalendar(dayMoment);
                const isSelectedDay = selectedMoment.isSame(dayMoment, 'day');
                /// 优先显示节日，再显示农历日期
                let bottomText = '';
                if (lunarCalendar.IDayCn) {
                  bottomText = lunarCalendar.IDayCn
                  if (bottomText.trim() === '初一') {
                    bottomText = lunarCalendar.IMonthCn;
                  }
                }
                const localHoliday = lunarCalendar.festival;
                if (localHoliday) {
                  bottomText = localHoliday;
                }
                const mapKey = `${dayMoment.year()}-${dayMoment.month() + 1}-${dayMoment.date()}`;
                const holiday = _holidaysMap[mapKey];
                if (holiday && holiday['festival']) {
                  bottomText = holiday['festival'];
                }
                /// 日期的颜色
                let dateColor = textPrimaryColor;
                if (dayMoment.weekday() == 5 || dayMoment.weekday() == 6) {
                  dateColor = themePrimary;
                }
                if (holiday) {
                  if (holiday['event'] == Event.HOLIDAY) {
                    // dateColor = themePrimary;
                  }
                  /// 工作日的权重比选中的日低
                  if (holiday['event'] == Event.WORKING_DAY) {
                    dateColor = textPrimaryColor;
                  }
                }
                if (isSelectedDay) {
                  dateColor = 'white';
                }

                return (
                  <Button
                    onLongClick={(event) => {
                      console.log('onLongClick', event);
                    }}
                    onLongPress={() => this._onLongPressCalendar(dayMoment)}
                    key={"day" + dayIndex}
                    style={{
                      "display": "flex",
                      "flexDirection": "column",
                      "textAlign": "center",
                      "justifyContent": "center",
                      "alignItems": "center",
                      "borderRadius": Taro.pxTransform(8),
                      "position": "relative",
                      paddingLeft: 0,
                      paddingRight: 0,
                      paddingBottom: 0,
                      paddingTop: 0,
                      flex: 1,
                      // width: Taro.pxTransform(gridItemWidth * 2),
                      height: Taro.pxTransform(gridItemWidth * 2),
                      opacity: dayMoment.month() == selectedMoment.month() ? 1 : 0.3,
                      backgroundColor: isSelectedDay ? themePrimary : 'white',
                    }}
                    onClick={() => this._onDayClick(dayMoment)}
                  >
                    <Text
                      selectable
                      style={{
                        color: dateColor,
                        "fontWeight": "bold",
                        "fontSize": Taro.pxTransform(36)
                      }}
                    >
                      {dayMoment.date()}
                    </Text>
                    <Text
                      selectable
                      style={{
                        color: isSelectedDay ? 'white' : 'black',
                        "fontSize": Taro.pxTransform(20),
                      }}
                    >
                      {bottomText}
                    </Text>
                    {holiday && holiday['event'] == 'HOLIDAY'
                    && (
                      <Text
                        selectable
                        style={{
                          "position": "absolute",
                          "top": Taro.pxTransform(8),
                          "right": Taro.pxTransform(16),
                          "fontSize": Taro.pxTransform(20),
                          color: isSelectedDay ? 'white' : themePrimary }}
                      >
                        休
                      </Text>
                    )}
                    {holiday && holiday['event'] == 'WORKING_DAY'
                    && (
                      <Text selectable style={{
                        "position": "absolute",
                        "top": Taro.pxTransform(8),
                        "right": Taro.pxTransform(16),
                        "fontSize": Taro.pxTransform(20),
                        color: isSelectedDay ? 'white' : textPrimaryColor }}
                      >
                        班
                      </Text>
                    )}
                    {auntFloMap && auntFloMap[mapKey] && (
                      <Image
                        src={isSelectedDay ? assets.images.iconHeartWhite : assets.images.iconHeartPick}
                        style={{
                          "position": "absolute",
                          "top": Taro.pxTransform(8),
                          "left": Taro.pxTransform(16),
                          "fontSize": Taro.pxTransform(20),
                          "width": Taro.pxTransform(20),
                          "height": Taro.pxTransform(20),
                          "color": "#07C160"
                        }}
                      />
                    )}
                  </Button>
                );
              })}
            </View>
          ))}
        </View>
        <DateDetail>
          {_selectedLunarCalendar.gzYear}{application.constants.ZODIAC_SIGNS[_selectedLunarCalendar.Animal][0]}年{_selectedLunarCalendar.gzMonth}月{_selectedLunarCalendar.gzDay}日 {_selectedLunarCalendar.astro} {_selectedLunarCalendar.IMonthCn}{_selectedLunarCalendar.IDayCn} 第{selectedMoment.format('ww')}周
        </DateDetail>
        {words && words.list && words.list.length > 0 && (
          <WordCard
            onClick={(event) => { event.preventDefault();event.stopPropagation(); Taro.navigateTo({ url: '/pages/words/index' }) }}
            wordCard={words.list[0]}
            style={{}}
          />
        )}
        <View
          style={{
            position: "absolute",
            bottom: Taro.pxTransform(40),
            right: Taro.pxTransform(40),
            //animation: animal 20s infinite linear ;
            // backgroundColor: 'transparent',
            width: Taro.pxTransform(120),
            height: Taro.pxTransform(120),
            borderRadius: Taro.pxTransform(120),
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            //box-shadow: 0 6px 10px -2px rgba(0, 0, 0, 0.2), 0 12px 20px 0 rgba(0, 0, 0, 0.14), 0 2px 36px 0 rgba(0, 0, 0, 0.12);
            backgroundColor: themePrimary || "#07C160" }}
          className={styles.rightBottom}
          onClick={() => Taro.navigateTo({ url: '/pages/setting/index' })}
        >
          <Image
            src='https://cdn.liuxuanping.com/baseline_settings_white_18dp.png'
            // source={{ uri: 'https://cdn.liuxuanping.com/baseline_settings_black_18dp.png' }}
            style={{
              width: Taro.pxTransform(54),
              height: Taro.pxTransform(54),
              // tintColor: 'white',
            }}
          />
        </View>
      </View>
    )
  }
}
Index.config = {
  navigationBarTitleText: '一个日历',
  // navigationBarBackgroundColor: '#1AAD19',
  navigationBarTextStyle: 'white',
  backgroundColor: '#f4f4f4',
}
Index.navigationOptions = ({ navigation }) => {
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
export default Index;
