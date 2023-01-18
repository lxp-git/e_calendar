import React from 'react';

import * as service from './service'
import {createAction, isIOS} from "../../utils";
import application from "../../utils/Application";

export default {
  namespace: 'event',
  state: {
    currentBackground: application.themes1[1].themePrimary,
    periodEventList: [],
    periodEventMap: {},
  },

  effects: {
    * fetch({ payload }, { call, put, select, take }) {
      // yield call(Taro.cloud.callFunction, {
      //   data: {
      //     start: (new Date()).toISOString(),
      //     end: (new Date()).toISOString(),
      //   },
      //   name: "event"
      // });
      yield call(service.fetch, {
        start: (new Date()).toISOString(),
        end: (new Date()).toISOString(),
      });
    },
    * post({ payload: { selectedDate, content }}, { call, put, select, take }) {
      const { home: { eventMap }, event: { currentBackground }} = yield select(state => state);
      const mapKey = selectedDate;
      const body = {
        background: currentBackground,
        "notify_at": (new Date(isIOS() ? selectedDate.replace(/-/g, '/') : selectedDate)).toISOString(),
        content,
      };
      if (eventMap[mapKey]) {
        body.id = eventMap[mapKey].id;
      }
      const result = yield call(service.post, body);
      eventMap[mapKey] = result;
      yield put(createAction('home/save')({ eventMap: { ...eventMap } }));
    },
    * postPeriod({ payload: { periodStart, periodEnd, content }}, { call, put, select, take }) {
      const { event: { periodEventList, periodEventMap }} = yield select(state => state);
      const body = {
        "period_start": periodStart,
        "period_end": periodEnd,
        "notify_at": periodStart,//  moment(periodStart).subtract('30', "minute"),
        content,
      };
      periodEventList.push(body);
      periodEventMap[periodStart] = body;
      // if (eventMap[mapKey]) {
      //   body.id = eventMap[mapKey].id;
      // }
      const result = yield call(service.post, body);
      const mapKey = periodStart;
      periodEventMap[mapKey] = result;
      yield put(createAction('event/save')({ periodEventMap }));
    },
    * destroy({ payload: { id }}, { call, put, select, take }) {
      const result = yield call(service.destroy, id);
      const { event: { periodEventMap } } = yield select(state => state);
      for(const key in periodEventMap) {
        if (periodEventMap[key] && periodEventMap[key].id === id) {
          delete periodEventMap[key]
        }
      }
      yield put(createAction('event/save')({ periodEventMap }));
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
