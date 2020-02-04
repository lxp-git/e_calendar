import application from '../utils/Application';

export default {
  namespace: 'global',
  state: {
    themePrimary: application.setting.themePrimary,
  },

  effects: {
    * changeTheme({ payload }, { call, put, select, take }) {

    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
