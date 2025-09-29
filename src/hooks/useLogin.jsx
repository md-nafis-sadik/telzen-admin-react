import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useLoginMutation,
} from "../features/auth/authApi";
import { errorNotify } from "../utils/notify";

export const useLogin = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowIcon, setIsShowIcon] = useState(false);
  const navigate = useNavigate();
  const { auth } = useSelector((state) => state.auth);
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value.trim();
    const password = form.password.value.trim();
    const data = { email, password };

    // Form validation
    if (!email) {
      errorNotify("Email is required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorNotify("Invalid email address");
      return;
    }

    if (!password) {
      errorNotify("Password is required");
      return;
    }

    try {
      await login(data).unwrap();
      navigate("/");
    } catch (error) {
      errorNotify(error?.data?.message || "Login failed");
    }
  };

  return {
    isShowPassword,
    setIsShowPassword,
    isShowIcon,
    setIsShowIcon,
    navigate,
    auth,
    isLoading,
    handleLogin,
  };
};
