import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { connectionRequest, userFeed } from "./api";
import { data } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addFeed, removeFeed } from "../store/feedSlice";
import UserCard from "./UserCard";
import { Sparkles } from "lucide-react";

const Feed = () => {
  const storeUserFeed = useSelector((store) => store.feedReducer);

  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  const {
    data: feed,
    isError,
    error: feedError,
  } = useQuery({
    queryKey: ["userFeed"],
    queryFn: userFeed,
    // enabled: !storeUserFeed,
    placeholderData: keepPreviousData,
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

  const { mutate: connectionReqMutate } = useMutation({
    mutationFn: (reqData) => connectionRequest(reqData),
    onSuccess: (data) => {
      // dispatch(removeFeed());
      queryClient.invalidateQueries({ queryKey: ["userFeed"] });
      toast.success(data.message);
      // console.log(data);
    },
    onError: (error) => {
      console.log(error);
      const errorMessage = error?.response?.data?.message ?? error.message ?? "Error in connection request.";
      toast.error(errorMessage);
    },
  });

  if (!feed?.data) {
    return (
      <div className="hero min-h-[60vh]">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <Sparkles className="h-20 w-20 mx-auto text-base-content/30" strokeWidth={1.5} />
            <h3 className="text-xl font-bold mt-4">You're all caught up</h3>
            <p className="py-4 text-base-content/70">
              {feed?.message || "No new profiles to show right now. Check back later!"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-full">
      {storeUserFeed && <UserCard user={storeUserFeed[0]} mutateFn={connectionReqMutate} />}
    </div>
  );
};

export default Feed;
