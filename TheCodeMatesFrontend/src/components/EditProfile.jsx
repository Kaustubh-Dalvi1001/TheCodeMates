import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserPlus, UserX } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "./api";
import { addUser } from "../store/userSlice";
import { toast } from "react-toastify";

const EditProfile = () => {
  const storeUserData = useSelector((store) => store.userReucer);
  console.log(storeUserData);

  const { _id, userName, firstName, lastName, age, gender, bio, Technical_skills, emailId } =
    storeUserData ?? {};

  const [inputChar, setInpChar] = useState({
    firstNameChar: 0,
    lastNameChar: 0,
    userNameChar: 0,
    bioChar: 0,
    skillChar: 0,
  });

  const queryClient = useQueryClient();

  const dispatch = useDispatch();

  const inputCharStyle = "text-xs text-gray-400 absolute right-1 mt-5";

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    values: {
      firstName,
      lastName,
      age,
      gender,
      bio,
    },
  });

  // technical skills
  const skills = watch("Technical_skills") || [];

  useEffect(() => {
    setValue("Technical_skills", Technical_skills);
  }, [Technical_skills]);
  // This effect should only run once, when the profile data first loads — not every time skills changes (since skills changing is caused by this effect and by your own remove/add actions, creating a feedback loop). Drop skills from the dependency array entirely.

  const handleSkillInput = (e) => {
    const value = e.target.value.trim();
    if ((e.key === "Enter" || e.key === ",") && value) {
      e.preventDefault();

      if (skills?.length >= 20) return;
      if (skills.includes(value)) {
        e.target.value = "";
        return;
      }

      setValue("Technical_skills", [...skills, value], { shouldValidate: true });
      setInpChar((prev) => ({ ...prev, skillChar: 0 }));
      e.target.value = "";
    }
  };

  const handleRemoveSkill = (index) => {
    setValue(
      "Technical_skills",
      skills.filter((_, i) => i !== index),
      { shouldValidate: true },
    );
  };

  useEffect(() => {
    register("Technical_skills", {
      validate: (value) => {
        // value here is the whole technicalSkills array
        if (!value || value.length === 0) return "At least one technical skill is required";
        return true;
      },
    });
  }, [register]);

  // update profile
  const { mutate } = useMutation({
    mutationFn: (data) => updateUserProfile(data),
    onSuccess: (updatedData) => {
      // console.log(updatedData?.updatedUser);
      dispatch(addUser(updatedData.updatedUser));
      queryClient.invalidateQueries(["loggedInUser"]);
      toast.success(updatedData.message);
    },
    onError: (error) => {
      const backendErrorMessage = error?.response?.data?.message;
      console.error("Error in updating user profile: " + error);

      toast.error(backendErrorMessage);
    },
  });

  const handleEditProfile = (data) => {
    console.log(data);
    mutate(data);
  };
  return (
    <div className="flex justify-center gap-5">
      {/* usercard */}
      <div>
        <div className="card bg-base-200 w-96 shadow-lg m-4">
          <div className="card-body">
            <h2 className="card-title">{userName}</h2>
            <div>
              {firstName} {lastName}
            </div>
            <div>
              {gender} {age}
            </div>
            <div>{bio}</div>
            <div>
              {Technical_skills?.map((eachSkill, index) => (
                <span key={index}> {eachSkill} </span>
              ))}
            </div>
            {/* <div className="card-actions justify-end">
              <button className="btn btn-soft">
                <UserX className="w-4 h-4" /> Ignore
              </button>
              <button className="btn btn-secondary">
                <UserPlus className="w-4 h-4" /> Connect
              </button>
            </div> */}
          </div>
        </div>
      </div>

      {/* edit user card */}
      <form action="#" onSubmit={handleSubmit(handleEditProfile)}>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xl border p-4">
          <legend className="fieldset-legend">Edit Profile</legend>
          <div className="grid grid-cols-2 gap-2">
            {/* email id */}
            <div>
              <label className="label">Email ID</label>
              <input type="text" className="input pr-10" value={emailId ?? ""} disabled />
            </div>

            {/* user name */}
            <div>
              <label className="label">User Name</label>
              <input type="text" className="input pr-10" value={userName ?? ""} disabled />
            </div>

            {/* first name */}
            <div className="relative">
              <label className="label">
                First Name <span className="text-red-300">*</span>
              </label>
              <input
                {...register("firstName", {
                  required: { value: true, message: "First Name is required." },
                })}
                type="text"
                className="input pr-10"
                maxLength={50}
                onChange={(e) => setInpChar((prev) => ({ ...prev, firstNameChar: e.target.value.length }))}
                placeholder="First Name"
              />
              {inputChar.firstNameChar > 0 && (
                <span className={inputCharStyle}>{inputChar.firstNameChar}/50</span>
              )}
              {errors.firstName && <p className="text-red-400"> {errors.firstName.message} </p>}
            </div>

            {/* last name */}
            <div className="relative">
              <label className="label">
                Last Name <span className="text-red-300">*</span>
              </label>
              <input
                {...register("lastName", {
                  required: { value: true, message: "Last Name is required." },
                })}
                type="text"
                className="input pr-10"
                placeholder="Last Name"
                maxLength={50}
                onChange={(e) => setInpChar((prev) => ({ ...prev, lastNameChar: e.target.value.length }))}
              />
              {inputChar.lastNameChar > 0 && (
                <span className={inputCharStyle}>{inputChar.lastNameChar}/50</span>
              )}
              {errors.lastName && <p className="text-red-400"> {errors.lastName.message} </p>}
            </div>

            {/* age */}
            <div>
              <label className="label">
                Age <span className="text-red-300">*</span>
              </label>
              <input
                {...register("age", {
                  required: { value: true, message: "Age is required" },
                  min: { value: 10, message: "Minimum age should be 10 years old." },
                  max: { value: 100, message: "Maximum age should be 100 years old." },
                })}
                type="number"
                className="input"
                placeholder="Age"
              />
              {errors.age && <p className="text-red-400"> {errors.age.message} </p>}
            </div>

            {/* gender */}
            <div className="flex flex-col gap-2">
              <label className="label">
                Gender <span className="text-red-300">*</span>
              </label>
              <div className="flex justify-around">
                <label className="flex gap-2 items-center">
                  <input
                    {...register("gender", { required: { value: true, message: "Gender is required." } })}
                    type="radio"
                    value="male"
                    className="radio"
                  />
                  <span> Male </span>
                </label>

                <label className="flex gap-2 items-center">
                  <input
                    {...register("gender", { required: true, message: "Gender is required." })}
                    type="radio"
                    value="female"
                    className="radio"
                  />
                  <span> Female</span>
                </label>

                <label className="flex gap-2 items-center">
                  <input
                    {...register("gender", { required: { value: true, message: "Gender is required." } })}
                    type="radio"
                    value="others"
                    className="radio"
                  />
                  <span> Others </span>
                </label>
              </div>

              {errors.gender && <p className="text-red-400"> {errors.gender.message} </p>}
            </div>

            {/* bio */}
            <div className="relative col-span-2">
              <label className="label">Bio</label>
              <input
                {...register("bio")}
                type="text"
                className="input pr-12 w-full"
                placeholder="Bio"
                maxLength={200}
                onChange={(e) => setInpChar((prev) => ({ ...prev, bioChar: e.target.value.length }))}
              />
              {inputChar.bioChar > 0 && <span className={inputCharStyle}> {inputChar.bioChar}/200 </span>}
              {errors.bio && <p className="text-red-400"> {errors.bio.message} </p>}
            </div>

            {/* technical skills */}
            <div className="col-span-2 relative">
              <label className="label">
                Technical Skills <span className="text-red-300">*</span>
              </label>
              <input
                type="text"
                className="input w-full pr-13"
                placeholder="Type a skill and press Enter (max 20)"
                onKeyDown={handleSkillInput}
                disabled={skills?.length >= 20}
                onChange={(e) => setInpChar((prev) => ({ ...prev, skillChar: e.target.value.length }))}
                maxLength={50}
              />
              {inputChar.skillChar > 0 && <span className={inputCharStyle}>{inputChar.skillChar}/50</span>}
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 my-2">
                  {skills.map((skill, i) => {
                    return (
                      <span key={i} className="badge badge-soft badge-primary">
                        {skill}
                        <button type="button" onClick={() => handleRemoveSkill(i)} className="cursor-pointer">
                          x
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}

              <p> {skills.length}/20 skills added </p>
              {errors.Technical_skills && <p className="text-red-400"> {errors.Technical_skills.message} </p>}
            </div>
          </div>

          <button type="submit" className="btn btn-neutral mt-4">
            Update Profile
          </button>
        </fieldset>
      </form>
    </div>
  );
};

export default EditProfile;
