import { combineReducers } from "redux";

import authReducer from "./reducer/authReducer";
import messageReducer from "./reducer/messageReducer";
import loadingReducer from "./reducer/loadingReducer";
import socketReducer from "./reducer/socketReducer";
import notifyReducer from "./reducer/notifyReducer";
import postReducer from "./reducer/postReducer";
import postDetailReducer from "./reducer/postDetailReducer";
import chatReducer from "./reducer/chatReducer";
import onlineReducer from "./reducer/onlineReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  message: messageReducer,
  loading: loadingReducer,
  socket: socketReducer,
  notify: notifyReducer,
  postReducer: postReducer,
  postDetail: postDetailReducer,
  chat: chatReducer,
  online: onlineReducer,
});

export default rootReducer;
