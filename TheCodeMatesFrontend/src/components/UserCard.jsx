import { UserPlus, UserX, CircleCheck, CircleX } from "lucide-react";
import React from "react";

const UserCard = ({ user, page = "feed", connectionId, handleReviewRequest, connectionReqMutate }) => {
  const { _id, firstName, lastName, userName, gender, age, bio, Technical_skills } = user ?? {};
  return (
    <div className="card bg-base-200 shadow-lg">
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
        {page === "feed" ? (
          <div className="card-actions justify-end">
            <button
              onClick={() => connectionReqMutate({ reqStatus: "ignored", receiverId: _id })}
              className="btn btn-soft btn-sm"
            >
              Ignore <UserX className="w-4 h-4" />
            </button>
            <button
              onClick={() => connectionReqMutate({ reqStatus: "interested", receiverId: _id })}
              className="btn btn-secondary btn-sm"
            >
              Connect <UserPlus className="w-4 h-4" />
            </button>
          </div>
        ) : page === "connections" ? (
          <div className="card-actions justify-end">
            <button className="btn btn-soft btn-sm">
              Remove Connection <UserX className="w-4 h-4" />
            </button>
          </div>
        ) : page === "receivedConnections" ? (
          <div className="card-actions justify-end">
            <button
              onClick={() => handleReviewRequest({ reqStatus: "rejected", reqId: connectionId })}
              className="btn btn-soft btn-sm"
            >
              Reject <CircleX className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                handleReviewRequest({ reqStatus: "accepted", reqId: connectionId });
              }}
              className="btn btn-info btn-sm"
            >
              Accept <CircleCheck className="w-4 h-4" />
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default UserCard;
