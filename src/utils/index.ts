import Taro from '@tarojs/taro';
import {Moment} from "moment";

import application from "./Application";
import {CSSProperties} from "react";

export const delay = time => new Promise(resolve => setTimeout(resolve, time));

export const isDebug = () => process.env.NODE_ENV === 'development';

export const createAction = type => payload => ({ type, payload });

export const isLogin = () => {
  return application.loginUser && application.loginUser.id;
}

export const rgba2hex = (orig) => {
  let a, isPercent,
    rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
    alpha = (rgb && rgb[4] || "").trim(),
    hex = rgb ?
      (rgb[1] | 1 << 8).toString(16).slice(1) +
      (rgb[2] | 1 << 8).toString(16).slice(1) +
      (rgb[3] | 1 << 8).toString(16).slice(1) : orig;

  if (alpha !== "") {
    a = alpha;
  } else {
    a = 1;
  }
  // multiply before convert to HEX
  a = ((a * 255) | 1 << 8).toString(16).slice(1)
  hex = hex + a;

  return hex;
}

export function hexToRgbA(hex, a){
  let c;
  if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
    c= hex.substring(1).split('');
    if(c.length== 3){
      c= [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c= '0x'+c.join('');
    return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+`,${a || 1})`;
  }
  throw new Error(`Bad Hex:${hex}`);
}

const ENV = Taro.getEnv();
let scrollTop = 0
export function handleTouchScroll(flag: any): void {
  if (ENV !== Taro.ENV_TYPE.WEB) {
    return
  }
  if (flag) {
    scrollTop = document.documentElement.scrollTop

    // 使body脱离文档流
    document.body.classList.add('at-frozen')

    // 把脱离文档流的body拉上去！否则页面会回到顶部！
    document.body.style.top = `${-scrollTop}px`
  } else {
    document.body.style.top = null
    document.body.classList.remove('at-frozen')

    document.documentElement.scrollTop = scrollTop
  }
}

export function isSameDay(day1Moment: Moment | null | undefined, day2Moment: Moment | null | undefined): boolean {
  if (!day1Moment || !day2Moment) {
    return false;
  }
  return (day1Moment.year() === day2Moment.year() && day1Moment.month() === day2Moment.month() && day1Moment.date() === day2Moment.date())
}

export function formatTime(numberTime: number) {
  let start = '', startMinute = '';
  if (numberTime < 10) {
    start = `0`+numberTime;
    if (numberTime !== parseInt(numberTime.toString())) {
      start = `0`+parseInt(numberTime.toString());
    }
  } else {
    start = ``+numberTime;
    if (numberTime !== parseInt(numberTime.toString())) {
      start = ``+parseInt(numberTime.toString());
    }
  }
  startMinute = '00';
  if (numberTime !== parseInt(numberTime.toString())) {
    startMinute = 60 * Math.abs(parseInt(numberTime.toString()) - numberTime) + '';
  }
  return `${start}:${startMinute}`;
}

export const isIOS = () => {
  return Taro.getSystemInfoSync().platform.toLowerCase() === 'ios';
}

export const StyleSheet = { // { [index: string]: CSSProperties }
  create<S extends {
    [index: string]: CSSProperties
  }>(styles: S): S {
    return styles;
  }
}
