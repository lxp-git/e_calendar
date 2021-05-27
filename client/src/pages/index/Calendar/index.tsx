import React from 'react';
import Taro from "@tarojs/taro";
import {Image, Picker, Swiper, SwiperItem, Text, View} from "@tarojs/components";
import moment, {Moment} from "moment";
import {connect} from "react-redux";

import {calendar, LunarCalendar} from "../../../utils/calendar";
import * as service from "../service";
import application from "../../../utils/Application";
import {createAction} from "../../../utils";
import WeekHeader from "../WeekHeader";
import DateDetail from "../DateDetail";
import WordCard from "../../../components/WordCard";
import TaroButton from "../../../components/TaroButton";
import TimerComponent from "../timer_component";
import FloatButton from "../FloatButton";

import "./index.module.scss";
import Month from "./Month";

const Event = {
  HOLIDAY: 'HOLIDAY',
  WORKING_DAY: 'WORKING_DAY',
}

const systemInfo = Taro.getSystemInfoSync();

const _momentToLunarCalendar = (dayMoment): LunarCalendar => {
  return calendar.solar2lunar(dayMoment.year(), dayMoment.month() + 1, dayMoment.date())
}

function Calendar(props: any) {
  const { dispatch, words, home: { page1 = [], page0 = [], page2 = [], currentPageIndex = 1, selectedDay: tmpSelectedDay, selectedMonth: tmpSelectedMonth, auntFloMap, eventMap }, textPrimaryColor, global: { themePrimary }  } = props;
  let selectedDay = tmpSelectedDay, selectedMonth = tmpSelectedMonth;
  if (typeof tmpSelectedDay === 'string') {
    selectedDay = moment(tmpSelectedDay);
  }
  if (typeof tmpSelectedMonth === 'string') {
    selectedMonth = moment(tmpSelectedMonth);
  }
  const [holidaysMap, setHolidaysMap] = React.useState({});

  React.useEffect(() => {
    const fetch = () => {
      service.fetchHolidays().then((data) => {
        data.forEach(item => {
          holidaysMap[`${item['year']}-${item['month']}-${item['date']}`] = item;
        });
        setHolidaysMap({...holidaysMap});

      });
      dispatch(createAction('words/fetch')({}));
    }
    fetch();
  }, []);

  const _onSelectYearAndMonth = (date) => {
    date.type = "change";
    dispatch(createAction('home/selectYearAndMonth')({ date }));
  }

  const _backToToday = (event) => {
    _onSelectYearAndMonth({ type: 'change', detail: {
        value: moment().format('YYYY-MM-DD') }});
  }

  const _selectedLunarCalendar = _momentToLunarCalendar(selectedDay);
  return (
    <View
      style={{
        "display": "flex",
        "flexDirection": "column",
        // width: '100%',
        width: `${Taro.getSystemInfoSync().screenWidth}px`,
        boxSizing: "border-box",
      }}
      // onTouchStart={_onCalendarBodyTouchStart}
      // onTouchMove={_onCalendarBodyTouchMove}
      // onTouchEnd={_onCalendarBodyTouchEnd}
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
          value={selectedMonth.format('YYYY-MM-DD')}
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
              <Text>{selectedMonth.format('YYYY年MM月')}</Text>
              <Image
                src='https://cdn.liuxuanping.com/baseline_keyboard_arrow_down_black_18dp.png'
                style={{ width: Taro.pxTransform(32), height: Taro.pxTransform(32) }}
              />
            </View>
          </TaroButton>
        </Picker>
        <TimerComponent onTimeClick={_backToToday} />
      </View>
      <Swiper
        // autoplay
        circular
        current={currentPageIndex}
        onChange={(event)=>{
          dispatch(createAction("home/changeSwiper")({event}));
        }}
        onAnimationFinish={event => {
          // console.log("onAnimationFinish", event);
        }}
        onTransitionEnd={event => {console.log("onTransitionEnd", event.detail.value);}}
        style={{ height: (systemInfo.screenWidth-10)/7*5+24+10 + 'px' }}
      >
        <SwiperItem>
          <View style={{ backgroundColor: "white", width: '100%', boxSizing: "border-box", paddingLeft: Taro.pxTransform(10), paddingRight: Taro.pxTransform(10) }}><WeekHeader themePrimary={themePrimary} /></View>
          <Month holidaysMap={holidaysMap} table={page0} />
        </SwiperItem>
        <SwiperItem>
          <View style={{ backgroundColor: "white", width: '100%', boxSizing: "border-box", paddingLeft: Taro.pxTransform(10), paddingRight: Taro.pxTransform(10) }}><WeekHeader themePrimary={themePrimary} /></View>
          <Month holidaysMap={holidaysMap} table={page1} />
        </SwiperItem>
        <SwiperItem>
          <View style={{ backgroundColor: "white", width: '100%', boxSizing: "border-box", paddingLeft: Taro.pxTransform(10), paddingRight: Taro.pxTransform(10) }}><WeekHeader themePrimary={themePrimary} /></View>
          <Month holidaysMap={holidaysMap} table={page2} />
        </SwiperItem>
      </Swiper>
      <DateDetail
        onClick={() => {
          if (application.setting.isNoteBookEnabled) {
            Taro.navigateTo({ url: `/pages/event/index?date=${selectedDay.year()}-${selectedDay.month() + 1}-${selectedDay.date()}` })
          }
        }}
      >
        {_selectedLunarCalendar.gzYear}{application.constants.ZODIAC_SIGNS[_selectedLunarCalendar.Animal][0]}年{_selectedLunarCalendar.gzMonth}月{_selectedLunarCalendar.gzDay}日 {_selectedLunarCalendar.astro} {_selectedLunarCalendar.IMonthCn}{_selectedLunarCalendar.IDayCn} 第{selectedDay.format('ww')}周
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
