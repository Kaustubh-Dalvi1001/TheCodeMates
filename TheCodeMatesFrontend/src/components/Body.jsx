import React, { useEffect } from "react";
import NavBar from "./NavBar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "./api";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../store/userSlice";
import { toast } from "react-toastify";
import { useRef } from "react";

const PUBLIC_ROUTES = ["/login", "/signUp"];

const Body = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { status, profile } = useSelector((store) => store.userReucer);

  const {
    data: userData,
    isError,
    error: userDataError,
  } = useQuery({
    queryKey: ["loggedInUser"],
    queryFn: fetchUser,
    retry: false,
    enabled: status === "idle",
  });

  useEffect(() => {
    if (isError) {
      const httpStatus = userDataError?.response?.status;
      const backendErrorMessage = userDataError?.response?.data?.message;
      if (httpStatus === 401 || httpStatus === 404) {
        dispatch(removeUser());
        toast.error(backendErrorMessage);
        navigate("/login");
      }
    }
  }, [isError, userDataError, navigate, dispatch]);

  // console.log(userData?.userProfile ?? storeUserData);

  useEffect(() => {
    if (userData?.userProfile) {
      dispatch(addUser(userData.userProfile));
    }
  }, [userData, dispatch]);

  useEffect(() => {
    if (status === "authenticated" && location.pathname === "/") {
      navigate("/feed");
    }
  }, [status, location.pathname, navigate]);

  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Body;
