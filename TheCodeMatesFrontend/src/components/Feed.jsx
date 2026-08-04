import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { userFeed } from "./api";
import { data } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../store/feedSlice";
import UserCard from "./UserCard";

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
        return (
          <div key={eachUser._id} className="flex justify-center items-center">
            <UserCard user={eachUser} />
          </div>
        );
      })}
    </div>
  );
};

export default Feed;
