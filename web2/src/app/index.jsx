import React from 'react';
import {render} from 'react-dom';
import '../../assets/js/bootstrap.min';
import '../../assets/js/bootstrap-datepicker';
import '../../assets/js/jquery.min';
import '../../assets/js/material-kit';
import '../../assets/js/material.min';

class App extends React.Component {
  render () {
    return (
      <div>
        <div className="card card-nav-tabs">
          <div className="header header-success">
            <div className="nav-tabs-navigation">
              <div className="nav-tabs-wrapper">
                <ul className="nav nav-tabs" dataTabs="tabs">
                  <li className="active">
                    <a href="#profile" dataToggle="tab">
                      <i className="material-icons">face</i>
                      Profile
                    </a>
                  </li>
                  <li>
                    <a href="#messages" dataToggle="tab">
                      <i className="material-icons">chat</i>
                      Messages
                    </a>
                  </li>
                  <li>
                    <a href="#settings" dataToggle="tab">
                      <i className="material-icons">build</i>
                      Settings
                    </a>

                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="content">
            <div className="tab-content text-center">
              <div className="tab-pane active" id="profile">
                <p> I will be the leader of a company that ends up being worth billions of dollars, because I got the answers. I understand culture. I am the nucleus. I think that’s a responsibility that I have, to push possibilities, to show people, this is the level that things could be at. I think that’s a responsibility that I have, to push possibilities, to show people, this is the level that things could be at. </p>
              </div>
              <div className="tab-pane" id="messages">
                <p> I think that’s a responsibility that I have, to push possibilities, to show people, this is the level that things could be at. I will be the leader of a company that ends up being worth billions of dollars, because I got the answers. I understand culture. I am the nucleus. I think that’s a responsibility that I have, to push possibilities, to show people, this is the level that things could be at.</p>
              </div>
              <div className="tab-pane" id="settings">
                <p>I think that’s a responsibility that I have, to push possibilities, to show people, this is the level that things could be at. So when you get something that has the name Kanye West on it, it’s supposed to be pushing the furthest possibilities. I will be the leader of a company that ends up being worth billions of dollars, because I got the answers. I understand culture. I am the nucleus.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

render(<App/>, document.getElementById('app'));
