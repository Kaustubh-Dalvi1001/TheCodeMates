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

const Body = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const hasFetchedOnce = useRef(false);
  const storeUserData = useSelector((store) => store.userReucer);

  const {
    data: userData,
    isError,
    error: userDataError,
  } = useQuery({
    queryKey: ["loggedInUser"],
    queryFn: fetchUser,
    retry: false,
    enabled: !storeUserData && !hasFetchedOnce.current,
  });

  useEffect(() => {
    if (storeUserData) {
      hasFetchedOnce.current = true;
    }
  }, [storeUserData]);

  useEffect(() => {
    if (userData || isError) {
      hasFetchedOnce.current = true;
    }
  }, [userData, isError]);

  useEffect(() => {
    if (isError && !storeUserData) {
      const status = userDataError?.response?.status;
      const backendErrorMessage = userDataError?.response?.data?.message;
      if (status === 404) {
        console.log(`Error is loading the user data: ${backendErrorMessage}`);
        toast.error(backendErrorMessage);
        navigate("/login");
      }
    }
  }, [isError, userDataError, navigate]);

  console.log(userData?.userProfile ?? storeUserData);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(addUser(userData?.userProfile));
  }, [userData, dispatch]);

  useEffect(() => {
    if (storeUserData && location.pathname === "/") {
      navigate("/feed");
    }
  }, [storeUserData]);

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
