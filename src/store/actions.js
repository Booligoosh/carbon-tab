import * as types from './mutation-types';

export const setFoo = ({ commit }, payload) => {
  commit(types.UPDATE_FOO, payload);
};
export const setCurrentCO2 = ({ commit }, payload) => {
  commit(types.UPDATE_CURRENT_CO2, payload);
};
