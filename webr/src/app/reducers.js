'use strict';

const myReducer = (state = [], action) => {
  console.log('myReducer, state:', state, 'action:', action);
  return state;
};

export default myReducer;