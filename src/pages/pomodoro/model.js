import React from 'react';
import Taro from '@tarojs/taro';

import * as service from './service';
import application from "../../utils/Application";
import {createAction, isLogin} from "../../utils";

export default {
  namespace: 'home',
  state: {
    firstRowStart: undefined,
    auntFloMap: {},
    eventMap: {},
    selectedMoment: new Date(),
  },

  effects: {
    * login({ payload = {  } }, { call, put, select, take }) {
      const { callback } = payload;
      if (application.loginUser && application.loginUser.id) {
        return;
      }
      const { code }  = yield call(Taro.login);
      const data = yield call(service.user.login, {code});
      application.loginUser = data;
      callback && callback(data);
    },
    * post({ payload }, { call, put, select, take }) {
      yield call(Taro.cloud.callFunction, {
        data: {
          content: '大姨妈来了',
          status: 'done',
        },
        name: "postEvent"
      });
    },
    * selectYearAndMonth({ payload: { date }}, { call, put, select, take }) {
      if (date.type === 'change') {
        const yearMonthDay = date.detail.value.split('-');
        const selectedNewMoment = new Date();
        selectedNewMoment.setFullYear(parseInt(yearMonthDay[0]));
        selectedNewMoment.setMonth(parseInt(yearMonthDay[1]) - 1);
        selectedNewMoment.setDate(parseInt(yearMonthDay[2]));
        yield put(createAction('save')({
          selectedMoment: selectedNewMoment,
        }));
        const firstDayOfCurrentMonth = new Date(selectedNewMoment.valueOf()); selectedNewMoment.clone().startOf('month');
        firstDayOfCurrentMonth.setDate(1);
        const dayInMonth = firstDayOfCurrentMonth.getDay() || 6;
        const firstRowStart = firstDayOfCurrentMonth.clone().subtract(dayInMonth, 'day');
        const table = [[
          selectedNewMoment,
        ]];
        const indexMoment = firstRowStart.clone();
        for (let week = 0; week < 5; week++) {
          table[week] = [];
          for (let day = 0; day < 7; day++) {
            table[week][day] = indexMoment.clone();
            indexMoment.add(1, 'day')
          }
        }
        yield put(createAction('save')({
          firstDayOfCurrentMonth, firstRowStart, table,
        }));

        yield put(createAction('fetchEvent')({}));
      }
    },
    * fetchEvent({ payload }, { call, put, select, take, takeLatest }) {
      if (application.setting.isAuntFloEnabled || application.setting.isNoteBookEnabled) {
        if (!isLogin()) {
          yield take('home/login/@@end');
        }
        const { firstRowStart, selectedMoment } = yield select(state => state.home);
        const data = yield call(service.event.fetch, {
          "start": firstRowStart.toISOString(),
          "end": selectedMoment.clone().endOf('month').toISOString()
        });
        const { auntFloMap, eventMap } = yield select(state => state.home);
        data.forEach(item => {
          const dayMoment = new Date(item['notify_at']);
          const mapKey = `${dayMoment.getFullYear()}-${dayMoment.getMonth() + 1}-${dayMoment.getDate()}`;
          if (item.content === '大姨妈来了') {
            auntFloMap[mapKey] = item;
          } else if (typeof item.content === "string") {
            eventMap[mapKey] = item;
          }
        });
        yield put(createAction('save')({
          auntFloMap, eventMap,
        }));
      }
    }
  },

  reducers: {
    save(state, { payload }) {
      // if (payload['eventMap']) {
      //   Taro.setStorageSync('eventMap', payload['eventMap']);
      // }
      return { ...state, ...payload };
    },
  },
};
