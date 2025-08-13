import { combineReducers } from "redux";
import UserReducer from "./UserReducer";
import AdminReducer from "./AdminReducer";
const rootReducer = combineReducers({
  user: UserReducer,
  admin: AdminReducer,
});

export default rootReducer;
