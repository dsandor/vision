'use strict';

import React from 'react';
import {render} from 'react-dom';
import {Navbar, NavItem, Icon, Card} from 'react-materialize';
import { createStore } from 'redux'
import ClientList from '../components/ClientList';

let store = createStore(vision);

function vision(state = { clients: {} }, action) {
  switch (action.type) {
    case 'ADD_CLIENT':
      state.clients[action.client.id] = action.client;
      return state;
    case 'REMOVE_CLIENT':
      delete state.clients[action.id];
      return state;
    default:
      return state;
  }
}

class App extends React.Component {
  render () {
    return (
      <div>
        <Navbar brand=' logo' right>
            <NavItem href='get-started.html'><Icon>search</Icon></NavItem>
            <NavItem href='get-started.html'><Icon>view_module</Icon></NavItem>
            <NavItem href='get-started.html'><Icon>refresh</Icon></NavItem>
            <NavItem href='get-started.html'><Icon>more_vert</Icon></NavItem>
        </Navbar>
       <ClientList />
      </div>
    );
  }
}

render(<Provider store={store}><App/></Provider>, document.getElementById('app'));
