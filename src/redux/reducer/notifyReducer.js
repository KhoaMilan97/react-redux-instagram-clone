import { actionTypes } from "../actions/actionType";

const initialState = {
  data: [],
  sound: false,
};

const notifyReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_NOTIFIES:
      return {
        ...state,
        data: action.payload,
      };
    case actionTypes.CREATE_NOTIFY:
      return {
        ...state,
        data: [action.payload, ...state.data],
      };
    case actionTypes.REMOVE_NOTIFY:
      return {
        ...state,
        data: state.data.filter(
          (item) =>
            item.id !== action.payload.id || item.url !== action.payload.url
        ),
      };

    case actionTypes.UPDATE_NOTIFY:
      const index = state.data.findIndex(
        (item) => item._id === action.payload._id
      );
      const newNotify = [...state.data];
      newNotify[index] = action.payload;
      return {
        ...state,
        data: newNotify,
      };
    case actionTypes.UPDATE_SOUND:
      return {
        ...state,
        sound: action.payload,
      };
    case actionTypes.DELETE_ALL_NOTIFIES:
      return {
        ...state,
        data: [],
      };

    default:
      return state;
  }
};

export default notifyReducer;
