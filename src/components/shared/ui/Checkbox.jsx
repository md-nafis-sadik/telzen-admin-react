import React, { useState } from "react";

function Checkbox({ checked }) {
  const [isChecked, setIsChecked] = useState(checked || false);

  const toggleCheckbox = (e) => {
    if (e.target.checked) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  };

  return (
    <label className="flex items-center cursor-pointer">
      {/* Hidden input field */}
      <input
        type="checkbox"
        className="hidden absolute"
        checked={isChecked}
        onChange={toggleCheckbox}
      />

      {/* Custom checkbox icon */}
      <span className="relative  w-5 h-5 flex items-center justify-center">
        {/* Unchecked state SVG icon */}
        <svg
          className={`absolute w-5 h-5 text-neutral-500 pointer-events-none ${
            isChecked ? "opacity-0 scale-0" : "opacity-1 scale-1"
          }`}
          viewBox="0 0 16 16"
          fill="none"
        >
          {/* Use your provided unchecked SVG path here */}
          <path
            d="M3.99967 1.3335H11.9997C13.4724 1.3335 14.6663 2.5274 14.6663 4.00016V12.0002C14.6663 13.4729 13.4724 14.6668 11.9997 14.6668H3.99967C2.52692 14.6668 1.33301 13.4729 1.33301 12.0002V4.00016C1.33301 2.5274 2.52692 1.3335 3.99967 1.3335Z"
            stroke="#28303F"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Checked state SVG icon */}
        <svg
          className={`absolute w-5 h-5 text-white pointer-events-none ${
            isChecked ? "opacity-1 scale-1" : "opacity-0 scale-0"
          }`}
          viewBox="0 0 16 16"
          fill="none"
        >
          {/* Use your provided checked SVG path here */}
          <path
            d="M5.33301 8.00016L7.0228 9.52097C7.31046 9.77987 7.7574 9.74023 7.99501 9.43474L10.6663 6.00016M11.9997 1.3335H3.99967C2.52692 1.3335 1.33301 2.5274 1.33301 4.00016V12.0002C1.33301 13.4729 2.52692 14.6668 3.99967 14.6668H11.9997C13.4724 14.6668 14.6663 13.4729 14.6663 12.0002V4.00016C14.6663 2.5274 13.4724 1.3335 11.9997 1.3335Z"
            stroke="#28303F"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </label>
  );
}

export default Checkbox;
