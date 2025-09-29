import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../components/shared/ui/PasswordInput";
import checkStrong from "../../utils/CheckStrong";
import RequestLoader from "../../components/loaders/RequestLoader";
import { useRegisterMutation } from "../../features/auth/authApi";
import { errorNotify } from "../../utils/getNotify";

function Registration() {
  const { auth } = useSelector((state) => state.auth);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowIcon, setIsShowIcon] = useState(false);
  const [isStrong, setIsStrong] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const handleSignup = (event) => {
    event.preventDefault();
    const form = event.target;
    const firstName = form.firstName.value;
    const lastName = form.lastName.value;
    const email = form.email.value;
    const password = form.password.value;
    const data = {
      email,
      password,
      firstName,
      lastName,
    };
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    register(formData)
      .unwrap()
      .then((res) => {
        navigate("/");
      })
      .catch((error) => {
        errorNotify(error.data.message);
      });
  };

  return (
    <section className="h-screen bg-authBg bg-bottom bg-no-repeat bg-cover bg-whiteLow flex flex-col items-center justify-center w-full">
      <div className="flex flex-col">
        <div className="text-center mb-10">
          <h4 className="text-3xl text-primaryMain">Welcome back!</h4>
          <h1 className="text-5xl text-pureBlackColor font-bold">
            Register to continue
          </h1>
        </div>
        <div className="flex items-center justify-center py-12 px-10 bg-white shadow-md shadow-whiteLow rounded-lg w-[476px]">
          <form className="flex flex-col w-full gap-4 " onSubmit={handleSignup}>
            <div className="flex flex-col gap-1">
              <span className="text-blackHigh">First Name</span>
              <input
                type="text"
                placeholder="Enter your first name"
                required
                name="firstName"
                className={`w-full border border-slateLow  rounded-lg outline-none p-4`}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-blackHigh">Last Name</span>
              <input
                type="text"
                placeholder="Enter your last name"
                required
                name="lastName"
                className={`w-full border border-slateLow  rounded-lg outline-none p-4`}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-blackHigh">Email</span>
              <input
                type="email"
                placeholder="Enter your email address"
                required
                name="email"
                className={`w-full border border-slateLow  rounded-lg outline-none p-4`}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-blackHigh">Password</span>

              <div>
                <PasswordInput
                  isShowPassword={isShowPassword}
                  setIsShowPassword={setIsShowPassword}
                  isShowIcon={isShowIcon}
                  onInput={(e) => checkStrong(setIsShowIcon, setIsStrong, e)}
                  name="password"
                  placeholder={"Enter your password"}
                ></PasswordInput>
                {isStrong && (
                  <p className="text-xs text-fadeColor mt-1">
                    Must contain more than 7 character with uppercase,
                    lowercase, symble and number
                  </p>
                )}
              </div>
            </div>

            <button
              className="py-4 normal-case mt-4 mb-6 rounded-lg bg-primaryColor text-white font-semibold"
              type="submit"
            >
              {/* <img className="w-12" src={loginBtn} alt="login button" /> */}
              Sign Up
            </button>
          </form>
        </div>
      </div>
      {isLoading && <RequestLoader></RequestLoader>}
    </section>
  );
}

export default Registration;
