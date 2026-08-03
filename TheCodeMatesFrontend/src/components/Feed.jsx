import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { userFeed } from "./api";
import { data } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../store/feedSlice";
import { UserPlus, UserX } from "lucide-react";

const Feed = () => {
  const storeUserFeed = useSelector((store) => store.feedReducer);

  const dispatch = useDispatch();

  const {
    data: feed,
    isError,
    error: feedError,
  } = useQuery({
    queryKey: ["userFeed"],
    queryFn: userFeed,
    enabled: !storeUserFeed,
  });

  if (isError) {
    const backendErrorMessage = feedError.response.data.message;
    console.error(backendErrorMessage);
    toast.error("Error in loading feed: " + backendErrorMessage);
  }

  // console.log(feed?.data);

  useEffect(() => {
    dispatch(addFeed(feed?.data));
  }, [feed]);

  // console.log(storeUserFeed);

  return (
    <div>
      {storeUserFeed?.map((eachUser) => {
        const { _id, firstName, lastName, userName, gender, age, bio, Technical_skills } = eachUser;
        return (
          <div key={_id} className="flex justify-center items-center">
            <div className="card bg-base-200 w-96 shadow-lg">
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
                <div className="card-actions justify-end">
                  <button className="btn btn-soft">
                    <UserX className="w-4 h-4" /> Ignore
                  </button>
                  <button className="btn btn-secondary">
                    <UserPlus className="w-4 h-4" /> Connect
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Feed;
