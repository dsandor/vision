'use strict';

const myReducer = (state = [], action) => {
  console.log('myReducer, state:', state, 'action:', action);
  return (state = {}, action) => {
    console.log('regucer called: ', state, ' action:', action);
  };
};

export default myReducer;