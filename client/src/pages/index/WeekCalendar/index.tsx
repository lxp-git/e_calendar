import Taro from '@tarojs/taro';
import {Button, Image, Input, ScrollView, Text, View} from "@tarojs/components";
import {connect} from "@tarojs/redux";
import {ITouchEvent} from "@tarojs/components/types/common";
import {CSSProperties} from "react";

import {createAction, isSameDay, formatTime} from "../../../utils";
import WeekHeader from "../WeekHeader";
import AtFloatLayout from "../../../components/FloatLayout";
import moment from "moment";
import application from "../../../utils/Application";
import assets from '../../../assets';
import styles from './index.module.scss';

const hour24 = [0,1,2,3,4,5,
  6,7,8,9,10,11,
  12,13,14,15,
  16,17,18,
  19,20,21,22,23
];
const hour24dot5 = [0,0.5,1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,
  6,6.5,7,7.5,8,8.5,9,9.5,10,10.5,11,11.5,
  12,12.5,13,13.5,14,14.5,15,15.5,
  16,16.5,17,17.5,18,18.5,
  19,19.5,20,20.5,21,21.5,22,22.5,23,23.5
];
const remaining = Taro.getSystemInfoSync().screenWidth - 10;
const gridItemWidth = remaining / 8;
const gridItemHalfWidth = remaining / 16;
const gridItemWidthPx = `${gridItemWidth}px`; // Taro.pxTransform(gridItemWidth * 2);
const gridItemHalfWidthPx = `${gridItemWidth / 2}px`; // Taro.pxTransform(gridItemWidth);
function WeekCalendar(props: { global: any, style: CSSProperties, event: any, dispatch: any, home: any }) {
  const { global: { themePrimary }, event: { periodEventMap }, home: { selectedMoment: tmpSelectedMoment }, style, dispatch } = props;
  let selectedMoment = tmpSelectedMoment;
  if (typeof tmpSelectedMoment === "string") {
    selectedMoment = moment(tmpSelectedMoment);
  }
  const _onSelectWeek = (date) => {
    date.type = "change";
    const { dispatch } = this.props;
    dispatch(createAction('home/selectWeek')({ date }));
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

  const _onCalendarBodyTouchEnd = (event: ITouchEvent) => {
    if (event.type === "touchend" && this._touchStartEvent != null) {
      const startX = this._touchStartEvent.changedTouches[0].clientX;
      const endX = event.changedTouches[0].clientX;
      if (Math.abs(startX - endX) > 50) {
        if (startX > endX) {
          const newMoment = selectedMoment.clone();
          newMoment.add(1, 'week');
          this._onSelectYearAndMonth({ type: 'change', detail: {
              value: newMoment.format('YYYY-MM-DD') }});
        } else {
          const newMoment = selectedMoment.clone();
          newMoment.subtract(1, 'week');
          this._onSelectYearAndMonth({ type: 'change', detail: {
              value: newMoment.format('YYYY-MM-DD') }});
        }
      }
    }
    this._touchStartEvent = null;
  }

  const [ leftTop, setLeftTop ] = Taro.useState({ left: -1, top: -1, body: { content: '' } });

  const firstDayOfCurrentWeek = selectedMoment.clone().startOf('week');
  const table = [null, firstDayOfCurrentWeek];
  for (let i = 1; i < 7; i++) {
    table.push(firstDayOfCurrentWeek.clone().add(i, 'day'));
  }

  const clickMoment = table[leftTop.left];
  const start = formatTime(leftTop.top);
  const end = formatTime(leftTop.top + 1);
  const period = `${start} - ${end}`;

  return (
    <View
      className={styles.index}
      style={{
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
        ...style,
      }}
      onTouchStart={_onCalendarBodyTouchStart}
      onTouchMove={_onCalendarBodyTouchMove}
      onTouchEnd={_onCalendarBodyTouchEnd}
    >
      <View
        style={{
          borderBottom: 'solid 1px #dddddd',
          width: '100%', display: 'flex', flexDirection: 'row',
          alignItems: 'center', paddingTop: Taro.pxTransform(20),
          paddingBottom: Taro.pxTransform(20), }}
      >
        <View style={{ display: "flex", flexDirection: 'column', width: 0, flex: 1, textAlign: 'center', fontSize: Taro.pxTransform(24) }} >
          <Text>{selectedMoment.month()}月</Text>
          <Text>第{selectedMoment.format('ww')}周</Text>
        </View>
        {application.constants.WEEK_DAY_CHINESE.map((itemString ,index) =>
          <View key={itemString} style={{ display: "flex", flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Text
              style={{
                "display": "flex",
                "textAlign": "center",
                "justifyContent": "center",
                fontSize: Taro.pxTransform(32),
                color: application.constants.textPrimaryColor,
              }}
              key={itemString}
            >{itemString}</Text>
            <View
              style={{
                borderRadius: '50%',
                width: Taro.pxTransform(44),
                height: Taro.pxTransform(44),
                background: isSameDay(table[index+1], moment()) ? themePrimary : 'white',
              }}
            >
              <Text
                style={{
                  "display": "flex",
                  "textAlign": "center",
                  "justifyContent": "center",
                  fontSize: Taro.pxTransform(32),
                  color: isSameDay(table[index+1], moment()) ?  'white' : application.constants.textPrimaryColor,
                }}
                key={itemString}
              >{table[index + 1].date()}</Text>
            </View>
          </View>)}
      </View>
      <ScrollView scrollTop={gridItemWidth * 7} scrollWithAnimation refresherEnabled enableFlex scrollY style={{ flex: 1, height: '100%', display: "flex", flexDirection: "row", overflow: "scroll" }} >
        {table.map((weekday, weekIndex) => (
          <View
            key={weekday ? weekday.date() : 'start'}
            style={{
              background: "white",
              flex: 1,
              width: 0,
              height: `${hour24.length * gridItemWidth}px`,
              "display": "flex",
              "flexDirection": "column",
              "justifyContent": "center",
              "alignItems": "center",
              boxSizing: "border-box",
              borderLeft: weekIndex === 0 ? 'none' : 'solid 1px #dddddd',
            }}
          >
            {hour24dot5.map((item, hourIndex) => {
              if (weekIndex === 0) {
                return (
                  <View
                    key={item}
                    style={{
                      flex: 1, width: gridItemWidthPx, height: gridItemHalfWidthPx,
                      display: 'flex', alignItems: 'flex-end', flexDirection: "column",
                      justifyContent: 'flex-end',
                      boxSizing: "border-box",
                      // borderLeft: 'solid 1px #dddddd',
                      position: "relative",
                      // top: Taro.pxTransform(-gridItemHalfWidth),
                      // marginBottom: gridItemHalfWidthPx,
                      // marginTop: Taro.pxTransform(-gridItemHalfWidth),
                    }}
                  >
                    <Text
                      style={{ textAlign: 'center', position: "absolute", width: gridItemWidthPx,
                        top: `-${gridItemHalfWidth / 2}px` }}
                    >{(hourIndex % 2 === 0 && hourIndex !== 0) ? `${item}:00` : ''}</Text>
                    {hourIndex % 2 !== 0 && hourIndex !== 47 && (<View
                      style={{
                        boxSizing: "content-box",
                        borderBottom: 'solid 1px #dddddd',
                        flex: 1,
                        // height: '1px',
                        width: `4px` }}
                    />)}
                  </View>
                );
              }
              let content = '';
              let height = 0;
              let periodEvent;
              if (hourIndex % 2 === 0 && table[weekIndex]) {
                periodEvent = periodEventMap[table[weekIndex].clone().hour(item).toISOString()];
                if (periodEvent) {
                  content = periodEvent.content;
                  height = (moment(periodEvent['period_end']).diff(moment(periodEvent['period_start'])) / 3600000) * gridItemWidth;
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
                  style={{
                    flex: 1,
                    width: gridItemWidthPx,
                    // height: gridItemHalfWidthPx,
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center',
                    borderBottomStyle: 'solid',
                    borderBottomColor: '#dddddd',
                    borderBottomWidth: hourIndex % 2 === 1 ? Taro.pxTransform(1) : 0,
                    // borderTop: hourIndex === 0 ? 'solid 1px #dddddd' : 'none',
                    boxSizing: "border-box",
                    position: 'relative',
                    color: height ? 'white' : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      position: 'absolute', zIndex: 1, fontSize: Taro.pxTransform(20), boxSizing: "border-box",
                      background: height ? themePrimary : 'transparent', paddingLeft: Taro.pxTransform(4),
                      left: 0, top: 0, width: '100%', textAlign: 'center', height: `${height}px`, paddingRight: Taro.pxTransform(4),
                    }}
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
        {leftTop && leftTop.left >= 0 && leftTop.top >=0 && (
          <View
            style={{
              borderWidth: Taro.pxTransform(4),
              borderStyle: 'solid',
              borderColor: themePrimary,
              borderRadius: Taro.pxTransform(10),
              boxSizing: "border-box",
              position: 'absolute',
              left: `${leftTop.left * gridItemWidth}px`,
              top: `${(leftTop.top * 2) * gridItemHalfWidth}px`,
              height: gridItemWidthPx,
              width: gridItemWidthPx,
              // background: themePrimary,
            }}
          />
        )}
      </ScrollView>
      <AtFloatLayout
        isOpened={leftTop && leftTop.left >= 0 && leftTop.top >=0}
        onClose={() => setLeftTop({ left: -1, top: -1, body: { content: '' }})}
        customStyle={{ minHeight: 0 }}
      >
        <View style={{ display: "flex", flexDirection: 'row', alignItems: 'center' }}>
          <Button
            onClick={() => {
              if (leftTop.body['id']) { /// 服务器数据
                dispatch(createAction('event/destroy')(leftTop.body));
              } else if (leftTop.body['period_start']) { /// 本地数据
                delete periodEventMap[leftTop.body['period_start']];
                dispatch(createAction('event/save')({ periodEventMap }));
              }
              setLeftTop({ left: -1, top: -1, body: { content: '' }})
            }}
          >
            <View style={{ height: Taro.pxTransform(44 * 2), width: Taro.pxTransform(44 * 2), display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Image src={leftTop.body['period_start'] ? assets.images.iconDeleteForever : assets.images.iconCloseBlack} style={{ width: Taro.pxTransform(44), height: Taro.pxTransform(44) }} />
            </View>
          </Button>
          <Input value={leftTop.body.content} onInput={(event) => setLeftTop(prevState => ({ ...prevState, body: { ...prevState.body, content: event.detail.value, }}))} style={{ flex: 1 }} placeholder='请输入标题' />
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

              dispatch(createAction('event/postPeriod')({
                periodStart: clickMoment.clone().hour(parseInt(startHour)).minute(parseInt(startMinute)).toISOString(),
                periodEnd: clickMoment.clone().hour(parseInt(endHour)).minute(parseInt(endMinute)).toISOString(),
                content: leftTop.body.content,
              }));
              setLeftTop({ left: -1, top: -1, body: { content: '' }});
            }}
          >
            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',  height: Taro.pxTransform(44 * 2), paddingLeft: Taro.pxTransform(32), paddingRight: Taro.pxTransform(32) }}>
              <Text style={{ color: 'white' }}>保存</Text>
            </View>
          </Button>
        </View>
        <View style={{ padding: Taro.pxTransform(32), paddingLeft: Taro.pxTransform(44 * 2) }}>
          <Text>
            {leftTop.left >= 0 && `${clickMoment.month()}月${clickMoment.date()}日，星期${application.constants.WEEK_DAY_CHINESE[clickMoment.weekday()]} • ${period}`}
          </Text>
        </View>
      </AtFloatLayout>
    </View>
  );
}

export default connect(({ global, event, home }) => ({ global, event, home }))(WeekCalendar);
