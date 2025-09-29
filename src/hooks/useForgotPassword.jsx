import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useForgetPasswordResendCodeMutation,
  useForgetPasswordSendCodeMutation,
  useForgetPasswordVerifyOtpMutation,
  useForgetPasswordResetMutation,
} from "../features/auth/authApi";
import { errorNotify, successNotify } from "../utils/notify";

export const useForgotPassword = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Try to get state from URL params first, then fall back to localStorage
  const urlStep = searchParams.get("step");
  const urlEmail = searchParams.get("email");
  const urlToken = searchParams.get("token");

  // Load state from localStorage only if no URL params are present
  const savedState =
    urlStep || urlEmail || urlToken
      ? {}
      : JSON.parse(localStorage.getItem("forgotPasswordState")) || {};

  const [step, setStep] = useState(
    urlStep ? parseInt(urlStep) : savedState.step || 1
  );
  const [email, setEmail] = useState(urlEmail || savedState.email || "");
  const [token, setToken] = useState(urlToken || savedState.token || "");
  const [otp, setOtp] = useState(savedState.otp || ["", "", "", ""]);
  const [password, setPassword] = useState(savedState.password || "");
  const [confirmPassword, setConfirmPassword] = useState(
    savedState.confirmPassword || ""
  );
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(savedState.resendTimer || 0);
  const otpInputs = useRef([]);

  const [sendCode, { isLoading: isSending }] =
    useForgetPasswordSendCodeMutation();
  const [resendCode, { isLoading: isResending }] =
    useForgetPasswordResendCodeMutation();
  const [verifyOtp, { isLoading: isVerifying }] =
    useForgetPasswordVerifyOtpMutation();
  const [resetPassword, { isLoading: isResetting }] =
    useForgetPasswordResetMutation();

  useEffect(() => {
    // If there are no search params at all, reset the state
    if (searchParams.toString() === "") {
      setStep(1);
      setEmail("");
      setToken("");
      setOtp(["", "", "", ""]);
      setPassword("");
      setConfirmPassword("");
      setResendTimer(0);
      localStorage.removeItem("forgotPasswordState");
    }
  }, [searchParams]);

  // Update URL params and localStorage whenever state changes
  useEffect(() => {
    // Update URL params
    const params = {};
    if (step > 1) params.step = step;
    if (email) params.email = email;
    if (token) params.token = token;
    setSearchParams(params);

    // Save state to localStorage
    const stateToSave = {
      step,
      email,
      token,
      otp,
      password,
      confirmPassword,
      resendTimer,
    };
    localStorage.setItem("forgotPasswordState", JSON.stringify(stateToSave));
  }, [
    step,
    email,
    token,
    otp,
    password,
    confirmPassword,
    resendTimer,
    setSearchParams,
  ]);

  // Handle resend timer countdown
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Focus first OTP input when step changes to 2
  useEffect(() => {
    if (step === 2 && otpInputs.current[0]) {
      otpInputs.current[0].focus();
    }
  }, [step]);

  const handleOtpChange = (index, value) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 3 && otpInputs.current[index + 1]) {
        otpInputs.current[index + 1].focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    try {
      const response = await sendCode(email).unwrap();

      // Handle different response structures
      const token = response?.token || response?.data?.token;

      if (!token) {
        throw new Error(
          response?.message ||
            "Verification code sent, but missing token. Please check your email."
        );
      }

      setToken(token);
      setStep(2);
      setResendTimer(60);
      successNotify("Verification code sent to your email");
    } catch (err) {
      console.error("Error details:", err);

      // User-friendly error messages
      const errorMessage =
        err?.data?.errorMessages?.[0]?.message ||
        err?.data?.message ||
        err?.message ||
        "Failed to send verification code. Please try again.";

      errorNotify(errorMessage);
    }
  };

  const handleResendCode = async () => {
    try {
      await resendCode(token).unwrap();
      setResendTimer(60); // Reset timer to 60 seconds
      setOtp(["", "", "", ""]);
      if (otpInputs.current[0]) otpInputs.current[0].focus();
      successNotify("New verification code sent");
    } catch (err) {
      errorNotify(err?.data?.message || "Failed to resend code");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 4) {
      errorNotify("Please enter the complete 4-digit code");
      return;
    }
    try {
      const result = await verifyOtp({ code: otpCode, token }).unwrap();
      setToken(result.data.token);
      setStep(3);
      successNotify("Otp Verified");
    } catch (err) {
      errorNotify(err?.data?.message || "Invalid verification code");
      setOtp(["", "", "", ""]);
      if (otpInputs.current[0]) otpInputs.current[0].focus();
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      errorNotify("Passwords don't match!");
      return;
    }
    try {
      await resetPassword({ password, token }).unwrap();
      setStep(4);
    } catch (err) {
      errorNotify(err?.data?.message || "Password reset failed");
    }
  };

  const backtoLogin = () => {
    navigate("/login");
    localStorage.removeItem("forgotPasswordState");
  };

  const isLoading = isSending || isResending || isVerifying || isResetting;

  return {
    handleSendCode,
    isSending,
    otpInputs,
    isResending,
    resendTimer,
    isVerifying,
    handleResetPassword,
    setPassword,
    setIsShowPassword,
    setConfirmPassword,
    isShowConfirmPassword,
    setIsShowConfirmPassword,
    isResetting,
    backtoLogin,
    isLoading,
    step,
    email,
    otp,
    password,
    confirmPassword,
    handleOtpChange,
    handleOtpKeyDown,
    handleResendCode,
    handleVerifyOtp,
    setEmail,
    isShowPassword,
  };
};
