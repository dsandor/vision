'use strict';

import React, { PropTypes } from 'react'

const Client = ({ onClick, completed, text }) => (
  <li onClick={onClick}>
  {text}
  </li>
);

Client.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
}

export default Client