import { chatTypes } from "../actions/chatAction";

const initialState = [];

const onlineReducer = (state = initialState, action) => {
  switch (action.type) {
    case chatTypes.ONLINE:
      return [...state, action.payload];
    case chatTypes.OFFLINE:
      return state.filter((item) => item !== action.payload);

    default:
      return state;
  }
};

export default onlineReducer;
