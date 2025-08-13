import actiontypes from "../Action/ActionTypes";
const INITIAL_STATE = {};

const AdminReducer = (state = INITIAL_STATE, action) => {
  console.log(action);
  switch (action.type) {
    default:
      return state;
  }
};

export default AdminReducer;
