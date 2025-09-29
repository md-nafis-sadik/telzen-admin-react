import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logout, setAuth } from "../features/auth/authSlice";

export default function useAuthCheck() {
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const localAuth = localStorage?.getItem("telzenAuth");

    if (localAuth) {
      const auth = JSON.parse(localAuth);

      if (auth?.auth?.email) {
        dispatch(setAuth(auth));
      } else {
        dispatch(logout());
      }
    } else {
      dispatch(logout());
    }
    setAuthChecked(true);
  }, [dispatch, setAuthChecked]);

  return authChecked;
}
