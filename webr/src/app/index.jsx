import React from 'react';
import {render} from 'react-dom';
import {Navbar, NavItem, Icon} from 'react-materialize';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import {myReducer} from './reducers';

let store = createStore(myReducer);

class App extends React.Component {
  render () {
    return (
      <Provider store={store}>
        <div>
          <Navbar brand='logo' right>
              <NavItem href='get-started.html'><Icon>search</Icon></NavItem>
              <NavItem href='get-started.html'><Icon>view_module</Icon></NavItem>
              <NavItem href='get-started.html'><Icon>refresh</Icon></NavItem>
              <NavItem href='get-started.html'><Icon>more_vert</Icon></NavItem>
          </Navbar>
          <p>This is the first view of your ReactJS application with Materialize.</p>
        </div>
      </Provider>
    );
  }
}

render(<App/>, document.getElementById('app'));
