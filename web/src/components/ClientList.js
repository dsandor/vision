'use strict';

import React, { PropTypes } from 'react';
import Client from './Client';
import { connect } from 'react-redux'

const ClientList = ({ clients, onClientClick }) => (
  <ul>
    {clients.map(client =>
      <Todo
        key={client.id}
        {...client}
        onClick={() => onClientClick(client.id)}
      />
    )}
  </ul>
)

ClientList.propTypes = {
  clients: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired).isRequired,
  onClientClick: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    clients: state.clients
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onClientClick: (id) => {
      dispatch((id) => { console.log('client clicked:', id); });
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ClientList);
