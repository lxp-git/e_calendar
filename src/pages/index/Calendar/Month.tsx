import React from 'react';
import Taro from "@tarojs/taro";
import {Button, Image, Text, View} from "@tarojs/components";
import moment, {Moment} from "moment";
import {connect} from "react-redux";

import {calendar, LunarCalendar} from "../../../utils/calendar";
import assets from "../../../assets";
import * as service from "../service";
import application from "../../../utils/Application";
import {createAction, StyleSheet} from "../../../utils";

import "./index.global.scss";

const systemInfo = Taro.getSystemInfoSync();
const gridItemWidth = (systemInfo.screenWidth - 10) / 7;
const styles = StyleSheet.create({
  index: {
    "paddingTop": Taro.pxTransform(10),
    "paddingRight": Taro.pxTransform(10),
    "paddingBottom": Taro.pxTransform(10),
    "paddingLeft": Taro.pxTransform(10),
    width: '100%',
    boxSizing: "border-box",
    background: "white",
    height: (systemInfo.screenWidth - 10)/7*5+10 + 'px',
  },
  week: {
    "width": "100%",
    "display": "flex",
    "flexDirection": "row",
    "justifyContent": "center",
    "alignItems": "center",
    "backgroundColor": "white",
  },
  day: {
    "display": "flex",
    "flexDirection": "column",
    "textAlign": "center",
    "justifyContent": "center",
    "alignItems": "center",
    "position": "relative",
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingTop: 0,
    flex: 1,
    zIndex: 9,
    // width: Taro.pxTransform(gridItemWidth * 2),
    height: gridItemWidth + "px",
  },
  dayView: {
    display: "flex",
    "borderRadius": Taro.pxTransform(8),
    marginLeft: '2px', marginRight: '2px', marginTop: '2px', marginBottom: '2px',
    width: (gridItemWidth-4) + "px", height: (gridItemWidth-4) + "px",
  },
  dayViewButton: {
    display: "flex",
    "borderRadius": Taro.pxTransform(8),
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: '2px !important',
    // marginLeft: '2px', marginRight: '2px', marginTop: '2px', marginBottom: '2px',
    // paddingTop: '2px',paddingBottom: '2px',
    width: (gridItemWidth-4) + "px", height: (gridItemWidth-4) + "px",
  },
  date: {
    display: 'flex',
    "fontWeight": "bold",
    lineHeight: 1,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    "fontSize": Taro.pxTransform(36)
  },
  dateBottomText: {
    "fontSize": Taro.pxTransform(20),
    lineHeight: 1,
  },
  vacation: {
    "position": "absolute",
    "top": Taro.pxTransform(8),
    "right": Taro.pxTransform(8),
    "fontSize": Taro.pxTransform(20)
  },
  work: {
    "position": "absolute",
    "top": Taro.pxTransform(8),
    "right": Taro.pxTransform(8),
    "fontSize": Taro.pxTransform(20),
  },
  auntFlo: {
    "position": "absolute",
    "top": Taro.pxTransform(8),
    "left": Taro.pxTransform(8),
    "fontSize": Taro.pxTransform(20),
    "width": Taro.pxTransform(20),
    "height": Taro.pxTransform(20),
    "color": "#07C160"
  },
  dateBottomLineContainer: {
    // "position": "absolute",
    // "bottom": Taro.pxTransform(4),
    // left: 0, right: 0,
    marginTop: 2,
    marginBottom: 2,
    height: Taro.pxTransform(4),
    boxSizing: "border-box", width: '100%',
    paddingLeft: Taro.pxTransform(gridItemWidth / 2.5),
    paddingRight: Taro.pxTransform(gridItemWidth / 2.5),
  },
  dateBottomLine: {
    display: "flex", alignSelf: "center",
    // "right": Taro.pxTransform(32),
    "fontSize": Taro.pxTransform(20),
    // Taro.pxTransform((gridItemWidth - 32) * 2), // Taro.pxTransform(12),
    height: Taro.pxTransform(4),
    borderRadius: Taro.pxTransform(12),
    "color": "#07C160"
  }
})

const Event = {
  HOLIDAY: 'HOLIDAY',
  WORKING_DAY: 'WORKING_DAY',
}

const _momentToLunarCalendar = (dayMoment): LunarCalendar => {
  return calendar.solar2lunar(dayMoment.year(), dayMoment.month() + 1, dayMoment.date())
}

const Month = React.memo((props: any) => {
  const { selectedDay: tmpSelectedDay, auntFloMap, eventMap, table: _table = [], dispatch, holidaysMap, textPrimaryColor, themePrimary } = props;
  let selectedDay = tmpSelectedDay;
  if (typeof tmpSelectedDay === 'string') {
    selectedDay = moment(tmpSelectedDay);
  }

  const _onDayClick = (dayMoment) => {
    if (application.setting.isNoteBookEnabled) {
      if (selectedDay.year() === dayMoment.year() && selectedDay.month() === dayMoment.month() && selectedDay.date() === dayMoment.date()) {
        Taro.navigateTo({ url: `/pages/event/index?date=${selectedDay.year()}-${selectedDay.month() + 1}-${selectedDay.date()}` })
        return;
      }
    }
    dispatch(createAction('home/save')({
      selectedDay: dayMoment,
    }));
    Taro.vibrateShort();
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
            }).catch((error) => console.log("error",error));
            auntFloMap[mapKey] = data;
          } else {
            service.event.delete(auntFloMap[mapKey].id);
            delete auntFloMap[mapKey];
          }
          dispatch(createAction('home/save')({ auntFloMap: { ...auntFloMap } }));
        },
      });
    }
  }
  let currentMonth: Moment;
  return (
    <View
      style={styles.index}
    >
      {_table.map((row, weekIndex) => (
        <View
          style={styles.week}
          key={"week" + weekIndex}
        >
          {row.map((dayMoment: Moment, dayIndex) => {
            if (typeof dayMoment === 'string') {
              dayMoment = moment(dayMoment);
            }
            if (!currentMonth && dayMoment.date() === 1) {
              currentMonth = dayMoment;
            }
            const lunarCalendar: LunarCalendar = _momentToLunarCalendar(dayMoment);
            const isSelectedDay = selectedDay.isSame(dayMoment, 'day');
            /// 优先显示节日，再显示农历日期
            let bottomText = '';
            if (lunarCalendar.IDayCn) {
              bottomText = lunarCalendar.IDayCn
              if (bottomText.trim() === '初一') {
                bottomText = lunarCalendar.IMonthCn;
              }
            }
            const lunarFestival = lunarCalendar.lunarFestival;
            if (lunarFestival) {
              bottomText = lunarFestival;
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
              <View style={styles.day}>
                <View
                  style={{ ...styles.dayView,
                    opacity: (currentMonth && dayMoment.month() === currentMonth.month()) ? 1 : 0.3,
                    backgroundColor: isSelectedDay ? themePrimary : 'white', }}
                  onLongClick={(event) => {
                    console.log('onLongClick', event);
                  }}
                  onLongPress={(event) => {
                    console.log("onLongPress", event);
                    _onLongPressCalendar(dayMoment);
                  }}
                  onClick={(data) => _onDayClick(dayMoment)}
                  hoverClass='commonHover'
                >
                  <Button style={styles.dayViewButton}>
                    <Text
                      style={{ color: dateColor, ...styles.date }}
                    >
                      {dayMoment.date()}
                    </Text>
                    <Text
                      style={{ ...styles.dateBottomText, color: isSelectedDay ? 'white' : 'black' }}
                    >
                      {bottomText}
                    </Text>
                    <View
                      style={styles.dateBottomLineContainer}
                    >
                      {eventMap && eventMap[mapKey] && eventMap[mapKey].content && (
                        <View
                          style={{ ...styles.dateBottomLine, background: isSelectedDay ? 'white' : eventMap[mapKey].background }}
                        />
                      )}
                    </View>
                    {holiday && holiday['event'] == 'HOLIDAY'
                    && (
                      <Text
                        style={{ ...styles.vacation, color: isSelectedDay ? 'white' : themePrimary }}
                      >
                        休
                      </Text>
                    )}
                    {holiday && holiday['event'] == 'WORKING_DAY'
                    && (
                      <Text style={{ ...styles.work, color: isSelectedDay ? 'white' : textPrimaryColor }}>
                        班
                      </Text>
                    )}
                    {auntFloMap && auntFloMap[mapKey] && (
                      <Image
                        src={isSelectedDay ? assets.images.iconHeartWhite : assets.images.iconHeartPick}
                        style={styles.auntFlo}
                      />
                    )}
                  </Button>
                </View>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
});

export default connect(({ home: { selectedDay, auntFloMap, eventMap }, global: { themePrimary }, words }) => ({ selectedDay, auntFloMap, eventMap, themePrimary }))(Month);
