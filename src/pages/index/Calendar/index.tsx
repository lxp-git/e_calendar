import React from 'react';
import Taro from "@tarojs/taro";
import {Image, Picker, Swiper, SwiperItem, Text, View} from "@tarojs/components";
import moment from "moment";
import {connect} from "react-redux";

import {calendar, LunarCalendar} from "../../../utils/calendar";
import * as service from "../service";
import application from "../../../utils/Application";
import {createAction, StyleSheet} from "../../../utils";
import WeekHeader from "../WeekHeader";
import DateDetail from "../DateDetail";
import WordCard from "../../../components/WordCard";
import TaroButton from "../../../components/TaroButton";
import TimerComponent from "../Timer";
import FloatButton from "../FloatButton";
//
// import "./index.module.scss";
import Month from "./Month";
import assets from '../../../assets';

const systemInfo = Taro.getSystemInfoSync();
const styles = StyleSheet.create({
  index: { "display": "flex", "flexDirection": "column", width: `${systemInfo.screenWidth}px`, boxSizing: "border-box" },
  header: {
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
  },
  selectMonth: {
    display: "flex",
    flexDirection: "row",
    alignItems: 'center',
    "paddingTop": Taro.pxTransform(32),
    "paddingRight": Taro.pxTransform(32),
    "paddingBottom": Taro.pxTransform(32),
    "paddingLeft": Taro.pxTransform(32),
    "fontWeight": "bold",
    "color": "#444444",
  },
  selectMonthImage: { width: Taro.pxTransform(32), height: Taro.pxTransform(32) },
  body: { height: (systemInfo.screenWidth-10)/7*5+24+10 + 'px', backgroundColor: 'white' },
  swiperContainer: { backgroundColor: "white", width: '100%', boxSizing: "border-box", paddingLeft: Taro.pxTransform(10), paddingRight: Taro.pxTransform(10) },

})

const _momentToLunarCalendar = (dayMoment): LunarCalendar => {
  return calendar.solar2lunar(dayMoment.year(), dayMoment.month() + 1, dayMoment.date())
}

function Calendar(props: any) {
  const { dispatch, englishWord, page1 = [], page0 = [], page2 = [], currentPageIndex = 1, selectedDay: tmpSelectedDay, selectedMonth: tmpSelectedMonth, themePrimary  } = props;
  let selectedDay = tmpSelectedDay, selectedMonth = tmpSelectedMonth;
  if (typeof tmpSelectedDay === 'string') {
    selectedDay = moment(tmpSelectedDay);
  }
  if (typeof tmpSelectedMonth === 'string') {
    selectedMonth = moment(tmpSelectedMonth);
  }
  const [holidaysMap, setHolidaysMap] = React.useState({});
  const [isContentShow, setIsContentShow] = React.useState(false);

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
    setTimeout(() => {
      setIsContentShow(true);
    }, 0);
  }, []);

  const _onSelectYearAndMonth = (date) => {
    date.type = "change";
    dispatch(createAction('home/selectYearAndMonth')({ date }));
  }

  const _backToToday = (event) => {
    _onSelectYearAndMonth({ type: 'change', detail: {
        value: moment().format('YYYY-MM-DD') }});
  }
  const _onDateDetailClicked = () => {
    if (application.setting.isNoteBookEnabled) {
      Taro.navigateTo({ url: `/pages/event/index?date=${selectedDay.year()}-${selectedDay.month() + 1}-${selectedDay.date()}` })
    }
  }
  const _onWordClicked = (event) => { event.preventDefault();event.stopPropagation(); Taro.navigateTo({ url: '/pages/words/index' }) };

  const _selectedLunarCalendar = _momentToLunarCalendar(selectedDay);
  return (
    <View
      style={styles.index}
      // onTouchStart={_onCalendarBodyTouchStart}
      // onTouchMove={_onCalendarBodyTouchMove}
      // onTouchEnd={_onCalendarBodyTouchEnd}
    >
      <View
        style={styles.header}
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
              style={styles.selectMonth}
            >
              <Text>{selectedMonth.format('YYYY年MM月')}</Text>
              <Image
                src={assets.images.arrowDownBlack}
                style={styles.selectMonthImage}
              />
            </View>
          </TaroButton>
        </Picker>
        <TimerComponent onTimeClick={_backToToday} />
      </View>
      <View style={styles.body}>
        {isContentShow && (
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
            style={styles.body}
          >
            <SwiperItem>
              <View style={styles.swiperContainer}><WeekHeader themePrimary={themePrimary} /></View>
              <Month holidaysMap={holidaysMap} table={page0} />
            </SwiperItem>
            <SwiperItem>
              <View style={styles.swiperContainer}><WeekHeader themePrimary={themePrimary} /></View>
              <Month holidaysMap={holidaysMap} table={page1} />
            </SwiperItem>
            <SwiperItem>
              <View style={styles.swiperContainer}><WeekHeader themePrimary={themePrimary} /></View>
              <Month holidaysMap={holidaysMap} table={page2} />
            </SwiperItem>
          </Swiper>
        )}
      </View>
      <DateDetail
        onClick={_onDateDetailClicked}
      >
        {_selectedLunarCalendar.gzYear}{application.constants.ZODIAC_SIGNS[_selectedLunarCalendar.Animal][0]}年{_selectedLunarCalendar.gzMonth}月{_selectedLunarCalendar.gzDay}日 {_selectedLunarCalendar.astro} {_selectedLunarCalendar.IMonthCn}{_selectedLunarCalendar.IDayCn} 第{selectedDay.format('ww')}周
      </DateDetail>
      {englishWord && (
        <WordCard
          onClick={_onWordClicked}
          wordCard={englishWord}
        />
      )}
      <FloatButton />
    </View>
  );
}

export default connect(({ home: { page1 = [], page0 = [], page2 = [], currentPageIndex = 1, selectedDay, selectedMonth }, global: { themePrimary }, words }) => {
  return { page1, page0, page2, currentPageIndex, selectedDay, selectedMonth, themePrimary, englishWord: words && words.list && words.list.length > 0 && words[0] };
})(React.memo(Calendar));
