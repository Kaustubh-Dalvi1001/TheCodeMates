import React from "react";
import logo from "../assets/TCM_Logo.png";

const LoginSignUpHeader = () => {
  return (
    <div>
      <header className="navbar bg-base-200 shadow-sm grid grid-cols-3 items-center">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a>Sign-Up</a>
            </li>
          </ul>
        </div>
        <div className="flex justify-center items-center gap-2 font-medium">
          <span className="text-xl">The Code Mates</span> <img src={logo} alt="Logo" className="w-[10%]" />
        </div>
      </header>
    </div>
  );
};

export default LoginSignUpHeader;
