'use strict';

import React, { PropTypes } from 'react';
import Todo from './Client';

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
);

ClientList.propTypes = {
  clients: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired).isRequired,
  onClientClick: PropTypes.func.isRequired
};

export default ClientList;
