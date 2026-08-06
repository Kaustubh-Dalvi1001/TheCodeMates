import React, { useState } from "react";
import LoginSignUpHeader from "./LoginSignUpHeader";
import Footer from "./Footer";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { signupUser } from "./api";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../store/userSlice";
import { Eye, EyeOff, Mail, User, Lock, Loader2 } from "lucide-react";

const Signup = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { mutate: signupMutate, isPending } = useMutation({
    mutationFn: (data) => signupUser(data),
    onSuccess: (data) => {
      // console.log(data);
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
        <form action="#" onSubmit={handleSubmit(submitSignupData)} className="w-full max-w-sm">
          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-6 shadow-sm">
            <legend className="fieldset-legend text-xl font-semibold px-2">Create your account</legend>

            {/* Email */}
            <label className="label mt-2">
              Email ID <span className="text-red-300">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4.5 h-4.5 z-10 text-gray-400 absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none" />
              <input
                {...register("emailId")}
                required
                type="email"
                className="input pl-9 w-full focus:outline-primary transition-all"
                placeholder="you@example.com"
              />
            </div>

            {/* Username */}
            <label className="label mt-3">
              User Name <span className="text-red-300">*</span>
            </label>
            <div className="relative">
              <User className="w-4.5 h-4.5 z-10 text-gray-400 absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none" />
              <input
                {...register("userName")}
                required
                type="text"
                className="input pl-9 w-full focus:outline-primary transition-all"
                placeholder="Must be unique"
              />
            </div>

            {/* Password */}
            <label className="label mt-3">
              Password <span className="text-red-300">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4.5 h-4.5 z-10 text-gray-400 absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none" />
              <input
                {...register("password")}
                required
                type={passwordVisible ? "text" : "password"}
                className="input pl-9 pr-9 w-full focus:outline-primary transition-all"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setPasswordVisible((p) => !p)}
                className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 cursor-pointer"
                aria-label={passwordVisible ? "Hide password" : "Show password"}
                tabIndex={0}
              >
                {passwordVisible ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="btn btn-primary mt-6 w-full transition-transform active:scale-95 disabled:opacity-70"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin z-10" /> Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?
              <NavLink to="/login" className="link link-primary">
                Login
              </NavLink>
            </p>
          </fieldset>
        </form>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Signup;
