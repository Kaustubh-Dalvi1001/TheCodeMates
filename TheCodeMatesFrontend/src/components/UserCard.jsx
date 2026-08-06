import { UserPlus, UserX, CircleCheck, CircleX } from "lucide-react";
import React from "react";
import BadgeList from "./BadgeList";

const UserCard = ({ user, page = "feed", connectionId, handleReviewRequest, mutateFn }) => {
  const { _id, firstName, lastName, userName, gender, age, bio, Technical_skills, otherSkills, hobbies } =
    user ?? {};
  return (
    <div className="card bg-base-200 w-96 shadow-lg">
      <div className="card-body">
        {/* user name */}
        <h2
          className={`card-title ${userName?.length >= 15 && "tooltip tooltip-bottom"}`}
          data-tip={userName}
        >
          <span className="truncate"> {userName} </span>
        </h2>

        {/* first name */}
        <div
          className={`${(firstName?.length >= 15 || lastName?.length >= 15) && "tooltip tooltip-bottom"}`}
          data-tip={`${firstName} ${lastName}`}
        >
          <div className="truncate">
            {firstName} {lastName}
          </div>
        </div>

        {/* gender and age */}
        <div>
          {gender} {age}
        </div>

        {/* bio */}
        <div className={`${bio?.length >= 50 && "tooltip tooltip-bottom"}`} data-tip={bio}>
          <div className="truncate"> {bio} </div>
        </div>

        <BadgeList items={Technical_skills} colorClass="badge-primary" />
        <BadgeList items={otherSkills} colorClass="badge-accent" />
        <BadgeList items={hobbies} colorClass="badge-secondary" />
        {page === "feed" ? (
          <div className="card-actions justify-end">
            <button
              onClick={() => mutateFn({ reqStatus: "ignored", receiverId: _id })}
              className="btn btn-soft btn-sm"
            >
              Ignore <UserX className="w-4 h-4" />
            </button>
            <button
              onClick={() => mutateFn({ reqStatus: "interested", receiverId: _id })}
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
        ) : page === "sentConnectionsPage" ? (
          <div className="card-actions justify-end">
            <button onClick={() => mutateFn(connectionId)} className="btn btn-soft btn-sm">
              Cancel Connection Request <CircleX className="w-4 h-4" />
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
