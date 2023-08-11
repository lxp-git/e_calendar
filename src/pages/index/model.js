import Taro from "@tarojs/taro";

import * as service from "./service";
import application from "../../utils/Application";
import { createAction, delay, isLogin } from "../../utils";
import * as dateUtils from "../../utils/date_utils";

export default {
  namespace: "home",
  state: {
    firstRowStart: undefined,
    auntFloMap: {},
    eventMap: {},
    selectedDay: new Date(),
    selectedMonth: new Date(),
    selectedWeek: new Date(),
    page0: [],
    page1: [],
    page2: [],
    currentPageIndex: 1,
  },

  effects: {
    *login({ payload = {} }, { call, put, select, take }) {
      const { callback } = payload;
      if (application.loginUser && application.loginUser.id) {
        return;
      }
      const { code } = yield call(Taro.login);
      const data = yield call(service.user.login, { code });
      console.log("new loginUser", data);
      application.loginUser = data;
      callback && callback(data);
    },
    *post({ payload }, { call, put, select, take }) {
      yield call(Taro.cloud.callFunction, {
        data: {
          content: "大姨妈来了",
          status: "done",
        },
        name: "postEvent",
      });
    },
    *changeSwiper({ payload: { event } }, { call, put, select, take }) {
      yield delay(300);
      const { currentPageIndex, selectedMonth: tmpSelectedMonth } =
        yield select((state) => state.home);
      let selectedMonth = tmpSelectedMonth;
      if (typeof tmpSelectedMonth === "string") {
        selectedMonth = new Date(tmpSelectedMonth);
      }
      const payload = {};
      let pageIndex = 0;
      if (
        event.detail.current === currentPageIndex + 1 ||
        (event.detail.current === 0 && currentPageIndex === 2)
      ) {
        // 翻到下一月，需要更新下下个页面
        pageIndex = (event.detail.current + 1) % 3;
        const nextCurrentMonth = new Date(selectedMonth.valueOf());
        nextCurrentMonth.setMonth(selectedMonth.getMonth() + 1);
        payload["selectedMonth"] = nextCurrentMonth;
        const nextNextMonth = new Date(nextCurrentMonth.valueOf());
        nextNextMonth.setMonth(nextNextMonth.getMonth() + 1);
        payload[`page${pageIndex}`] =
          dateUtils.generateMonthTable(nextNextMonth);
      } else {
        pageIndex = (event.detail.current + 3 - 1) % 3;
        const nextCurrentMonth = new Date(selectedMonth.valueOf());
        nextCurrentMonth.setMonth(selectedMonth.getMonth() - 1);
        payload["selectedMonth"] = nextCurrentMonth;
        const lastNextCurrentMonth = new Date(nextCurrentMonth.valueOf());
        lastNextCurrentMonth.setMonth(lastNextCurrentMonth.getMonth() - 1);
        payload[`page${pageIndex}`] =
          dateUtils.generateMonthTable(lastNextCurrentMonth);
      }
      // console.log(`当前从${currentPageIndex}页，去到第${event.detail.current}页，更新了第${pageIndex}页`);
      // console.log(payload);

      if (event.detail.source === "touch") {
        payload["currentPageIndex"] = event.detail.current;
      }
      yield put(createAction("save")(payload));
      yield put(
        createAction("fetchEvent")({
          start: payload[`page${pageIndex}`][0][0],
          end: payload[`page${pageIndex}`][4][6],
        })
      );
    },
    *selectYearAndMonth(
      { payload: { date, index } },
      { call, put, select, take }
    ) {
      if (date.type === "change") {
        const yearMonthDay = date.detail.value.split("-");
        const selectedNewDate = new Date();
        selectedNewDate.setFullYear(parseInt(yearMonthDay[0]));
        selectedNewDate.setMonth(parseInt(yearMonthDay[1]) - 1);
        selectedNewDate.setDate(parseInt(yearMonthDay[2]));
        const body = {};
        const { currentPageIndex } = yield select((state) => state.home);
        const lastMonth = new Date(selectedNewDate.valueOf());
        lastMonth.setDate(1);
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        body[`page${(currentPageIndex - 1) % 3}`] =
          dateUtils.generateMonthTable(lastMonth);
        body[`page${currentPageIndex}`] = dateUtils.generateMonthTable(
          new Date(selectedNewDate.valueOf())
        );
        const nextMonth = new Date(selectedNewDate.valueOf());
        nextMonth.setDate(1);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        body[`page${(currentPageIndex + 1) % 3}`] =
          dateUtils.generateMonthTable(nextMonth);
        console.log("selectedNewDate", selectedNewDate);
        body["selectedMonth"] = selectedNewDate;
        yield put(createAction("save")(body));
        yield put(
          createAction("fetchEvent")({
            start: body[`page${(currentPageIndex - 1) % 3}`][0][0],
            end: body[`page${(currentPageIndex + 1) % 3}`][4][6],
          })
        );
      }
    },
    *selectWeek({ payload: { date } }, { call, put, select, take }) {},
    *fetchEvent({ payload }, { call, put, select, take, takeLatest }) {
      if (
        application.setting.isAuntFloEnabled ||
        application.setting.isNoteBookEnabled
      ) {
        if (!isLogin()) {
          yield take("login/@@end");
        }
        let { start, end } = payload;
        const {
          home: { auntFloMap, eventMap, page0, page1, page2 },
          event: { periodEventMap },
        } = yield select((state) => state);
        if (!start || !end) {
          [page0, page1, page2].forEach((page) => {
            if (!start) {
              start = page[0][0];
            } else {
              if (start.isAfter(page[0][0])) {
                start = page[0][0];
              }
            }
            if (!end) {
              end = page[4][6];
            } else {
              if (end.isBefore(page[4][6])) {
                end = page[4][6];
              }
            }
          });
        }
        const data = yield call(service.event.fetch, {
          start: start.toISOString(),
          end: end.toISOString(),
        });
        data.forEach((item) => {
          const dayMoment = new Date(item["notify_at"]);
          const mapKey = `${dayMoment.getFullYear()}-${
            dayMoment.getMonth() + 1
          }-${dayMoment.getDate()}`;
          if (
            item.content === "大姨妈来了" &&
            application.setting.isAuntFloEnabled
          ) {
            auntFloMap[mapKey] = item;
          } else if (typeof item.content === "string") {
            if (item["period_start"]) {
              periodEventMap[item["period_start"]] = item;
            } else {
              eventMap[mapKey] = item;
            }
          }
        });
        yield put(
          createAction("save")({
            auntFloMap: { ...auntFloMap },
            eventMap: { ...eventMap },
          })
        );
        yield put(
          createAction("event/save")({
            periodEventMap,
          })
        );
      }
    },

    *fetchHolidays({ payload }, { call, put, select, take, takeLatest }) {
      const response = yield call(service.fetchHolidays);
      const newHolidaysMap = {};
      response.forEach((item) => {
        newHolidaysMap[`${item["year"]}-${item["month"]}-${item["date"]}`] =
          item;
      });
      yield put(
        createAction("save")({
          holidaysMap: newHolidaysMap,
        })
      );
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
