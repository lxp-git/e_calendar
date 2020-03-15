import Taro from '@tarojs/taro';

import * as service from './service';
import application from "../../utils/Application";
import {createAction, isLogin} from "../../utils";

export default {
  namespace: 'words',
  state: {
    currentWordCardIndex: 0,
    list: [],
  },

  effects: {
    * fetch({ payload: { callback } }, { call, put, select, take, takeLatest }) {
      if (!application.setting.isReviewWordsEnabled) {
        return;
      }
      if (!isLogin()) {
        yield take('home/login/@@end');
      }
      const responseJson  = yield call(service.fetch);
      yield put(createAction('save')({ list: responseJson }));
      callback && callback(responseJson);
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

    /**
     *
     * @param timeInterval 单位：秒
     */
    * nextWordCard({ payload: { timeInterval }}, { call, put, select, take }) {
      // 切换到下一个单词
      const { currentWordCardIndex, list } = yield select(state => state.words);
      const currentWordCard = list[currentWordCardIndex];
      if (timeInterval < 1) {
        // 如果复习的时间低于10分钟，把当前单词放到一分钟后复习
        yield put(createAction('save')({
          currentWordCardIndex: currentWordCardIndex + 1,
        }));
        list.push(currentWordCard);
        yield put(createAction('save')({
          list: [ ...list ],
        }));
      } else {
        const newList = list.filter((value, index, array) => (value.id !== currentWordCard.id));
        yield put(createAction('save')({
          list: newList,
        }));
        const { retrievability } = currentWordCard;
        const newRetrievability = retrievability * (1 + Math.pow(Math.E, -(1 / (timeInterval / (24 * 60 * 60)))));
        yield call(service.patch, {
          id: list[currentWordCardIndex].id,
          'time_interval': timeInterval,
          retrievability: newRetrievability,
        });
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
