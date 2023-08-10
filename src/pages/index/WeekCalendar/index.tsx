import React, { CSSProperties } from 'react';
import Taro from '@tarojs/taro';
import { Button, Image, Input, ScrollView, Text, View } from "@tarojs/components";
import { connect } from "react-redux";
import { ITouchEvent } from "@tarojs/components/types/common";

import { createAction, isSameDay, formatTime, StyleSheet } from "../../../utils";
import AtFloatLayout from "../../../components/FloatLayout";
import application from "../../../utils/Application";
import assets from '../../../assets';
import { useAppSelector } from '../../../dva';

const hour24 = [0, 1, 2, 3, 4, 5,
  6, 7, 8, 9, 10, 11,
  12, 13, 14, 15,
  16, 17, 18,
  19, 20, 21, 22, 23
];
const hour24dot5 = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5,
  6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5,
  12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5,
  16, 16.5, 17, 17.5, 18, 18.5,
  19, 19.5, 20, 20.5, 21, 21.5, 22, 22.5, 23, 23.5
];
const remaining = Taro.getSystemInfoSync().screenWidth - 10;
const gridItemWidth = remaining / 8;
const gridItemHalfWidth = remaining / 16;
const gridItemWidthPx = `${gridItemWidth}px`; // Taro.pxTransform(gridItemWidth * 2);
const gridItemHalfWidthPx = `${gridItemWidth / 2}px`; // Taro.pxTransform(gridItemWidth);
const gridItemWidthX7 = gridItemWidth * 7;
let _touchStartEvent;
const styles = StyleSheet.create({
  index: {
    width: `${Taro.getSystemInfoSync().screenWidth}px`,
    // "display": "flex",
    // "flexDirection": "column",
    // "justifyContent": "center",
    // "alignItems": "center",
    // "backgroundColor": "white",
    "paddingTop": Taro.pxTransform(10),
    "paddingRight": Taro.pxTransform(10),
    "paddingBottom": Taro.pxTransform(10),
    "paddingLeft": Taro.pxTransform(10),
    boxSizing: "border-box",
    background: "white",
    // flex: 1,
  },
  header: {
    borderBottom: 'solid 1px #dddddd',
    width: '100%', display: 'flex', flexDirection: 'row',
    alignItems: 'center', paddingTop: Taro.pxTransform(20),
    paddingBottom: Taro.pxTransform(20),
  },
  headerStart: { display: "flex", flexDirection: 'column', width: 0, flex: 1, textAlign: 'center', fontSize: Taro.pxTransform(24) },
  headerItem: { display: "flex", flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
  headerItemWeek: {
    "display": "flex",
    "textAlign": "center",
    "justifyContent": "center",
    fontSize: Taro.pxTransform(32),
    color: application.constants.textPrimaryColor,
  },
  headerItemDate: {
    borderRadius: '50%',
    width: Taro.pxTransform(44),
    height: Taro.pxTransform(44)
  },
  headerItemDateText: {
    "display": "flex",
    "textAlign": "center",
    "justifyContent": "center",
    fontSize: Taro.pxTransform(32),
  },
  scroll: { flex: 1, height: '100%', display: "flex", flexDirection: "row", overflow: "scroll" },
  scrollItem: {
    background: "white",
    flex: 1,
    width: 0,
    height: `${hour24.length * gridItemWidth}px`,
    "display": "flex",
    "flexDirection": "column",
    "justifyContent": "center",
    "alignItems": "center",
    boxSizing: "border-box",
  },
  scrollItemContent: {
    flex: 1, width: gridItemWidthPx, height: gridItemHalfWidthPx,
    display: 'flex', alignItems: 'flex-end', flexDirection: "column",
    justifyContent: 'flex-end',
    boxSizing: "border-box",
    // borderLeft: 'solid 1px #dddddd',
    position: "relative",
    // top: Taro.pxTransform(-gridItemHalfWidth),
    // marginBottom: gridItemHalfWidthPx,
    // marginTop: Taro.pxTransform(-gridItemHalfWidth),
  },
  scrollItemContentText: { textAlign: 'center', position: "absolute", width: gridItemWidthPx },
  scrollItemContentTextLine: {
    boxSizing: "content-box",
    borderBottom: 'solid 1px #dddddd',
    flex: 1,
    // height: '1px',
    width: `4px`,
  },
  cell: {
    flex: 1,
    width: gridItemWidthPx,
    // height: gridItemHalfWidthPx,
    display: 'flex', alignItems: 'center',
    justifyContent: 'center',
    borderBottomStyle: 'solid',
    borderBottomColor: '#dddddd',

    // borderTop: hourIndex === 0 ? 'solid 1px #dddddd' : 'none',
    boxSizing: "border-box",
    position: 'relative',
  },
  cellText: {
    position: 'absolute', zIndex: 1, fontSize: Taro.pxTransform(20), boxSizing: "border-box", alignSelf: "center",
    justifyContent: "center", alignItems: 'center', wordBreak: 'break-all',
    paddingLeft: Taro.pxTransform(4), borderRadius: Taro.pxTransform(10),
    left: 0, top: 0, right: 0, bottom: 0, width: '100%', textAlign: 'center', paddingRight: Taro.pxTransform(4)
  },
  cellFill: {
    borderWidth: Taro.pxTransform(4),
    borderStyle: 'solid',
    borderRadius: Taro.pxTransform(10),
    boxSizing: "border-box",
    position: 'absolute',
    height: gridItemWidthPx,
    width: gridItemWidthPx,
  },
  saveView: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: Taro.pxTransform(44 * 2), paddingLeft: Taro.pxTransform(32), paddingRight: Taro.pxTransform(32) },
  saveText: { color: 'white' },
  dateDetail: { padding: Taro.pxTransform(32), paddingLeft: Taro.pxTransform(44 * 2) },
  float: { minHeight: 0 },
  floatHeader: { display: "flex", flexDirection: 'row', alignItems: 'center' },
  floatClose: { height: Taro.pxTransform(44 * 2), width: Taro.pxTransform(44 * 2), display: 'flex', justifyContent: 'center', alignItems: 'center' },
  floatCloseImage: { width: Taro.pxTransform(44), height: Taro.pxTransform(44) },
})
const oneDayInMS = 24 * 60 * 60 * 1000;
export default React.memo((props: { themePrimary: any, style?: CSSProperties, periodEventMap: any, dispatch: any, selectedWeek: any }) => {
  const { style, dispatch } = props;
  const themePrimary = useAppSelector(state => state.global.themePrimary);
  const periodEventMap = useAppSelector(state => state.event.periodEventMap);
  const tmpSelectedWeek = useAppSelector(state => state.home.selectedWeek);
  let selectedWeek: Date = tmpSelectedWeek;
  if (typeof tmpSelectedWeek === "string") {
    selectedWeek = new Date(tmpSelectedWeek);
  }

  const _onCalendarBodyTouchStart = (event: ITouchEvent) => {
    if (event.type === 'touchstart') {
      _touchStartEvent = event;
    }
  }

  const _onCalendarBodyTouchEnd = (event: ITouchEvent) => {
    if (event.type === "touchend" && _touchStartEvent != null) {
      const startX = _touchStartEvent.changedTouches[0].clientX;
      const endX = event.changedTouches[0].clientX;
      if (Math.abs(startX - endX) > 50) {
        if (startX > endX) {
          dispatch(createAction("home/save")({
            selectedWeek: new Date(selectedWeek.valueOf() + 7 * oneDayInMS),
          }));
        } else {
          dispatch(createAction("home/save")({
            selectedWeek: new Date(selectedWeek.valueOf() - 7 * oneDayInMS),
          }));
        }
      }
    }
    _touchStartEvent = null;
  }

  const [leftTop, setLeftTop] = React.useState({ left: -1, top: -1, body: { content: '' } });

  const firstDayOfCurrentWeek = new Date(selectedWeek.valueOf() - (selectedWeek.getDay() - 1) * oneDayInMS);

  const [table, setTable] = React.useState<{ [index: number]: Date } | undefined>();
  const [scrollY, setScrollY] = React.useState(0);

  const clickMoment = table?.[leftTop?.left];
  const start = formatTime(leftTop.top);
  const end = formatTime(leftTop.top + 1);
  const period = `${start} - ${end}`;

  React.useEffect(() => {
    setTimeout(() => {
      const newTable = [null, firstDayOfCurrentWeek];
      for (let i = 1; i < 7; i++) {
        newTable.push(new Date(firstDayOfCurrentWeek.valueOf() + i * oneDayInMS));
      }
      setTable(newTable);
      setScrollY(gridItemWidthX7);
    }, 0);
  }, [firstDayOfCurrentWeek, selectedWeek])

  const firstDateOfYear = new Date(selectedWeek.valueOf());
  firstDateOfYear.setMonth(1);
  firstDateOfYear.setDate(1);
  const weeksFromFirstDateOfYear = (selectedWeek.valueOf() - firstDateOfYear.valueOf()) / (7 * oneDayInMS);
  return (
    <View
      style={{ ...styles.index, ...style }}
      onTouchStart={_onCalendarBodyTouchStart}
      // onTouchMove={_onCalendarBodyTouchMove}
      onTouchEnd={_onCalendarBodyTouchEnd}
    >
      <View
        style={styles.header}
      >
        <View style={styles.headerStart} >
          <Text>{selectedWeek.getMonth() + 1}月</Text>
          <Text>第{weeksFromFirstDateOfYear.toFixed(0)}周</Text>
        </View>
        {application.constants.WEEK_DAY_CHINESE.map((itemString, index) =>
          <View key={itemString} style={styles.headerItem}>
            <Text
              style={styles.headerItemWeek}
              key={itemString}
            >{itemString}</Text>
            <View
              style={{ ...styles.headerItemDate, backgroundColor: isSameDay(table?.[index + 1], new Date()) ? themePrimary : 'white', }}
            >
              <Text
                style={{ ...styles.headerItemDateText, color: isSameDay(table?.[index + 1], new Date()) ? 'white' : application.constants.textPrimaryColor, }}
                key={itemString}
              >{table?.[index + 1]?.getDate()}</Text>
            </View>
          </View>)}
      </View>
      <ScrollView scrollTop={scrollY} scrollWithAnimation refresherEnabled enableFlex scrollY style={styles.scroll} >
        {table?.map((weekday, weekIndex) => (
          <View
            key={weekday ? weekday.getDate() : 'start'}
            style={{ ...styles.scrollItem, borderLeft: weekIndex === 0 ? 'none' : 'solid 1px #dddddd' }}
          >
            {hour24dot5.map((item: number, hourIndex) => {
              if (weekIndex === 0) {
                return (
                  <View key={item} style={styles.scrollItemContent}>
                    <Text style={{ ...styles.scrollItemContentText, top: `-${gridItemHalfWidth / 2}px` }}>
                      {(hourIndex % 2 === 0 && hourIndex !== 0) ? `${item}:00` : ''}
                    </Text>
                    {hourIndex % 2 !== 0 && hourIndex !== 47 && (<View style={styles.scrollItemContentTextLine} />)}
                  </View>
                );
              }
              let content = '';
              let height = 0;
              let periodEvent;
              if (table[weekIndex]) { /// hourIndex % 2 === 0 &&
                const date = new Date(table[weekIndex].valueOf());
                date.setHours(item);
                date.setMinutes(hourIndex % 2 === 0 ? 0 : 30);
                const currentIndex = date.toISOString();
                periodEvent = periodEventMap[currentIndex];
                if (periodEvent) {
                  content = periodEvent.content;
                  height = (new Date(periodEvent['period_end']).valueOf() - (new Date(periodEvent['period_start']).valueOf()) / 3600000) * gridItemWidth;
                }
              }
              return (
                <View
                  key={item}
                  onClick={() => {
                    setLeftTop({
                      left: weekIndex,
                      top: item,
                      body: { content: '' },
                    });
                  }}
                  style={{ ...styles.cell, borderBottomWidth: hourIndex % 2 === 1 ? Taro.pxTransform(1) : 0, color: height ? 'white' : 'transparent', }}
                >
                  <Text
                    style={{ ...styles.cellText, background: height ? themePrimary : 'transparent', height: `${height}px`, }}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setLeftTop({
                        left: weekIndex,
                        top: item,
                        body: periodEvent,
                      });
                    }}
                  >
                    {content}
                  </Text>
                </View>
              );
            })}
          </View>
        ))}
        {leftTop && leftTop.left >= 0 && leftTop.top >= 0 && (
          <View
            style={{ ...styles.cellFill, borderColor: themePrimary, left: `${leftTop.left * gridItemWidth}px`, top: `${(leftTop.top * 2) * gridItemHalfWidth}px`, }}
          />
        )}
      </ScrollView>
      <AtFloatLayout
        isOpened={leftTop && leftTop.left >= 0 && leftTop.top >= 0}
        onClose={() => setLeftTop({ left: -1, top: -1, body: { content: '' } })}
        customStyle={styles.float}
      >
        <View style={styles.floatHeader}>
          <Button
            onClick={() => {
              if (leftTop.body['id']) { /// 服务器数据
                dispatch(createAction('event/destroy')(leftTop.body));
              } else if (leftTop.body['period_start']) { /// 本地数据
                delete periodEventMap[leftTop.body['period_start']];
                dispatch(createAction('event/save')({ periodEventMap }));
              }
              setLeftTop({ left: -1, top: -1, body: { content: '' } })
            }}
          >
            <View style={styles.floatClose}>
              <Image src={leftTop.body['period_start'] ? assets.images.iconDeleteForever : assets.images.iconCloseBlack} style={styles.floatCloseImage} />
            </View>
          </Button>
          <Input value={leftTop.body.content} onInput={(event) => setLeftTop(prevState => ({ ...prevState, body: { ...prevState.body, content: event.detail.value, } }))} style={{ flex: 1 }} placeholder='请输入标题' />
          <Button
            style={{ background: themePrimary, opacity: leftTop.body.content ? 1 : 0.5 }}
            disabled={!leftTop.body.content}
            onClick={(data) => {
              const startTimeArray = start.split(':');
              const startHour = startTimeArray[0];
              const startMinute = startTimeArray[1];
              const endTimeArray = end.split(':');
              const endHour = endTimeArray[0];
              const endMinute = endTimeArray[1];
              const periodStart = new Date(clickMoment!.valueOf());
              periodStart.setHours(parseInt(startHour));
              periodStart.setMinutes(parseInt(startMinute));
              const periodEnd = new Date(clickMoment!.valueOf());
              periodEnd.setHours(parseInt(endHour));
              periodEnd.setMinutes(parseInt(endMinute));
              dispatch(createAction('event/postPeriod')({
                periodStart: periodStart.toISOString(),
                periodEnd: periodEnd.toISOString(),
                content: leftTop.body.content,
              }));
              setLeftTop({ left: -1, top: -1, body: { content: '' } });
            }}
          >
            <View style={styles.saveView}>
              <Text style={styles.saveText}>保存</Text>
            </View>
          </Button>
        </View>
        <View style={styles.dateDetail}>
          <Text>
            {leftTop.left >= 0 && `${clickMoment.month()}月${clickMoment.date()}日，星期${application.constants.WEEK_DAY_CHINESE[clickMoment.weekday()]} • ${period}`}
          </Text>
        </View>
      </AtFloatLayout>
    </View>
  );
});
