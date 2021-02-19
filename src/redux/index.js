import { combineReducers } from "redux";

import authReducer from "./reducer/authReducer";
import messageReducer from "./reducer/messageReducer";
import loadingReducer from "./reducer/loadingReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  message: messageReducer,
  loading: loadingReducer,
});

export default rootReducer;
