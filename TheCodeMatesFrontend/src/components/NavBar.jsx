import React from "react";
import logo from "../assets/TCM_Logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "./api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { removeUser } from "../store/userSlice";
import { toast } from "react-toastify";
import { removeFeed } from "../store/feedSlice";
import { removeConnections } from "../store/connectionSlice";

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { mutate: logout } = useMutation({
    mutationFn: logoutUser,
    onSuccess: (data) => {
      console.log(data);
      toast.success(data);
      dispatch(removeUser());
      dispatch(removeFeed());
      dispatch(removeConnections());
      queryClient.cancelQueries();
      queryClient.clear();
      navigate("/login");
    },
    onError: (error) => {
      const backendErrorMessage = error.response.data.message ?? "Logout failed";
      console.error(`Error in logout: ${backendErrorMessage}`);
      toast.error(backendErrorMessage);
    },
  });

  return (
    <div className="navbar bg-base-200 shadow-sm">
      <div className="navbar-start">
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
            onClick={() => document.activeElement.blur()}
          >
            <li>
              <NavLink to="/feed">Feed</NavLink>
            </li>
            <li>
              <NavLink to="/profile">Profile</NavLink>
            </li>
            <li>
              <NavLink to="/connections">My Connections</NavLink>
            </li>
            <li>
              <button onClick={logout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <a className="btn btn-ghost text-xl">
          The Code Mates <img src={logo} alt="Logo" className="w-[10%]" />
        </a>
      </div>
      <div className="navbar-end">
        <button className="btn btn-ghost btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
        <button className="btn btn-ghost btn-circle">
          <div className="indicator">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="badge badge-xs badge-primary indicator-item"></span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default NavBar;
