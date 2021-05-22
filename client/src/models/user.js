import * as service from '../services'

export default {
  namespace: 'user',
  state: {

  },

  effects: {
    * put({ payload }, { call, put, select, take }) {
      const { avatarUrl, city, country, gender, nickName, province } = payload;
      yield call(service.user.put, {
        nickname: nickName,
        'avatar_url': avatarUrl,
        city,
        country,
        gender,
        province,
      });

    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
