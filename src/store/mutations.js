import * as types from './mutation-types';

export default {
  [types.UPDATE_FOO](state, payload) {
    state.foo = payload;
  },
  [types.UPDATE_CURRENT_CO2](state, payload) {
    state.currentCO2 = payload;
  },
};
