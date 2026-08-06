import React from "react";
import LoginSignUpHeader from "./LoginSignUpHeader";
import Footer from "./Footer";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { signupUser } from "./api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../store/userSlice";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { mutate: signupMutate } = useMutation({
    mutationFn: (data) => signupUser(data),
    onSuccess: (data) => {
      console.log(data);
      dispatch(addUser(data.userData));
      toast.success(data.message);
      navigate("/profile");
    },
    onError: (error) => {
      console.log(error);
      const errorMessage = error?.response?.data?.message ?? error.message ?? "Error in user signup.";
      toast.error(errorMessage);
    },
  });

  const submitSignupData = (data) => {
    signupMutate(data);
    reset();
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <LoginSignUpHeader page="signup" />
      {/* Body */}
      <div className="flex-1 overflow-y-auto flex justify-center items-center">
        <form action="#" onSubmit={handleSubmit(submitSignupData)}>
          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
            <legend className="fieldset-legend">Sign Up</legend>

            <label className="label">
              Email ID <span className="text-red-300">*</span>
            </label>
            <input
              {...register("emailId")}
              required
              type="email"
              className="input"
              placeholder="Email ID"
              //   defaultValue="kaustubh@gmail.com"
            />

            <label className="label">
              User Name <span className="text-red-300">*</span>
            </label>
            <input
              {...register("userName")}
              required
              type="text"
              className="input"
              placeholder="User name should be unique."
              //   defaultValue="kaustubh"
            />

            <label className="label">
              Password <span className="text-red-300">*</span>
            </label>
            <input
              {...register("password")}
              required
              type="password"
              className="input"
              placeholder="Password"
              //   defaultValue="kaustubh"
            />

            <button type="submit" className="btn btn-neutral mt-4">
              Sign Up
            </button>
          </fieldset>
        </form>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Signup;
