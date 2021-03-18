import { combineReducers } from "redux";

import authReducer from "./reducer/authReducer";
import messageReducer from "./reducer/messageReducer";
import loadingReducer from "./reducer/loadingReducer";
import commentReducer from "./reducer/commentReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  message: messageReducer,
  loading: loadingReducer,
  comments: commentReducer,
});

export default rootReducer;
