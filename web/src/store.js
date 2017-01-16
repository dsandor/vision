import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
  count: 0,
  appTitle: 'Vision',
  appVersion: '0.0.1',
  clients: []
};

const mutations = {
  INCREMENT(state) { state.count++ },

  addClient(state, client) {
    state.clients.push(client);
  },

  updateClient(state, client) {
    client.lastActivity = Date.now();

    let foundClient = state.clients.find((c) => c.connectionId === client.connectionId);
    if (foundClient) {
      if (!foundClient.heartbeats) foundClient.heartbeats = 0;

      foundClient.heartbeats ++;

      client.humanizedLastActivity = humanizeSince(client.lastActivity);

      Object.assign(foundClient, client);
    } else {
      client.humanizedLastActivity = 'just now.';
      state.clients.push(client);
    }
  },

  updateClientList(state) {
    state.clients.forEach((c) => {
      c.humanizedLastActivity = humanizeSince(c.lastActivity);
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

  updateClientList({commit}) {
    commit('updateClientList');
  }
};

const store = new Vuex.Store({
  state,
  mutations,
  actions,
});

setInterval(() => {
  store.dispatch('updateClientList');
}, 5000)


function humanizeSince(date) {
  const delta = Math.round((+new Date - date) / 1000),
        minute = 60,
        hour = minute * 60,
        day = hour * 24;

  let humanized;

  if (delta < 30) {
    humanized = 'just now.';
  } else if (delta < minute) {
    humanized = delta + ' seconds ago.';
  } else if (delta < 2 * minute) {
    humanized = 'a minute ago.'
  } else if (delta < hour) {
    humanized = Math.floor(delta / minute) + ' minutes ago.';
  } else if (Math.floor(delta / hour) == 1) {
    humanized = '1 hour ago.'
  } else if (delta < day) {
    humanized = Math.floor(delta / hour) + ' hours ago.';
  } else if (delta < day * 2) {
    humanized = 'yesterday';
  }

  return humanized;
}

export default store;
