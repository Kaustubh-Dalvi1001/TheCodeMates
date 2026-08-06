import React from "react";
import logo from "../assets/TCM_Logo.png";
import { NavLink } from "react-router-dom";

const LoginSignUpHeader = ({ page }) => {
  return (
    <div>
      <header className="navbar bg-base-200 shadow-sm flex justify-center items-center">
        <div className="flex justify-center items-center gap-2 font-medium">
          <span className="text-xl">The Code Mates</span> <img src={logo} alt="Logo" className="w-[10%]" />
        </div>
      </header>
    </div>
  );
};

export default LoginSignUpHeader;
