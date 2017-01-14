import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
  count: 0,
  appTitle: 'vision-web',
  appVersion: '0.0.1',
  clients: []
}

const mutations = {
  INCREMENT(state) { state.count++ },

  addClient(state, client) {
    state.clients.push(client);
  },

  updateClient(state, client) {
    let foundClient = state.clients.find((c) => c.connectionId === client.connectionId);
    if (foundClient) {
      if (!foundClient.heartbeats) foundClient.heartbeats = 0;

      foundClient.heartbeats ++;

      Object.assign(foundClient, client);
    } else {
      client.heartbeats = 0;
      client.hostInfo = {
        model: '',
        cpus: [],
        memory: 0
      };

      client.monitorInfo = {
        primaryMonitor: {
          monitorRect: {
            bottom: 0,
            right: 0
          }
        }
      };

      state.clients.push(client);
    }
  }
};

const actions = {
  incrementAsync({commit}) {
    setTimeout(() => {
      commit('INCREMENT')
    }, 200);
  },

  addClient({commit}, client) {
    commit('addClient', client);
  },

  updateClient({commit}, client) {
    commit('updateClient', client);
  }
};

const store = new Vuex.Store({
  state,
  mutations,
  actions,
});

export default store;
