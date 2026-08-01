import React from "react";
import Footer from "./Footer";
import LoginSignUpHeader from "./LoginSignUpHeader";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser } from "./api";
import { useDispatch } from "react-redux";
import { addUser } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { mutate: loginUserMutate } = useMutation({
    mutationFn: (userData) => loginUser(userData),
    onSuccess: (data) => {
      console.log(data);
      dispatch(addUser(data));
      toast.success(data.message);
      navigate("/feed");
    },
    onError: (error) => {
      const backendErrorMessage = error?.response?.data?.message;
      console.error("Error in login: ", backendErrorMessage);
      toast.error(backendErrorMessage);
    },
  });

  const submitData = async (userData) => {
    loginUserMutate(userData);
    reset();
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <LoginSignUpHeader />
      {/* Body */}
      <div className="flex-1 overflow-y-auto flex justify-center items-center">
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <form action="#" onSubmit={handleSubmit(submitData)}>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Login</legend>
                <label className="label">Email ID</label>
                <input
                  {...register("emailId", { required: true })}
                  type="email"
                  className="input"
                  placeholder="Email ID"
                  defaultValue="kaustubh@gmail.com"
                />
                {errors.emailId && <p className="text-red-400"> Email ID is required. </p>}
                <label className="label">Password</label>
                <input
                  {...register("password", { required: true })}
                  type="password"
                  className="input"
                  placeholder="Password"
                  defaultValue="Kaustubh@1001"
                />
                {errors.password && <p className="text-red-400"> Password is required. </p>}
                {/* <div>
                <a className="link link-hover">Forgot password?</a>
              </div> */}
                <button type="submit" className="btn btn-neutral mt-4">
                  Login
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Login;
