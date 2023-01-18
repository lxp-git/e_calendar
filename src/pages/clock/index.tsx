import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import {Text, View} from '@tarojs/components';
import {calendar, LunarCalendar} from "../../utils/calendar";

const weekMap = [
  "日","一","二","三","四","五","六",
];
let singleMoment = new Date();
export default class Index extends Component {

  state = {
    _hour: singleMoment.getHours(),
    _minute: singleMoment.getMinutes(),
    _second: singleMoment.getSeconds(),
    _hourMinute: `${singleMoment.getHours()}:${singleMoment.getMinutes()}`,
  }
  timer;
  _lunarCalendar;

  _fetch = () => {

  }

  componentWillMount() {
    this._lunarCalendar = this._dateToLunarCalendar(singleMoment);
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
      singleMoment = new Date();
      this.setState({
        _hour: singleMoment.getHours(),
        _minute: singleMoment.getMinutes(),
        _second: singleMoment.getSeconds(),
        _hourMinute: `${singleMoment.getHours()}:${singleMoment.getMinutes()}`,
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

  _dateToLunarCalendar = (dayMoment: Date): LunarCalendar => {
    return calendar.solar2lunar(dayMoment.getFullYear(), dayMoment.getMonth() + 1, dayMoment.getDate())
  }

  render() {
    const { _hour, _minute, _second, _hourMinute } = this.state;
    let date = new Date();
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
        >{`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`} 农历{this._lunarCalendar.IMonthCn}{this._lunarCalendar.IDayCn} 星期{weekMap[date.getDay()]}</Text>
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
