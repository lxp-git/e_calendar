import Taro, {Component, Config} from '@tarojs/taro'
import {View, Text, Picker, Button, Image} from '@tarojs/components'
import styles from './index.module.scss';

// import Login from '../../components/login/index'
import moment, {Moment} from "moment";
import TimerComponent from "./timer_component";
import {calendar, LunarCalendar} from "../../utils/calendar";
import {AtIcon} from "taro-ui";
import {ITouchEvent} from "@tarojs/components/types/common";
import assets from '../../assets';
import application, {User} from "../../utils/Application";
import ThemePage from "../ThemePage";
import * as service from './service';
import {connect} from "@tarojs/redux";
import {createAction} from "../../utils";

const systemInfo = Taro.getSystemInfoSync();
const gridItemWidth = (systemInfo.screenWidth - 10) / 7;
const textPrimaryColor = '#333333';
const DATA_KEY = 'holidays';
const Event = {
  HOLIDAY: 'HOLIDAY',
  WORKING_DAY: 'WORKING_DAY',
}
const WEEK_DAY_CHINESE = ['一', '二', '三', '四', '五', '六', '日'];
const ZODIAC_SIGNS = {
  "鼠": ['🐭','🐁','🐀'],
  "牛": ['🐮','🐃','🐂','🐄'],
  "虎": ['🐯','🐅'],
  "兔": ['🐰','🐇'],
  "龙": ['🐲','🐉'],
  "蛇": ['🐍'],
  "马": ['🐴','🐎'],
  "羊": ['🐏','🐑','🐐'],
  "猴": ['🐵','🐒'],
  "鸡": ['🐔','🐓'],
  "狗": ['🐶','🐕'],
  "猪": ['🐷','🐖'],
};
moment.updateLocale("zh", { week: {
    dow: 1, // 星期的第一天是星期一
    // doy: 7  // 年份的第一周必须包含1月1日 (7 + 1 - 1)
  }});

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
    navigationBarTitleText: '一个日历',
    // navigationBarBackgroundColor: '#1AAD19',
    navigationBarTextStyle: 'white',
    backgroundColor: '#f4f4f4',
  }

  state = {
    _table: [],
    _selectedMoment: moment(),
    _holidaysMap: Taro.getStorageSync(DATA_KEY) || {},
    _auntFloMap: {}, /// Taro.getStorageSync(EVENT_DATA_KEY) || {},
  }
  _timer;
  _touchStartEvent;
  _firstDayOfCurrentMonth;
  _firstRowStart;

  _onDayClick = (dayMoment) => {
    this.setState({
      _selectedMoment: dayMoment,
    });
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
    if (date.type === 'change') {
      const yearMonthDay = date.detail.value.split('-');
      const selectedNewMoment = moment().year(parseInt(yearMonthDay[0]))
        .month(parseInt(yearMonthDay[1]) - 1)
        .date(parseInt(yearMonthDay[2]));
      this._onDayClick(selectedNewMoment);

      this._firstDayOfCurrentMonth = selectedNewMoment.clone().startOf('month');
      const dayInMonth = this._firstDayOfCurrentMonth.clone().weekday();
      this._firstRowStart = this._firstDayOfCurrentMonth.clone().subtract(dayInMonth, 'day');
      const table = [[
        selectedNewMoment,
      ]];
      const indexMoment = this._firstRowStart.clone();
      for (let week = 0; week < 5; week++) {
        table[week] = [];
        for (let day = 0; day < 7; day++) {
          table[week][day] = indexMoment.clone();
          indexMoment.add(1, 'day')
        }
      }
      this.setState({
        _table: table,
      });

      this._fetchEvent();
    }
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
        if (startX > endX) {
          const newMoment = this.state._selectedMoment.clone();
          newMoment.add(1, 'month');
          this._onSelectYearAndMonth({ type: 'change', detail: {
            value: newMoment.format('YYYY-MM-DD') }});
        } else {
          const newMoment = this.state._selectedMoment.clone();
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
    const { _auntFloMap } = this.state;
    if (_auntFloMap && _auntFloMap[mapKey]) {
      actionList[0] = "大姨妈没来";
    }
    if (actionList.length > 0) {
      Taro.showActionSheet({
        itemList: actionList,
        success: ({tapIndex,errMsg}) => {
          const { _auntFloMap } = this.state;
          if (actionList[tapIndex] === "大姨妈来了") {
            const data = {
              content: '大姨妈来了',
              status: 'done',
              notify_at: dayMoment.toISOString(),
            };
            // Taro.cloud.callFunction({
            //   data,
            //   name: "postEvent"
            // }).then(({result,errMsg}) => {
            //   _auntFloMap[mapKey] = {
            //     ...data,
            //     _id: result._id,
            //   };
            //   this.setState({
            //     _auntFloMap,
            //   });
            // }).catch((error) => console.log("error",error));
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
            // Taro.cloud.callFunction({
            //   data: {
            //     _id: _auntFloMap[mapKey]._id,
            //   },
            //   name: "deleteEvent"
            // }).then(({result,errMsg}) => {
            //
            // }).catch((error) => console.log("error",error));
            service.event.delete(_auntFloMap[mapKey].id);
            _auntFloMap[mapKey] = null;
          }
          this.setState({
            _auntFloMap,
          });
        },
      });
      // Taro.setStorageSync(EVENT_DATA_KEY, auntFloMap);
    }
    // Taro.navigateTo({
    //   url: '/pages/event/index',
    // });
  }

  _fetchEvent = () => {
    if (application.setting.isAuntFloEnabled && application.loginUser) {
      // Taro.cloud.callFunction({
      //   name: "event",
      //   data: {
      //     start: this._firstRowStart.toISOString(),
      //     end: this.state._selectedMoment.endOf('month').toISOString(),
      //   }
      // }).then(({ result: { data }}) => {
      //   const { _auntFloMap } = this.state;
      //   data.forEach(item => {
      //     const dayMoment = moment(item['notify_at']);
      //     const mapKey = `${dayMoment.year()}-${dayMoment.month() + 1}-${dayMoment.date()}`;
      //     _auntFloMap[mapKey] = item;
      //   });
      //   // Taro.setStorageSync(EVENT_DATA_KEY, auntFloMap);
      //   this.setState({
      //     _auntFloMap: _auntFloMap,
      //   });
      // });
      service.event.fetch({
        "start": this._firstRowStart.toISOString(),
        "end": this.state._selectedMoment.endOf('month').toISOString()
      }).then((data) => {
        const { _auntFloMap } = this.state;
        data.forEach(item => {
          const dayMoment = moment(item['notify_at']);
          const mapKey = `${dayMoment.year()}-${dayMoment.month() + 1}-${dayMoment.date()}`;
          _auntFloMap[mapKey] = item;
        });
        // Taro.setStorageSync(EVENT_DATA_KEY, auntFloMap);
        this.setState({
          _auntFloMap: _auntFloMap,
        });
      })
    }
  }

  _fetch = () => {
    // Taro.cloud.callFunction({
    //   name: "holidays",
    //   data: {}
    // }).then(({ result: { data }}) => {
    //   const holidaysMap = {};
    //   data.forEach(item => {
    //     holidaysMap[`${item['year']}-${item['month']}-${item['date']}`] = item;
    //   });
    //   Taro.setStorageSync(DATA_KEY, holidaysMap);
    //   this.setState({
    //     _holidaysMap: holidaysMap,
    //   });
    // })
    service.fetchHolidays().then((data) => {
      const holidaysMap = {};
      data.forEach(item => {
        holidaysMap[`${item['year']}-${item['month']}-${item['date']}`] = item;
      });
      Taro.setStorageSync(DATA_KEY, holidaysMap);
      this.setState({
        _holidaysMap: holidaysMap,
      });
    });
  }

  _login = () => {
    // Taro.cloud.callFunction({
    //   name: "login",
    //   data: {}
    // }).then(({result}) => {
    //   application.loginUser = result as User;
    // });
    const { dispatch } = this.props;
    dispatch(createAction('home/login')({
      callback: (loginUser) => {
        console.log('loginUser', loginUser);
        this._fetchEvent();
      },
    }));
  }

  componentWillMount() {
  }

  componentDidMount() {
    this._onSelectYearAndMonth({
      type: 'change',
      detail: {value: moment().format('YYYY-MM-DD')},
    });
    this._fetch();
    this._login();
    const { dispatch } = this.props;
    const { params: { scene = '' }} = this.$router;
    dispatch(createAction('global/handleQrCode')({
      scene,
    }));
    /// debug
    // Taro.navigateTo({ url: '/pages/setting/index' });
    // Taro.navigateTo({ url: '/pages/event/index' });
    // Taro.navigateTo({ url: '/pages/clock/index' });
  }

  componentWillUnmount() {
    clearInterval(this._timer);
  }
  onShareAppMessage(obj: Taro.ShareAppMessageObject): Taro.ShareAppMessageReturn {
    return {
      path: 'pages/index/index',
      title: '一个日历，有一些简单的节假日，记事，和大姨妈功能',
    }
  }

  render() {
    const { global: { themePrimary }} = this.props;
    const {_table, _selectedMoment, _holidaysMap} = this.state;
    const _selectedLunarCalendar = this._momentToLunarCalendar(_selectedMoment);
    return (
      <View className={styles.index}>
        <View className={styles.firstRow}>
          <Picker mode='date' onChange={this._onSelectYearAndMonth} value={_selectedMoment.format('YYYY-MM-DD')}>
            <View className={styles.left} onClick={this._onSelectYearAndMonth}>
              <View>{_selectedMoment.format('YYYY年MM月')}</View>
              <AtIcon value='chevron-right' size={20} className={styles.rightIcon}/>
            </View>
          </Picker>
          <TimerComponent
            onClick={this._backToToday}
          />
        </View>
        <View className={styles.header}>
          {WEEK_DAY_CHINESE.map(itemString =>
            <Text style={{
              color: (itemString == '六' || itemString == '日') ? themePrimary : textPrimaryColor,
            }} key={itemString} className={styles.headerItem}>{itemString}</Text>)}
        </View>
        <View
          className={styles.body}
          onTouchStart={this._onCalendarBodyTouchStart}
          onTouchMove={this._onCalendarBodyTouchMove}
          onTouchEnd={this._onCalendarBodyTouchEnd}
        >
          {_table.map((row, weekIndex) => (
            <View className={styles.bodyRow} key={"week" + weekIndex}>
              {row.map((dayMoment: Moment, dayIndex) => {
                const lunarCalendar: LunarCalendar = this._momentToLunarCalendar(dayMoment);
                const isSelectedDay = _selectedMoment.isSame(dayMoment, 'day');
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

                const { _auntFloMap } = this.state;
                if (_auntFloMap && _auntFloMap[mapKey]) {
                  // console.log('_auntFloMap[mapKey]', _auntFloMap[mapKey]);
                }

                return (
                  <Button
                    onLongClick={(event) => {
                      console.log('onLongClick', event);
                    }}
                    onLongPress={() => this._onLongPressCalendar(dayMoment)}
                    key={"day" + dayIndex}
                    className={styles.bodyItem}
                    style={{
                      width: gridItemWidth + 'px',
                      height: gridItemWidth + 'px',
                      opacity: dayMoment.month() == _selectedMoment.month() ? 1 : 0.3,
                      background: isSelectedDay ? themePrimary : 'white',
                    }}
                    onClick={() => this._onDayClick(dayMoment)}
                  >
                    <View
                      className={styles.day}
                      style={{ color: dateColor }}
                    >
                      {dayMoment.date()}
                    </View>
                    <View
                      className={styles.lunar}
                      style={{color: isSelectedDay ? 'white' : 'black'}}
                    >
                      {bottomText}
                    </View>
                    {holiday && holiday['event'] == 'HOLIDAY'
                    && (
                      <Text className={styles.holiday}
                        style={{ color: isSelectedDay ? 'white' : themePrimary }}>
                        休
                      </Text>
                    )}
                    {holiday && holiday['event'] == 'WORKING_DAY'
                    && (
                      <Text className={styles.holiday}
                            style={{ color: isSelectedDay ? 'white' : textPrimaryColor }}>
                        班
                      </Text>
                    )}
                    {_auntFloMap && _auntFloMap[mapKey] && (
                      <Image
                        src={isSelectedDay ? assets.images.iconHeartWhite : assets.images.iconHeartPick}
                        className={styles.eventAuntFlo}
                      />
                    )}
                  </Button>
                );
              })}
            </View>
          ))}
        </View>
        <View className={styles.card}>
          <View className={styles.selectedDetail}>
            <Text>{_selectedLunarCalendar.gzYear}{ZODIAC_SIGNS[_selectedLunarCalendar.Animal][0]}年{_selectedLunarCalendar.gzMonth}月{_selectedLunarCalendar.gzDay}日 {_selectedLunarCalendar.astro} {_selectedLunarCalendar.IMonthCn}{_selectedLunarCalendar.IDayCn} 第{_selectedMoment.format('ww')}周</Text>
            <Text></Text>
          </View>
        </View>
        {/*<View className={styles.eventBody}>*/}
        {/*  <View className={styles.eventRow}>*/}
        {/*    <Checkbox*/}
        {/*      checked*/}
        {/*      value='大姨妈来了'*/}
        {/*    />*/}
        {/*    <Text className={styles.text}>大姨妈来了</Text>*/}
        {/*  </View>*/}
        {/*  <View className={styles.eventRow}>*/}
        {/*    <Checkbox*/}
        {/*      checked*/}
        {/*      value='大姨妈来了'*/}
        {/*    />*/}
        {/*    <Text className={styles.text}>大姨妈来了</Text>*/}
        {/*  </View>*/}
        {/*</View>*/}
        {/*<Text>{"firstDayOfCurrentMonth:" + firstDayOfCurrentMonth.toDate().toLocaleString()}</Text>*/}
        {/*<Text>{"firstDayOfCurrentMonth.week:" + firstDayOfCurrentMonth.week()}</Text>*/}
        {/*<Text>{"firstDayOfCurrentMonth.weekday:" + firstDayOfCurrentMonth.weekday()}</Text>*/}
        <View style={{ background: themePrimary }} className={styles.rightBottom} onClick={() => Taro.navigateTo({ url: '/pages/setting/index' })}>
          <AtIcon value='settings' color='white' />
        </View>
      </View>
    )
  }
}
