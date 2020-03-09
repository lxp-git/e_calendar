import * as service from './service'
import {createAction} from "../../utils";
import moment from "moment";

export default {
  namespace: 'event',
  state: {

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
    * post({ payload: { selectedDate, background, content }}, { call, put, select, take }) {
      const { home: { eventMap }} = yield select(state => state);
      const mapKey = selectedDate;
      const body = {
        background,
        "notify_at": (new Date(selectedDate)).toISOString(),
        content,
      };
      if (eventMap[mapKey]) {
        body.id = eventMap[mapKey].id;
      }
      const result = yield call(service.post, body);
      eventMap[mapKey] = result;
      yield put(createAction('home/save')({ eventMap }));
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
