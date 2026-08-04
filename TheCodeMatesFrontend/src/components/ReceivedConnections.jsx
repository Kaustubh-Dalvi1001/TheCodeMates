import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { fetchReceivedConnections, reviewRequest } from "./api";
import { toast } from "react-toastify";
import UserCard from "./UserCard";
import { UserRoundPlus } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addReceivedRequests, removeReceivedRequests } from "../store/receivedRequestSlice";

const ReceivedConnections = () => {
  const dispatch = useDispatch();

  const storeReceivedRequests = useSelector((store) => store.receivedRequestReducer);

  const queryClient = useQueryClient();

  const {
    data: receivedConnectionsData,
    isError,
    error: receivedConnectionsError,
  } = useQuery({
    queryKey: ["receivedConnections"],
    queryFn: fetchReceivedConnections,
    retry: (failureCount, error) => {
      if (!error?.response) return false;
      return true;
    },
    enabled: !storeReceivedRequests,
  });

  if (isError) {
    console.log(receivedConnectionsError);
    const errorMessage =
      receivedConnectionsError?.response?.data?.message ??
      receivedConnectionsError?.message ??
      "error in getting received connections.";

    toast.error(errorMessage);
  }

  useEffect(() => {
    if (receivedConnectionsData) {
      dispatch(addReceivedRequests(receivedConnectionsData));
    }
  }, [receivedConnectionsData]);

  const { mutate: handleReviewRequest } = useMutation({
    mutationFn: (reqReviewData) => reviewRequest(reqReviewData),
    onSuccess: (data) => {
      console.log(data);
      dispatch(removeReceivedRequests());
      toast.success(data.message);
    },
    onError: (error) => {
      console.log(error);
      const errorMessage =
        error?.response?.data?.message ?? error?.message ?? "Error in reveiwing the request.";
      toast.error(errorMessage);
    },
  });

  if (!storeReceivedRequests?.data) {
    return (
      <div className="hero min-h-[60vh]">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <UserRoundPlus className="h-20 w-20 mx-auto text-base-content/30" strokeWidth={1.5} />
            <h3 className="text-xl font-bold mt-4">No pending requests</h3>
            <p className="py-4 text-base-content/70">
              {storeReceivedRequests?.message || "You don't have any connection requests right now."}
            </p>
            <NavLink to="/feed" className="btn btn-primary">
              Browse people
            </NavLink>
          </div>
        </div>
      </div>
    );
  }

  console.log(receivedConnectionsData);

  return (
    <div className="flex flex-wrap">
      {storeReceivedRequests?.data?.map((eachConnection) => {
        return (
          <div key={eachConnection._id} className="m-4">
            <UserCard
              user={eachConnection?.senderId}
              page="receivedConnections"
              connectionId={eachConnection._id}
              handleReviewRequest={handleReviewRequest}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ReceivedConnections;
