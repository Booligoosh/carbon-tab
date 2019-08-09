import * as types from './mutation-types';

export default {
  [types.UPDATE_FOO](state, payload) {
    state.foo = payload;
  },
  [types.UPDATE_CO2_LEVELS](state, payload) {
    state.CO2Levels = payload;
  },
};
