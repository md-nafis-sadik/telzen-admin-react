import React from "react";
import { logoIcon } from "../../assets/getAssets";

function AuthLoader() {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black-25 flex items-center justify-center z-[999]">
      <div className="w-20 h-20 rounded-md flex items-center justify-center bg-white">
        <img src={logoIcon} alt="" className="w-full p-4" />
      </div>
    </div>
  );
}

export default AuthLoader;
