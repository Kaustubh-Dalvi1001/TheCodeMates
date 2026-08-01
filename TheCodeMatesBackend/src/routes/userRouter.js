import express from "express";
import { userAuth } from "../middlewares/authMiddleware.js";
import { ConnectionRequestsModel } from "../models/connectionRequestsSchema.js";
import { UserModel } from "../models/userSchema.js";

export const userRouter = express.Router();

// received connection requests
userRouter.get("/receivedConnectionRequest", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const receivedConnectionRequest = await ConnectionRequestsModel.find({
      receiverId: loggedInUser._id,
      status: "interested",
    }).populate("senderId", "userName");

    if (receivedConnectionRequest.length === 0) {
      return res.send("No new connection request received.");
    }

    const userNames = receivedConnectionRequest.map((eachRequest) => eachRequest.senderId.userName);

    res.json({
      message: `${userNames} has sent you a request.`,
      data: receivedConnectionRequest,
    });
  } catch (error) {
    console.error("Error in getting connection requests", error);
    res.status(400).json({ message: `Error in getting connection requests: ${error.message}` });
  }
});

// my connections
userRouter.get("/myConnections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionsArr = await ConnectionRequestsModel.find({
      $or: [
        {
          senderId: loggedInUser._id,
        },
        {
          receiverId: loggedInUser._id,
        },
      ],
      status: "accepted",
    })
      .populate("senderId", "userName")
      .populate("receiverId", "userName");

    if (connectionsArr.length === 0) {
      return res.send("You have no connection.");
    }

    const myConnections = connectionsArr.map((eachUser) =>
      eachUser.senderId._id.equals(loggedInUser._id) ? eachUser.receiverId : eachUser.senderId,
    );

    res.json({
      message: `You have ${connectionsArr.length} connection${connectionsArr.length > 1 ? "s" : ""}.`,
      data: myConnections,
    });
  } catch (error) {
    console.error("Error in myConnections RH" + error);
    res.status(401).json({ message: "Error in myConnections RH" + error.message });
  }
});

// Feed API
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query?.page) || 1;
    let limit = parseInt(req.query?.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    const connectionCollectionUsers = await ConnectionRequestsModel.find({
      $or: [
        {
          senderId: loggedInUser._id,
        },
        {
          receiverId: loggedInUser._id,
        },
      ],
    }).select("senderId receiverId");

    const encounteredUsers = connectionCollectionUsers.map((eachDocument) =>
      eachDocument.senderId.equals(loggedInUser._id) ? eachDocument.receiverId : eachDocument.senderId,
    );

    const userSafeData = ["firstName", "lastName", "userName", "age", "gender", "Technical_skills", "bio"];

    const allUsers = await UserModel.find({
      _id: {
        $nin: [...encounteredUsers, loggedInUser._id],
      },
    })
      .select(userSafeData)
      .skip((page - 1) * limit)
      .limit(limit);

    if (allUsers.length === 0) {
      return res.json({ message: "You have no new users in you feed." });
    }

    res.json({
      data: allUsers,
    });
  } catch (error) {
    console.error("Error in finding all users.", error);
    res.status(400).json({ message: "Error in finding all users: " + error.message });
  }
});
