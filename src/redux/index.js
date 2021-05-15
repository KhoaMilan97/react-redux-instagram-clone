import { combineReducers } from "redux";

import authReducer from "./reducer/authReducer";
import messageReducer from "./reducer/messageReducer";
import loadingReducer from "./reducer/loadingReducer";
import socketReducer from "./reducer/socketReducer";
import notifyReducer from "./reducer/notifyReducer";
import postReducer from "./reducer/postReducer";
import postDetailReducer from "./reducer/postDetailReducer";
import chatReducer from "./reducer/chatReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  message: messageReducer,
  loading: loadingReducer,
  socket: socketReducer,
  notify: notifyReducer,
  postReducer: postReducer,
  postDetail: postDetailReducer,
  chat: chatReducer,
});

export default rootReducer;
