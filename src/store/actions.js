import * as types from './mutation-types';

export const setFoo = ({ commit }, payload) => {
  commit(types.UPDATE_FOO, payload);
};
export const setCO2Levels = ({ commit }, payload) => {
  commit(types.UPDATE_CO2_LEVELS, payload);
};
export const setLastUpdateEpoch = ({ commit }, payload) => {
  commit(types.UPDATE_LAST_UPDATE_EPOCH, payload);
};
