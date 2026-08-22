import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cancelSentConnectionReq, fetchSentConnections } from "./api";
import { toast } from "react-toastify";
import UserCard from "./UserCard";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addSentRequests } from "../store/sentRequestSlice";
import { NavLink } from "react-router-dom";
import { Send } from "lucide-react";

const SentConnectionRequests = () => {
  const dispatch = useDispatch();
  const storeSentConnections = useSelector((store) => store.sentRequestReducer);
  const queryClient = useQueryClient();

  const {
    data: sentConnectionsData,
    isError,
    error: getSentConnectionsError,
  } = useQuery({
    queryKey: ["sentConnections"],
    queryFn: fetchSentConnections,
    placeholderData: keepPreviousData,
    // enabled: !storeSentConnections?.data,
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

  const { mutate: cancelConnectionReqMutate } = useMutation({
    mutationFn: (reqId) => cancelSentConnectionReq(reqId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sentConnections"] });
      toast.success(data.message);
    },
    onError: (error) => {
      console.log(error);
      const errorMessage =
        error?.response?.data?.message ?? error.message ?? "Error in cancelling the sent connection request.";
      toast.error(errorMessage);
    },
  });

  if (!storeSentConnections?.data) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center max-w-md">
          <Send className="h-20 w-20 mx-auto text-base-content/30" strokeWidth={1.5} />
          <h3 className="text-xl font-bold mt-4">No requests sent</h3>
          <p className="py-4 text-base-content/70">{storeSentConnections?.message}</p>
          <NavLink to="/feed" className="btn btn-primary">
            Find people to connect with
          </NavLink>
        </div>
      </div>
    );
  }

  // console.log(sentConnectionsData);

  return (
    <div className="flex p-4 justify-around flex-wrap gap-5">
      {storeSentConnections?.data?.map((eachConnection) => {
        return (
          <UserCard
            user={eachConnection.receiverId}
            key={eachConnection._id}
            page="sentConnectionsPage"
            connectionId={eachConnection._id}
            mutateFn={cancelConnectionReqMutate}
          />
        );
      })}
    </div>
  );
};

export default SentConnectionRequests;
