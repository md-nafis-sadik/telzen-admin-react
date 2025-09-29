import React, { useState } from "react";
import NotifyContainer from "../../utils/getNotify";
import SettingsFrom from "../forms/SettingsForm";

function Settings() {
  const [activeOption, setActiveOption] = useState("admin");

  const handleActiveOption = (option) => {
    setActiveOption(option);
  };
  return (
    <section className="w-full h-full overflow-auto px-8 py-6 flex flex-col md:flex-row gap-6">
      <div className="bg-white rounded-xl w-[240px] h-max">
        {/* <div
          onClick={() => handleActiveOption("notification")}
          className={`w-full px-3 py-4 text-center cursor-pointer rounded-t-xl hover:bg-[#FFF0F2] text-sm flex items-center gap-2 ${activeOption === "notification" ? "bg-[#FFF0F2]" : "bg-white"
            }`}
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M14.2333 5.20866L15.7083 6.68366L11.675 10.717C11.6 10.792 11.4917 10.8337 11.3833 10.8337H10.5C10.2667 10.8337 10.0833 10.6503 10.0833 10.417V9.53366C10.0833 9.42533 10.125 9.31699 10.2083 9.24199L14.2333 5.20866ZM16.9583 4.84199L16.075 3.95866C15.9083 3.79199 15.65 3.79199 15.4833 3.95866L14.775 4.66699L16.25 6.14199L16.9583 5.43366C17.125 5.26699 17.125 5.00033 16.9583 4.84199ZM16.25 15.0003C16.25 15.4587 15.875 15.8337 15.4167 15.8337H3.74999C3.29166 15.8337 2.91666 15.4587 2.91666 15.0003C2.91666 14.542 3.29166 14.167 3.74999 14.167H4.58332V8.33366C4.58332 6.00866 6.17499 4.05033 8.33332 3.50033V2.91699C8.33332 2.22533 8.89166 1.66699 9.58332 1.66699C10.275 1.66699 10.8333 2.22533 10.8333 2.91699V3.50033C11.5167 3.67533 12.1417 3.99199 12.675 4.40866L8.90832 8.17533C8.59166 8.49199 8.41666 8.90866 8.41666 9.35033V10.8337C8.41666 11.7503 9.16666 12.5003 10.0833 12.5003H11.5583C12 12.5003 12.425 12.3253 12.7333 12.0087L14.5833 10.167V14.167H15.4167C15.875 14.167 16.25 14.542 16.25 15.0003ZM7.91666 16.667H11.25C11.25 17.5837 10.5 18.3337 9.58332 18.3337C8.66666 18.3337 7.91666 17.5837 7.91666 16.667Z"
                fill={`${activeOption === "notification" ? "#F91632" : "#616161"
                  }`}
              />
            </svg>
          </span>
          <span className="text-sm">Notification API</span>
        </div>
        <div
          onClick={() => handleActiveOption("email")}
          className={`w-full px-3 py-4 text-center cursor-pointer hover:bg-[#FFF0F2] text-sm flex items-center gap-2 ${activeOption === "email" ? "bg-[#FFF0F2]" : "bg-white"
            }`}
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M16.6667 3.33301H3.33332C2.41666 3.33301 1.67499 4.08301 1.67499 4.99967L1.66666 14.9997C1.66666 15.9163 2.41666 16.6663 3.33332 16.6663H16.6667C17.5833 16.6663 18.3333 15.9163 18.3333 14.9997V4.99967C18.3333 4.08301 17.5833 3.33301 16.6667 3.33301ZM16.3333 6.87467L10.4417 10.558C10.175 10.7247 9.82499 10.7247 9.55832 10.558L3.66666 6.87467C3.45832 6.74134 3.33332 6.51634 3.33332 6.27467C3.33332 5.71634 3.94166 5.38301 4.41666 5.67467L9.99999 9.16634L15.5833 5.67467C16.0583 5.38301 16.6667 5.71634 16.6667 6.27467C16.6667 6.51634 16.5417 6.74134 16.3333 6.87467Z"
                fill={`${activeOption === "email" ? "#F91632" : "#616161"}`}
              />
            </svg>
          </span>
          <span className="text-sm">Email(Twillio) API</span>
        </div> */}
        <div
          onClick={() => handleActiveOption("admin")}
          className={`w-full px-3 py-4 text-center cursor-pointer rounded-xl hover:bg-[#FFF0F2] transition-colors text-sm flex items-center gap-2 ${activeOption === "admin" ? "bg-[#FFF0F2]" : "bg-white"
            }`}
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M15 7.08333H14.1667V5.41667C14.1667 3.11667 12.3 1.25 10 1.25C7.70001 1.25 5.83334 3.11667 5.83334 5.41667V7.08333H5.00001C4.08334 7.08333 3.33334 7.83333 3.33334 8.75V17.0833C3.33334 18 4.08334 18.75 5.00001 18.75H15C15.9167 18.75 16.6667 18 16.6667 17.0833V8.75C16.6667 7.83333 15.9167 7.08333 15 7.08333ZM10 14.5833C9.08334 14.5833 8.33334 13.8333 8.33334 12.9167C8.33334 12 9.08334 11.25 10 11.25C10.9167 11.25 11.6667 12 11.6667 12.9167C11.6667 13.8333 10.9167 14.5833 10 14.5833ZM7.50001 7.08333V5.41667C7.50001 4.03333 8.61668 2.91667 10 2.91667C11.3833 2.91667 12.5 4.03333 12.5 5.41667V7.08333H7.50001Z"
                fill={`${activeOption === "admin" ? "#F91632" : "#616161"}`}
              />
            </svg>
          </span>
          <span className="text-sm">Admin Password</span>
        </div>
      </div>
      {activeOption === "admin" && (
        <div className="bg-white rounded-2xl p-4 w-full h-max ">
          <SettingsFrom></SettingsFrom>
        </div>
      )}
      <NotifyContainer></NotifyContainer>
    </section>
  );
}

export default Settings;
