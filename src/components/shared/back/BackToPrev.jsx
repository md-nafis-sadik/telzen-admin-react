import React from "react";
import { Link } from "react-router-dom";

function BackToPrev({ path, title }) {
  return (
    <div className="mb-5">
      <Link to={path} className="inline-flex items-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
        >
          <path
            d="M22.9862 12C22.9862 12.552 22.5392 13 21.9862 13H6.40021L11.6932 18.293C12.0842 18.684 12.0842 19.3161 11.6932 19.7071C11.4982 19.9021 11.2422 20 10.9862 20C10.7302 20 10.4741 19.9021 10.2791 19.7071L3.2801 12.708C3.1871 12.615 3.11405 12.5051 3.06305 12.3821C2.96205 12.1381 2.96205 11.862 3.06305 11.618C3.11405 11.495 3.1871 11.385 3.2801 11.292L10.2791 4.29301C10.6701 3.90201 11.3022 3.90201 11.6932 4.29301C12.0842 4.68401 12.0842 5.31607 11.6932 5.70707L6.40021 11H21.9862C22.5392 11 22.9862 11.448 22.9862 12Z"
            fill="#25314C"
          />
        </svg>
        <span className="text-blackHigh font-semibold text-xl">{title}</span>
      </Link>
    </div>
  );
}

export default BackToPrev;
