import Taro from "@tarojs/taro";
import {Button, Image, Picker, Text, View} from "@tarojs/components";
import moment, {Moment} from "moment";
import {connect} from "@tarojs/redux";
import {ITouchEvent} from "@tarojs/components/types/common";

import {calendar, LunarCalendar} from "../../../utils/calendar";
import assets from "../../../assets";
import * as service from "../service";
import application from "../../../utils/Application";
import {createAction} from "../../../utils";
import WeekHeader from "../WeekHeader";
import DateDetail from "../DateDetail";
import WordCard from "../../../components/WordCard";
import TaroButton from "../../../components/TaroButton";
import TimerComponent from "../timer_component";
import FloatButton from "../FloatButton";

const Event = {
  HOLIDAY: 'HOLIDAY',
  WORKING_DAY: 'WORKING_DAY',
}

const systemInfo = Taro.getSystemInfoSync();
const gridItemWidth = (systemInfo.screenWidth - 10) / 7;

const _momentToLunarCalendar = (dayMoment): LunarCalendar => {
  return calendar.solar2lunar(dayMoment.year(), dayMoment.month() + 1, dayMoment.date())
}

function Calendar(props: any) {
  const { dispatch, words, home: { table: _table = [], selectedMoment: tmpSelectedMoment, auntFloMap, eventMap }, textPrimaryColor, global: { themePrimary }  } = props;
  let selectedMoment = tmpSelectedMoment;
  if (typeof tmpSelectedMoment === 'string') {
    selectedMoment = moment(tmpSelectedMoment);
  }
  const [holidaysMap, setHolidaysMap] = Taro.useState({});

  Taro.useEffect(() => {
    const fetch = () => {
      service.fetchHolidays().then((data) => {
        data.forEach(item => {
          holidaysMap[`${item['year']}-${item['month']}-${item['date']}`] = item;
        });
        setHolidaysMap({...holidaysMap});
        // Taro.setStorageSync(DATA_KEY, holidaysMap);
        // this.setState({
        //   holidaysMap: holidaysMap,
        // });

      });
      dispatch(createAction('words/fetch')({}));
    }
    fetch();
  }, []);

  const _onDayClick = (dayMoment) => {
    if (application.setting.isNoteBookEnabled) {
      if (selectedMoment.year() === dayMoment.year() && selectedMoment.month() === dayMoment.month() && selectedMoment.date() === dayMoment.date()) {
        Taro.navigateTo({ url: `/pages/event/index?date=${selectedMoment.year()}-${selectedMoment.month() + 1}-${selectedMoment.date()}` })
        return;
      }
    }
    dispatch(createAction('home/save')({
      selectedMoment: dayMoment,
    }));
    Taro.vibrateShort();
  }

  const _onCalendarBodyTouchStart = (event: ITouchEvent) => {
    if (event.type === 'touchstart') {
      this._touchStartEvent = event;
    }
  }

  const _onCalendarBodyTouchMove = (event: ITouchEvent) => {
    // if (event.type === "touchmove") {
    //   this._touchStartEvent = event;
    // }
  }

  const _onSelectYearAndMonth = (date) => {
    date.type = "change";
    dispatch(createAction('home/selectYearAndMonth')({ date }));
  }

  const _backToToday = (event) => {
    _onSelectYearAndMonth({ type: 'change', detail: {
        value: moment().format('YYYY-MM-DD') }});
  }

  const _onCalendarBodyTouchEnd = (event: ITouchEvent) => {
    if (event.type === "touchend" && this._touchStartEvent != null) {
      const startX = this._touchStartEvent.changedTouches[0].clientX;
      const endX = event.changedTouches[0].clientX;
      if (Math.abs(startX - endX) > 50) {
        if (startX > endX) {
          const newMoment = selectedMoment.clone();
          newMoment.add(1, 'month')
          _onSelectYearAndMonth({ type: 'change', detail: {
              value: newMoment.format('YYYY-MM-DD') }});
        } else {
          const newMoment = selectedMoment.clone();
          newMoment.subtract(1, 'month');
          _onSelectYearAndMonth({ type: 'change', detail: {
              value: newMoment.format('YYYY-MM-DD') }});
        }
      }
    }
    this._touchStartEvent = null;
  }
  const _onLongPressCalendar = (dayMoment: Moment) => {
    if (!(application.setting.isAuntFloEnabled)) {
      return;
    }
    const actionList = [
      '✅大姨妈来了'
    ];
    const mapKey = `${dayMoment.year()}-${dayMoment.month() + 1}-${dayMoment.date()}`;
    if (auntFloMap && auntFloMap[mapKey]) {
      actionList[0] = "❌大姨妈没来";
    }
    if (actionList.length > 0) {
      Taro.showActionSheet({
        itemList: actionList,
        success: ({ tapIndex, errMsg}: { tapIndex: number, errMsg: string }) => {
          if (actionList[tapIndex] === "✅大姨妈来了") {
            const data = {
              content: '大姨妈来了',
              status: 'done',
              'notify_at': dayMoment.toISOString(),
            };
            service.event.post(data).then((result) => {
              auntFloMap[mapKey] = {
                ...result,
              };
              this.setState({
                auntFloMap,
              });
            }).catch((error) => console.log("error",error));
            auntFloMap[mapKey] = data;
          } else {
            service.event.delete(auntFloMap[mapKey].id);
            delete auntFloMap[mapKey];
          }
          dispatch(createAction('home/save')({ auntFloMap }));
          // this.setState({
          //   auntFloMap,
          // });
        },
      });
    }
  }
  const _selectedLunarCalendar = _momentToLunarCalendar(selectedMoment);
  return (
    <View
      style={{
        "display": "flex",
        "flexDirection": "column",
        // width: '100%',
        width: `${Taro.getSystemInfoSync().screenWidth}px`,
        boxSizing: "border-box",
      }}
      onTouchStart={_onCalendarBodyTouchStart}
      onTouchMove={_onCalendarBodyTouchMove}
      onTouchEnd={_onCalendarBodyTouchEnd}
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
          width: '100%',
          background: "white",
        }}
      >
        <Picker
          mode='date'
          onChange={_onSelectYearAndMonth}
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
                "color": "#444444",
              }}
            >
              <Text>{selectedMoment.format('YYYY年MM月')}</Text>
              <Image
                src='https://cdn.liuxuanping.com/baseline_keyboard_arrow_down_black_18dp.png'
                style={{ width: Taro.pxTransform(32), height: Taro.pxTransform(32) }}
              />
            </View>
          </TaroButton>
        </Picker>
        <TimerComponent onTimeClick={_backToToday} />
      </View>
      <View style={{ width: '100%', boxSizing: "border-box", paddingLeft: Taro.pxTransform(10), paddingRight: Taro.pxTransform(10) }}><WeekHeader themePrimary={themePrimary} /></View>
      <View
        style={{
          "paddingTop": Taro.pxTransform(10),
          "paddingRight": Taro.pxTransform(10),
          "paddingBottom": Taro.pxTransform(10),
          "paddingLeft": Taro.pxTransform(10),
          width: '100%',
          boxSizing: "border-box",
          background: "white",
        }}
      >
        {_table.map((row, weekIndex) => (
          <View
            style={{
              "width": "100%",
              "display": "flex",
              "flexDirection": "row",
              "justifyContent": "center",
              "alignItems": "center",
              "backgroundColor": "white",
            }}
            key={"week" + weekIndex}
          >
            {row.map((dayMoment: Moment, dayIndex) => {
              if (typeof dayMoment === 'string') {
                dayMoment = moment(dayMoment);
              }
              const lunarCalendar: LunarCalendar = _momentToLunarCalendar(dayMoment);
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
              const holiday = holidaysMap[mapKey];
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
                  onLongPress={(event) => _onLongPressCalendar(dayMoment)}
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
                  onClick={(data) => _onDayClick(dayMoment)}
                >
                  <Text
                    style={{
                      color: dateColor,
                      "fontWeight": "bold",
                      "fontSize": Taro.pxTransform(36)
                    }}
                  >
                    {dayMoment.date()}
                  </Text>
                  <Text
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
                      style={{
                        "position": "absolute",
                        "top": Taro.pxTransform(8),
                        "right": Taro.pxTransform(8),
                        "fontSize": Taro.pxTransform(20),
                        color: isSelectedDay ? 'white' : themePrimary }}
                    >
                      休
                    </Text>
                  )}
                  {holiday && holiday['event'] == 'WORKING_DAY'
                  && (
                    <Text style={{
                      "position": "absolute",
                      "top": Taro.pxTransform(8),
                      "right": Taro.pxTransform(8),
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
                        "left": Taro.pxTransform(8),
                        "fontSize": Taro.pxTransform(20),
                        "width": Taro.pxTransform(20),
                        "height": Taro.pxTransform(20),
                        "color": "#07C160"
                      }}
                    />
                  )}
                  {eventMap && eventMap[mapKey] && eventMap[mapKey].content && (
                    <View
                      style={{
                        "position": "absolute",
                        "bottom": Taro.pxTransform(4),
                        boxSizing: "border-box", width: '100%',
                        paddingLeft: Taro.pxTransform(gridItemWidth / 1.8),
                        paddingRight: Taro.pxTransform(gridItemWidth / 1.8),
                      }}
                    >
                      <View
                        style={{
                          display: "flex", alignSelf: "center",
                          // "right": Taro.pxTransform(32),
                          "fontSize": Taro.pxTransform(20),
                          width: "auto", // Taro.pxTransform((gridItemWidth - 32) * 2), // Taro.pxTransform(12),
                          height: Taro.pxTransform(6),
                          borderRadius: Taro.pxTransform(12),
                          "color": "#07C160",
                          background: isSelectedDay ? 'white' : eventMap[mapKey].background
                        }}
                      />
                    </View>
                  )}
                </Button>
              );
            })}
          </View>
        ))}
      </View>
      <DateDetail
        onClick={() => {
          if (application.setting.isNoteBookEnabled) {
            Taro.navigateTo({ url: `/pages/event/index?date=${selectedMoment.year()}-${selectedMoment.month() + 1}-${selectedMoment.date()}` })
          }
        }}
      >
        {_selectedLunarCalendar.gzYear}{application.constants.ZODIAC_SIGNS[_selectedLunarCalendar.Animal][0]}年{_selectedLunarCalendar.gzMonth}月{_selectedLunarCalendar.gzDay}日 {_selectedLunarCalendar.astro} {_selectedLunarCalendar.IMonthCn}{_selectedLunarCalendar.IDayCn} 第{selectedMoment.format('ww')}周
      </DateDetail>
      {words && words.list && words.list.length > 0 && (
        <WordCard
          onClick={(event) => { event.preventDefault();event.stopPropagation(); Taro.navigateTo({ url: '/pages/words/index' }) }}
          wordCard={words.list[0]}
          style={{}}
        />
      )}
      <FloatButton />
    </View>
  );
}

export default connect(({ home, global, words }) => ({ home, global, words }))(Calendar);
