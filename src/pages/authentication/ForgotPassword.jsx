import { Link } from "react-router-dom";
import RequestLoader from "../../components/loaders/RequestLoader";
import PasswordInput from "../../components/shared/ui/PasswordInput";
import NotifyContainer from "../../utils/notify";
import { useForgotPassword } from "../../hooks/useForgotPassword";

function ForgotPassword() {
  const {
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
    isShowPassword,
    setEmail,
  } = useForgotPassword();

  return (
    <section className="h-screen bg-whiteLow bg-authBg bg-bottom bg-no-repeat bg-cover flex flex-col items-center justify-center w-full">
      <div className="flex flex-col">
        <div className="text-center mb-10">
          <h1 className="text-5xl text-pureBlackColor font-bold">
            {step === 1 && "Forgot Password"}
            {step === 2 && "Verify OTP"}
            {step === 3 && "Reset Password"}
            {step === 4 && "Password Reset Successful!"}
          </h1>
        </div>

        <div className="flex items-center justify-center py-12 px-10 bg-white shadow-md shadow-whiteLow rounded-lg w-[476px]">
          {step === 1 && (
            <form
              className="flex flex-col w-full gap-4"
              onSubmit={handleSendCode}
            >
              <div className="flex flex-col gap-1">
                <span className="text-blackHigh">Email</span>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-slateLow rounded-lg outline-none p-4"
                />
              </div>
              <button
                className="py-4 normal-case mt-4 rounded-lg bg-primaryColor text-white font-semibold disabled:opacity-50"
                type="submit"
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Send Code"}
              </button>
              <div className="text-center">
                <Link to="/login" className="text-lg font-medium">
                  Back to Login
                </Link>
              </div>
            </form>
          )}

          {step === 2 && (
            <form
              className="flex flex-col w-full gap-6"
              onSubmit={handleVerifyOtp}
            >
              <div className="flex flex-col gap-1">
                <span className="text-blackHigh">Verification Code</span>
                <div className="flex justify-center gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      ref={(el) => (otpInputs.current[index] = el)}
                      className="w-14 h-14 text-center text-2xl font-semibold border border-slateLow rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor"
                    />
                  ))}
                </div>
                <p className="text-sm text-neutral-500 text-center mt-2">
                  Enter the 4-digit code sent to your email
                </p>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-primaryColor font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isResending || resendTimer > 0}
                  >
                    {isResending ? "Resending..." : "Resend Code"}
                  </button>
                  {resendTimer > 0 && (
                    <span className="text-sm text-neutral-500">
                      ({resendTimer}s)
                    </span>
                  )}
                </div>

                <button
                  className="py-4 normal-case px-8 rounded-lg bg-primaryColor text-white font-semibold disabled:opacity-50"
                  type="submit"
                  disabled={isVerifying || otp.join("").length !== 4}
                >
                  {isVerifying ? "Verifying..." : "Verify"}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form
              className="flex flex-col w-full gap-4"
              onSubmit={handleResetPassword}
            >
              <div className="flex flex-col gap-1">
                <span className="text-blackHigh">New Password</span>
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isShowPassword={isShowPassword}
                  setIsShowPassword={setIsShowPassword}
                  placeholder="Enter new password"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-blackHigh">Confirm Password</span>
                <PasswordInput
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  isShowPassword={isShowConfirmPassword}
                  setIsShowPassword={setIsShowConfirmPassword}
                  placeholder="Confirm new password"
                />
              </div>
              <button
                className="py-4 normal-case mt-4 rounded-lg bg-primaryColor text-white font-semibold disabled:opacity-50"
                type="submit"
                disabled={isResetting}
              >
                {isResetting ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          {step === 4 && (
            <div className="text-center py-8">
              <svg
                className="w-16 h-16 text-green-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h3 className="text-2xl font-semibold mb-4">
                Password Reset Successful!
              </h3>
              <p className="mb-6">
                Your password has been updated successfully.
              </p>
              <Link
                onClick={backtoLogin}
                className="py-3 px-6 inline-block rounded-lg bg-primaryColor text-white font-semibold"
              >
                Back to Login
              </Link>
            </div>
          )}
        </div>
        {isLoading && <RequestLoader />}
        <NotifyContainer />
      </div>
    </section>
  );
}

export default ForgotPassword;
