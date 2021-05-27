import React from 'react';
import Taro from "@tarojs/taro";
import {Button, Image, Text, View} from "@tarojs/components";
import moment, {Moment} from "moment";
import {connect} from "react-redux";

import {calendar, LunarCalendar} from "../../../utils/calendar";
import assets from "../../../assets";
import * as service from "../service";
import application from "../../../utils/Application";
import {createAction} from "../../../utils";

import "./index.module.scss";

const Event = {
  HOLIDAY: 'HOLIDAY',
  WORKING_DAY: 'WORKING_DAY',
}

const systemInfo = Taro.getSystemInfoSync();
const gridItemWidth = (systemInfo.screenWidth - 10) / 7;

const _momentToLunarCalendar = (dayMoment): LunarCalendar => {
  return calendar.solar2lunar(dayMoment.year(), dayMoment.month() + 1, dayMoment.date())
}

function Month(props: any) {
  const { table: _table = [], dispatch, holidaysMap, words, home: { selectedDay: tmpSelectedDay, selectedMonth: tmpSelectedMonth, auntFloMap, eventMap }, textPrimaryColor, global: { themePrimary }  } = props;
  let selectedDay = tmpSelectedDay, selectedMonth = tmpSelectedMonth;
  if (typeof tmpSelectedDay === 'string') {
    selectedDay = moment(tmpSelectedDay);
  }
  if (typeof tmpSelectedMonth === 'string') {
    selectedMonth = moment(tmpSelectedMonth);
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
    console.log('application.setting.isAuntFloEnabled', application.setting.isAuntFloEnabled);
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
          dispatch(createAction('home/save')({ auntFloMap }));
        },
      });
    }
  }
  let currentMonth: Moment;
  return (
    <View
      style={{
        "paddingTop": Taro.pxTransform(10),
        "paddingRight": Taro.pxTransform(10),
        "paddingBottom": Taro.pxTransform(10),
        "paddingLeft": Taro.pxTransform(10),
        width: '100%',
        boxSizing: "border-box",
        background: "white",
        height: (systemInfo.screenWidth - 10)/7*5+10 + 'px',
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
                  zIndex: 9,
                  // width: Taro.pxTransform(gridItemWidth * 2),
                  height: gridItemWidth + "px",
                  opacity: (currentMonth && dayMoment.month() === currentMonth.month()) ? 1 : 0.3,
                  backgroundColor: isSelectedDay ? themePrimary : 'white'
                }}
                // hoverClass={"day-hover"}
                // hoverStyle={"background: red; background-color: red"}
                onClick={(data) => _onDayClick(dayMoment)}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onLongClick={(event) => {
                    console.log('onLongClick', event);
                  }}
                  onLongPress={(event) => {
                    console.log("onLongPress", event);
                    _onLongPressCalendar(dayMoment);
                  }}
                >
                  <Text
                    style={{
                      color: dateColor,
                      "fontWeight": "bold",
                      // lineHeight: 1,
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
                        left: 0, right: 0,
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
                </View>
              </Button>
            );
          })}
        </View>
      ))}
    </View>
  );
}

export default connect(({ home, global, words }) => ({ home, global, words }))(Month);
