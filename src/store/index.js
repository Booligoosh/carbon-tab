import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';

import * as getters from './getters';
import mutations from './mutations';
import * as actions from './actions';

Vue.use(Vuex);

const vuexPersist = new VuexPersist({
  key: 'vuex',
  storage: localStorage,
});

export default new Vuex.Store({
  state: {
    foo: 'bar',
    CO2Levels: {},
    lastUpdateEpoch: 0
  },
  getters,
  mutations,
  actions,
  plugins: [vuexPersist.plugin],
});
