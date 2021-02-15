import { combineReducers } from "redux";

import userReducer from "./reducer/userReducer";
import messageReducer from "./reducer/messageReducer";
import loadingReducer from "./reducer/loadingReducer";

const rootReducer = combineReducers({
  user: userReducer,
  message: messageReducer,
  loading: loadingReducer,
});

export default rootReducer;
