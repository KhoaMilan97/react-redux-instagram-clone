import { chatTypes } from "../actions/chatAction";

const initialState = {
  users: [],
  resultUsers: 0,
  data: [],
  resultData: 0,
  firstLoad: false,
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case chatTypes.ADD_USER:
      return {
        ...state,
        users: [action.payload, ...state.users],
      };
    case chatTypes.ADD_CHAT:
      return {
        ...state,
        data: [...state.data, action.payload],
        users: state.users.map((user) =>
          user._id === action.payload.recipient ||
          user._id === action.payload.sender
            ? {
                ...user,
                text: action.payload.text,
                media: action.payload.media,
              }
            : user
        ),
      };
    case chatTypes.GET_CONSERVATIONS:
      return {
        ...state,
        users: action.payload.newArr,
        resultUsers: action.payload.result,
      };
    case chatTypes.GET_MESSAGES:
      return {
        ...state,
        data: action.payload.messages.reverse(),
        resultData: action.payload.result,
      };

    default:
      return state;
  }
};

export default chatReducer;
