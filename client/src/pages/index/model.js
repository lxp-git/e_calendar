import Taro from '@tarojs/taro';
import moment from "moment";

import * as service from './service';
import application from "../../utils/Application";
import {createAction, isLogin} from "../../utils";

export default {
  namespace: 'home',
  state: {
    firstRowStart: undefined,
    auntFloMap: {},
    eventMap: {},
    selectedMoment: moment(),
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
        const selectedNewMoment = moment().year(parseInt(yearMonthDay[0]))
          .month(parseInt(yearMonthDay[1]) - 1)
          .date(parseInt(yearMonthDay[2]));
        yield put(createAction('save')({
          selectedMoment: selectedNewMoment,
        }));
        const firstDayOfCurrentMonth = selectedNewMoment.clone().startOf('month');
        const dayInMonth = firstDayOfCurrentMonth.clone().weekday();
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
    * selectWeek({ payload: { date }}, { call, put, select, take }) {
      if (date.type === 'change') {
        const yearMonthDay = date.detail.value.split('-');
        const selectedNewMoment = moment().year(parseInt(yearMonthDay[0]))
          .month(parseInt(yearMonthDay[1]) - 1)
          .date(parseInt(yearMonthDay[2]));
        yield put(createAction('save')({
          selectedMoment: selectedNewMoment,
        }));
        const firstDayOfCurrentMonth = selectedNewMoment.clone().startOf('month');
        const dayInMonth = firstDayOfCurrentMonth.clone().weekday();
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
        const { home: { auntFloMap, eventMap }, event: { periodEventMap } } = yield select(state => state);
        data.forEach(item => {
          const dayMoment = moment(item['notify_at']);
          const mapKey = `${dayMoment.year()}-${dayMoment.month() + 1}-${dayMoment.date()}`;
          if (item.content === '大姨妈来了') {
            auntFloMap[mapKey] = item;
          } else if (typeof item.content === "string") {
            if (item['period_start']) {
              periodEventMap[item['period_start']] = item;
            } else {
              eventMap[mapKey] = item;
            }
          }
        });
        yield put(createAction('save')({
          auntFloMap, eventMap,
        }));
        yield put(createAction('event/save')({
          periodEventMap
        }));
      }
    },

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
