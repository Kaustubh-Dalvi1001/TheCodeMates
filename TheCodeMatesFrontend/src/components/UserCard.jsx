import { UserPlus, UserX } from "lucide-react";
import React from "react";

const UserCard = ({ user, page = "feed" }) => {
  const { firstName, lastName, userName, gender, age, bio, Technical_skills } = user;
  return (
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
        {page === "feed" ? (
          <div className="card-actions justify-end">
            <button className="btn btn-soft btn-sm">
              <UserX className="w-4 h-4" /> Ignore
            </button>
            <button className="btn btn-secondary btn-sm">
              <UserPlus className="w-4 h-4" /> Connect
            </button>
          </div>
        ) : page === "connections" ? (
          <div className="card-actions justify-end">
            <button className="btn btn-soft btn-sm"> Remove Connection </button>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default UserCard;
