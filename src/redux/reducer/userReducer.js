import { actionTypes } from "../actions/actionType";

const initialState = {
  isLoggedIn: false,
  token: "",
  user: {},
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_SUCCESS:
    case actionTypes.REGISTER_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        token: action.payload.accessToken,
        user: action.payload.user,
      };
    case actionTypes.CHECK_CURRENT_USER:
      return {
        ...state,
        token: action.payload.accessToken,
        user: action.payload.user,
      };
    case actionTypes.UPDATE_USER:
      return {
        ...state,
        user: action.payload.user,
      };
    case actionTypes.LOGIN_FAIL:
    case actionTypes.LOGOUT:
    case actionTypes.REGISTER_FAIL:
      return {
        ...state,
        isLoggedIn: false,
        token: "",
        user: {},
      };

    default:
      return state;
  }
};

export default userReducer;
