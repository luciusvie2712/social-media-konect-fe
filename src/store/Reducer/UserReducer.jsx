import { isNil } from "lodash";
import actiontypes from "../Action/ActionTypes";

const INITIAL_STATE = {
  account: {
    email: "",
    avatar: "",
    roleId: "",
    name: "",
    gender: "",
    phoneNumber: "",
    id: "",
    accessToken: "",
  },
  isauthentic: false,
};

const UserReducer = (state = INITIAL_STATE, action) => {
  console.log(action);

  switch (action.type) {
    case actiontypes.USER_LOGIN_SUCCESS:
      return {
        ...state,
        account: {
          accessToken: action?.data?.payloadToken?.accessToken,
          email: action?.data?.data?.email,
          avatar: action?.data?.data?.avatar,
          roleId: action?.data?.data?.roleId,
          name: action?.data?.data?.name,
          gender: action?.data?.data?.gender,
          phoneNumber: action?.data?.data?.phoneNumber,
          id: action?.data?.data?._id,
        },
        isauthentic: true,
      };
    case actiontypes.USER_LOGIN_FAIL:
      return {
        ...state,
        account: null,
        isauthentic: false,
      };
    case actiontypes.USER_LOGOUT:
      return {
        ...state,
        account: null,
        isauthentic: false,
      };
    default:
      return state;
  }
};

export default UserReducer;
