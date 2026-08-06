import express from "express";
import { userAuth } from "../middlewares/authMiddleware.js";
import { ConnectionRequestsModel } from "../models/connectionRequestsSchema.js";
import { UserModel } from "../models/userSchema.js";

export const userRouter = express.Router();

// my connections
userRouter.get("/myConnections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const userSafeData = [
      "firstName",
      "lastName",
      "userName",
      "age",
      "gender",
      "bio",
      "Technical_skills",
      "otherSkills",
      "hobbies",
    ];

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
      .select("_id")
      .populate("senderId", userSafeData)
      .populate("receiverId", userSafeData);

    if (connectionsArr.length === 0) {
      return res.json({ message: "You have no connection.", data: null });
    }

    // console.log(connectionsArr);

    const myConnections = connectionsArr.map((eachConnection) => {
      // Because you are populating senderId becomes an object whith the user values. Its not just a normal _id even if the name suggests so.
      const otherUser = eachConnection.senderId._id.equals(loggedInUser._id)
        ? eachConnection.receiverId
        : eachConnection.senderId;

      return {
        connectionId: eachConnection._id,
        ...otherUser.toObject(),
      };
    });

    res.json({
      message: `You have ${connectionsArr.length} connection${connectionsArr.length > 1 ? "s" : ""}.`,
      data: myConnections,
    });
  } catch (error) {
    console.error("Error in myConnections RH" + error);
    res.status(401).json({ message: "Error in myConnections RH" + error.message });
  }
});

// received connection requests
userRouter.get("/receivedConnectionRequest", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const userSafeData = [
      "firstName",
      "lastName",
      "userName",
      "age",
      "gender",
      "bio",
      "Technical_skills",
      "otherSkills",
      "hobbies",
    ];
    const receivedConnectionRequest = await ConnectionRequestsModel.find({
      receiverId: loggedInUser._id,
      status: "interested",
    })
      .populate("senderId", userSafeData)
      .select("_id");

    if (receivedConnectionRequest.length === 0) {
      return res.json({ message: "No new connection request received.", data: null });
    }

    res.json({
      data: receivedConnectionRequest,
    });
  } catch (error) {
    console.error("Error in getting connection requests", error);
    res.status(400).json({ message: `Error in getting connection requests: ${error.message}` });
  }
});

// get sent connection requests
userRouter.get("/getSentConnectionRequests", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const userSafeData = [
      "firstName",
      "lastName",
      "userName",
      "age",
      "gender",
      "bio",
      "Technical_skills",
      "otherSkills",
      "hobbies",
    ];

    const sentConnectionRequests = await ConnectionRequestsModel.find({
      senderId: loggedInUser._id,
    })
      .select("_id")
      .populate("receiverId", userSafeData);

    if (sentConnectionRequests.length === 0) {
      return res.json({
        message: "You have not sent any connection request.",
        data: null,
      });
    }

    res.json({
      data: sentConnectionRequests,
    });
  } catch (error) {
    console.error("Error in getting sent connection requests: " + error);
    res.status(400).json({
      message: `Error in getting sent connection requests: ${error.message}`,
    });
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

    const userSafeData = [
      "firstName",
      "lastName",
      "userName",
      "age",
      "gender",
      "bio",
      "Technical_skills",
      "otherSkills",
      "hobbies",
    ];

    const allUsers = await UserModel.find({
      _id: {
        $nin: [...encounteredUsers, loggedInUser._id],
      },
    })
      .select(userSafeData)
      .skip((page - 1) * limit)
      .limit(limit);

    if (allUsers.length === 0) {
      return res.json({ message: "You have no new users in you feed.", data: null });
    }

    res.json({
      data: allUsers,
    });
  } catch (error) {
    console.error("Error in finding all users.", error);
    res.status(400).json({ message: "Error in finding all users: " + error.message });
  }
});
