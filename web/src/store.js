import Vue from 'vue';
import Vuex from 'vuex';
import humanizeDuration from './humanize-duration';

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
    client.lastActivity = Date.now();
    client.humanizedLastActivity = 'a moment ago';

    let foundClient = state.clients.find((c) => c.connectionId === client.connectionId);
    if (foundClient) {
      if (!foundClient.heartbeats) foundClient.heartbeats = 0;

      foundClient.heartbeats ++;

      Object.assign(foundClient, client);
    } else {
      state.clients.push(client);
    }
  },

  updateClientActivityHumanized(state) {
    state.clients.forEach((c) => {
      c.humanizedLastActivity = humanizeDuration(Date.now() - c.lastActivity);
    });
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
  },

  updateClientActivityHumanized({commit}) {
    commit('updateClientActivityHumanized');
  }
};

const store = new Vuex.Store({
  state,
  mutations,
  actions,
});

setInterval(() => {
  store.dispatch('updateClientActivityHumanized');
}, 5000)

export default store;
