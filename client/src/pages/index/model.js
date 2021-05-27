import Taro from '@tarojs/taro';
import moment from "moment";

import * as service from './service';
import application from "../../utils/Application";
import {createAction, delay, isLogin} from "../../utils";
import * as dateUtils from "../../utils/date_utils";

export default {
  namespace: 'home',
  state: {
    firstRowStart: undefined,
    auntFloMap: {},
    eventMap: {},
    selectedDay: moment(),
    selectedMonth: moment(),
    selectedWeek: moment(),
    page0: [],
    page1: [],
    page2: [],
    currentPageIndex: 1,
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
    * changeSwiper({ payload: { event }}, { call, put, select, take }) {
      yield delay(300);
      const { currentPageIndex, selectedMonth: tmpSelectedMonth } = yield select(state => state.home);
      let selectedMonth = tmpSelectedMonth;
      if (typeof tmpSelectedMonth === 'string') {
        selectedMonth = moment(tmpSelectedMonth);
      }
      const payload = {};
      let pageIndex = 0;
      if ((event.detail.current === currentPageIndex + 1) || (event.detail.current === 0 && currentPageIndex === 2)) {
        // 翻到下一月，需要更新下下个页面
        pageIndex = (event.detail.current + 1) % 3;
        payload["selectedMonth"] = selectedMonth.clone().add(1, 'month');
        payload[`page${pageIndex}`] = dateUtils.generateMonthTable(selectedMonth.clone().add(2, 'month'));
      } else {
        pageIndex = (event.detail.current + 3 - 1) % 3;
        payload["selectedMonth"] = selectedMonth.clone().subtract(1, 'month');
        payload[`page${pageIndex}`] = dateUtils.generateMonthTable(selectedMonth.clone().subtract(2, 'month'));
      }
      console.log(`当前从${currentPageIndex}页，去到第${event.detail.current}页，更新了第${pageIndex}页`);
      console.log(payload);

      if (event.detail.source === "touch") {
        payload["currentPageIndex"] = event.detail.current;
      }
      yield put(createAction('save')(payload));
      yield put(createAction('fetchEvent')({
        start: payload[`page${pageIndex}`][0][0],
        end: payload[`page${pageIndex}`][4][6],
      }));
    },
    * selectYearAndMonth({ payload: { date, index }}, { call, put, select, take }) {
      if (date.type === 'change') {
        const yearMonthDay = date.detail.value.split('-');
        const selectedNewMoment = moment().year(parseInt(yearMonthDay[0]))
          .month(parseInt(yearMonthDay[1]) - 1)
          .date(parseInt(yearMonthDay[2]));
        const body = {};
        const { currentPageIndex } = yield select(state => state.home);
        body[`page${(currentPageIndex-1)%3}`] = dateUtils.generateMonthTable(selectedNewMoment.clone().subtract(1, "month"));
        body[`page${currentPageIndex}`] = dateUtils.generateMonthTable(selectedNewMoment.clone());
        body[`page${(currentPageIndex+1)%3}`] = dateUtils.generateMonthTable(selectedNewMoment.clone().add(1, "month"));
        body["selectedMonth"] = selectedNewMoment;
        // console.log("body", body);
        yield put(createAction('save')(body));
        yield put(createAction('fetchEvent')({
          start: body[`page${(currentPageIndex-1)%3}`][0][0],
          end: body[`page${(currentPageIndex+1)%3}`][4][6],
        }));
      }
    },
    * selectWeek({ payload: { date }}, { call, put, select, take }) {

    },
    * fetchEvent({ payload }, { call, put, select, take, takeLatest }) {
      if (application.setting.isAuntFloEnabled || application.setting.isNoteBookEnabled) {
        if (!isLogin()) {
          yield take('home/login/@@end');
        }
        let { start, end } = payload;
        const { home: { auntFloMap, eventMap, page0, page1, page2 }, event: { periodEventMap } } = yield select(state => state);
        if (!start || !end) {
          [page0,page1,page2].forEach((page)=>{
            if (!start) {
              start = page[0][0];
            } else {
              if(start.isAfter(page[0][0])) {
                start = page[0][0];
              }
            }
            if (!end) {
              end = page[4][6];
            } else {
              if(end.isBefore(page[4][6])) {
                end = page[4][6];
              }
            }
          })
        }
        const data = yield call(service.event.fetch, {
          "start": start.toISOString(),
          "end": end.toISOString()
        });
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
