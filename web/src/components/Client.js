'use strict';

import React, { PropTypes } from 'react';
import { Card } from 'react-materialize';

const Client = ({ onClick, clientInfo }) => (
  <Card>
    <div>{ clientInfo.id }</div>
    <div>{ clientInfo.name }</div>
  </Card>
);

Client.propTypes = {
  onClick: PropTypes.func.isRequired,
  clientInfo: PropTypes.object.isRequired
};

export default Client;