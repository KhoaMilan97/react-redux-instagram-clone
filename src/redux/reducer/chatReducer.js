import { chatTypes } from "../actions/chatAction";
import _ from "lodash";

const initialState = {
  users: [],
  resultUsers: 0,
  data: [],
  firstLoad: false,
  loading: false,
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case chatTypes.ADD_USER:
      if (state.users.every((item) => item._id !== action.payload._id)) {
        return {
          ...state,
          users: [action.payload, ...state.users],
        };
      }
      return state;
    case chatTypes.ADD_CHAT:
      return {
        ...state,
        data: state.data.map((item) =>
          item._id === action.payload.recipient ||
          item._id === action.payload.sender
            ? {
                ...item,
                messages: [...item.messages, action.payload],
                result: item.result + 1,
              }
            : item
        ),
        users: state.users.map((user) =>
          user._id === action.payload.recipient ||
          user._id === action.payload.sender
            ? {
                ...user,
                text: action.payload.text,
                media: action.payload.media,
                call: action.payload.call,
              }
            : user
        ),
      };
    case chatTypes.UPDATE_CHAT:
      const oldData = [...state.data].find(
        (item) => item._id === action.payload.recipient
      );
      const indexMess = oldData.messages.findIndex((item) => {
        return (
          item.text === action.payload.text &&
          item.recipient === action.payload.recipient &&
          item.sender === action.payload.sender &&
          !item._id
        );
      });
      oldData.messages[indexMess] = action.payload;
      const dataMessUpdate = _.uniq([...state.data, oldData], "_id");
      return {
        ...state,
        data: dataMessUpdate,
      };

    case chatTypes.GET_CONSERVATIONS:
      return {
        ...state,
        users: action.payload.newArr,
        resultUsers: action.payload.result,
        firstLoad: true,
      };
    case chatTypes.GET_MESSAGES:
      return {
        ...state,
        data: [...state.data, action.payload],
      };
    case chatTypes.UPDATE_MESSAGES:
      const index = state.data.findIndex(
        (item) => item._id === action.payload._id
      );
      let dataUpdate = [...state.data];

      if (index >= 0) {
        dataUpdate[index] = action.payload;
      }
      return {
        ...state,
        data: dataUpdate,
      };

    case chatTypes.CHECK_ONLINE_OFFLINE:
      return {
        ...state,
        users: state.users.map((user) =>
          action.payload.includes(user._id)
            ? { ...user, online: true }
            : { ...user, online: false }
        ),
      };
    case chatTypes.CHAT_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case chatTypes.DELETE_MESSAGES:
      return {
        ...state,
        data: state.data.map((item) =>
          item._id === action.payload._id
            ? {
                ...item,
                messages: action.payload.newData,
                result: action.payload.newData.length,
              }
            : item
        ),
      };
    case chatTypes.DELETE_CONVERSATION:
      const newUsers = [...state.users].filter(
        (user) => user._id !== action.payload
      );
      const newData = [...state.data].filter(
        (item) => item._id !== action.payload
      );
      return {
        ...state,
        users: newUsers,
        data: newData,
      };

    case chatTypes.CLEAR_MESSAGES:
      return {
        ...state,
        data: [],
        resultData: 0,
      };

    default:
      return state;
  }
};

export default chatReducer;
