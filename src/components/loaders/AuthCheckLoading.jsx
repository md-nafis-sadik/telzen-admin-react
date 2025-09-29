import React from "react";
import { authLoader } from "../../assets/getAssets";

function AuthCheckLoading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <img src={authLoader} alt="" className="max-w-96" />
    </div>
  );
}

export default AuthCheckLoading;
