import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { fetchConnetions } from "./api";
import { toast } from "react-toastify";
import UserCard from "./UserCard";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../store/connectionSlice";
import { UsersRound } from "lucide-react";
import { NavLink } from "react-router-dom";

const Connections = () => {
  const dispatch = useDispatch();

  const storeConnections = useSelector((store) => store?.connectionReducer);
  console.log(storeConnections);

  const {
    data: connections,
    isError,
    error: connectionsError,
  } = useQuery({
    queryKey: ["connections"],
    queryFn: fetchConnetions,
    retry: (failureCount, error) => {
      if (!error?.response) return false;
      return true;
    },
    enabled: !storeConnections,
  });

  if (isError) {
    console.log(connectionsError);
    const backendErrorMessage =
      connectionsError?.response?.data?.message ??
      connectionsError?.message ??
      "Error in getting connections.";
    toast.error(backendErrorMessage);
  }

  useEffect(() => {
    if (connections) {
      dispatch(addConnections(connections));
    }
  }, [connections]);

  return (
    <div>
      {storeConnections?.data === null ? (
        <div className="hero min-h-[60vh]">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <UsersRound className="h-20 w-20 mx-auto text-base-content/30" strokeWidth={1.5} />
              <h3 className="text-xl font-bold mt-4">No connections yet</h3>
              <p className="py-4 text-base-content/70">
                {storeConnections?.message || "Start connecting with people to see them here."}
              </p>
              <NavLink to="/feed" className="btn btn-primary">
                Find people to connect with
              </NavLink>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {storeConnections?.data?.map((eachConnection) => {
            return (
              <div key={eachConnection._id} className="p-4">
                <UserCard user={eachConnection} page="connections" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Connections;
