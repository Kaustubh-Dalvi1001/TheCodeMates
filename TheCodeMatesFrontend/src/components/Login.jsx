import React, { useState } from "react";
import Footer from "./Footer";
import LoginSignUpHeader from "./LoginSignUpHeader";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser } from "./api";
import { useDispatch } from "react-redux";
import { addUser } from "../store/userSlice";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { mutate: loginUserMutate, isPending } = useMutation({
    mutationFn: (userData) => loginUser(userData),
    onSuccess: (data) => {
      // console.log(data.loggedInUser);
      dispatch(addUser(data.loggedInUser));
      toast.success(data.message);
      navigate("/feed");
    },
    onError: (error) => {
      const backendErrorMessage = error?.response?.data?.message;
      console.error("Error in login: ", backendErrorMessage);
      toast.error(backendErrorMessage);
    },
  });

  const submitLoginData = async (userData) => {
    loginUserMutate(userData);
    reset();
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <LoginSignUpHeader />
      {/* Body */}
      <div className="flex-1 overflow-y-auto flex justify-center items-center">
        <form action="#" onSubmit={handleSubmit(submitLoginData)} className="w-full max-w-sm">
          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-6 shadow-sm">
            <legend className="fieldset-legend text-xl font-semibold px-2">Login</legend>

            {/* email id */}
            <label className="label mt-2">Email ID</label>
            <div className="relative">
              <Mail className="w-4.5 h-4.5 z-10 text-gray-400 absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none" />
              <input
                {...register("emailId", { required: true })}
                type="email"
                className="input pl-9 w-full focus:outline-primary transition-all"
                placeholder="you@example.com"
                defaultValue="natasha@gmail.com"
              />
              {errors.emailId && <p className="text-red-400"> Email ID is required. </p>}
            </div>

            {/* password */}
            <label className="label mt-3">Password</label>
            <div className="relative">
              <Lock className="w-4.5 h-4.5 z-10 text-gray-400 absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none" />
              <div>
                <input
                  {...register("password", { required: true })}
                  type={passwordVisible ? "text" : "password"}
                  className="input pl-9 pr-9 w-full focus:outline-primary transition-all"
                  placeholder="Password"
                  defaultValue="Natasha@1001"
                />
              </div>
              <button
                type="button"
                onClick={() => setPasswordVisible((p) => !p)}
                className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 cursor-pointer"
                aria-label={passwordVisible ? "Hide password" : "Show password"}
                tabIndex={0}
              >
                {passwordVisible ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
              {errors.password && <p className="text-red-400"> Password is required. </p>}
            </div>
            {/* <div>
                <a className="link link-hover">Forgot password?</a>
              </div> */}
            <button
              type="submit"
              disabled={isPending}
              className="btn btn-primary mt-6 w-full transition-transform active:scale-95 disabled:opacity-70"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin z-10" /> Loggin in...
                </>
              ) : (
                "Sign Up"
              )}
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Don't have an account?
              <NavLink to="/signup" className="link link-primary">
                Sign Up
              </NavLink>
            </p>
          </fieldset>
        </form>a
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Login;
