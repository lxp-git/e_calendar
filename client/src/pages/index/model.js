import Taro from '@tarojs/taro';
import moment from "moment";

import * as service from './service';
import application from "../../utils/Application";
import {createAction} from "../../utils";

export default {
  namespace: 'home',
  state: {
    firstRowStart: undefined,
    auntFloMap: {},
    selectedMoment: moment(),
  },

  effects: {
    * login({ payload = {  } }, { call, put, select, take }) {
      const { callback } = payload;
      if (application.loginUser.id) {
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
    * fetchEvent({ payload }, { call, put, select, take }) {
      if (application.setting.isAuntFloEnabled && application.loginUser && application.loginUser.id) {
        const { firstRowStart, selectedMoment } = yield select(state => state.home);
        const data = yield call(service.event.fetch, {
          "start": firstRowStart.toISOString(),
          "end": selectedMoment.clone().endOf('month').toISOString()
        });
        const { auntFloMap } = yield select(state => state.home);
        data.forEach(item => {
          const dayMoment = moment(item['notify_at']);
          const mapKey = `${dayMoment.year()}-${dayMoment.month() + 1}-${dayMoment.date()}`;
          auntFloMap[mapKey] = item;
        });
        yield put(createAction('save')({
          auntFloMap,
        }));
      }
    }
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
