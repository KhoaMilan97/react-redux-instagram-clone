import { combineReducers } from "redux";

import authReducer from "./reducer/authReducer";
import messageReducer from "./reducer/messageReducer";
import loadingReducer from "./reducer/loadingReducer";
import commentReducer from "./reducer/commentReducer";
import socketReducer from "./reducer/socketReducer";
import notifyReducer from "./reducer/notifyReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  message: messageReducer,
  loading: loadingReducer,
  comments: commentReducer,
  socket: socketReducer,
  notify: notifyReducer,
});

export default rootReducer;
