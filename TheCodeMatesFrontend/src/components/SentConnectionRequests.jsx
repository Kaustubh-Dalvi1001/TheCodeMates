import React from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchSentConnections } from "./api";
import { toast } from "react-toastify";
import UserCard from "./UserCard";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addSentRequests } from "../store/sentRequestSlice";

const SentConnectionRequests = () => {
  const dispatch = useDispatch();

  const storeSentConnections = useSelector((store) => store.sentRequestReducer);

  const {
    data: sentConnectionsData,
    isError,
    error: getSentConnectionsError,
  } = useQuery({
    queryKey: ["sentConnections"],
    queryFn: fetchSentConnections,
    placeholderData: keepPreviousData,
    enabled: !storeSentConnections,
  });

  if (isError) {
    console.error(getSentConnectionsError);
    const errorMessage =
      getSentConnectionsError?.response?.data?.message ??
      getSentConnectionsError?.message ??
      "Error in getting the sent connection requests.";
    toast.error(errorMessage);
  }

  useEffect(() => {
    if (sentConnectionsData) {
      dispatch(addSentRequests(sentConnectionsData));
    }
  }, [sentConnectionsData]);

  if (!storeSentConnections?.data) {
    return <div>You have not sent any connection requests.</div>;
  }

  console.log(sentConnectionsData);

  return (
    <div className="flex p-4 justify-around flex-wrap gap-5">
      {storeSentConnections?.data?.map((eachConnection) => {
        return (
          <UserCard user={eachConnection.receiverId} key={eachConnection._id} page="sentConnectionsPage" />
        );
      })}
    </div>
  );
};

export default SentConnectionRequests;
