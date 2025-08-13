import { toast } from "react-toastify";
import { loginUserAPI } from "../../utils/api.customize";
import actiontypes from "./ActionTypes";

export const loginUserRedux = (email, password) => {
  return async (dispatch, getState) => {
    let res = await loginUserAPI(email, password);
    console.log(res);
    try {
      if (res?.Ec === 0) {
        dispatch({
          type: actiontypes.USER_LOGIN_SUCCESS,
          data: res,
        });
      } else {
        toast.error(res?.Mes);
        dispatch({
          type: actiontypes.USER_LOGIN_FAIL,
        });
      }
    } catch (e) {
      console.log("err", e);
      dispatch({
        type: actiontypes.USER_LOGIN_FAIL,
      });
    }
  };
};
