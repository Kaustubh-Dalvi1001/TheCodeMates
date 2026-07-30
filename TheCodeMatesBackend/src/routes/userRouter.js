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

    // We can method chain .populate() as well

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

    // We get the query params in string and we need to convert it into an integre to do this we call the function `parseInt()` and pass the req.params?.page as an argument to it.
    // const { page } = parseInt(req.query) - never do this because then it will throw an error - Error in finding all users: Cannot convert object to primitive value.
    const page = parseInt(req.query?.page) || 1; // use the value given from the client or else use 1 as the default value.
    let limit = parseInt(req.query?.limit) || 10; // use the value given from the client or else use 10 as the default value.
    limit = limit > 50 ? 50 : limit; // if the limit is greater than 50 then set it to 50 or else use the limit.
    // If the client sends random query parameters and their random values then the express just ignores it.

    // The users with whome i have no contact yet should be seen in the feed API. First i need to extract the users which are in connection API then filter them from other users and then pass the list of these filtered users to the client.

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

    /* We have a function .select() (which is also like populate) which gives us only the fields which we need, we will pass those fields as an argument to this function and this arguemnt will be a string and multiple fields will be space seperated, we can also pass an array of comma seperated strings like this select(["senderId", "receiverId"]). 
    - This will give us back an array of objects which will only contain the selected fields.
    Example:-
    [
     {
      "_id": "6a69e7d6f3b4f798da1165ea",
      "senderId": "6a6889325fa5bac36db0d60e",
      "receiverId": "6a688d4a044012fcb5b806be"
     },
     {
      "_id": "6a6a0664aa438450eb21c278",
      "senderId": "6a67939021aeffa396f2e23e",
      "receiverId": "6a688d4a044012fcb5b806be"
     }
    ]
    */

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
      .skip((page - 1) * limit) // the skip and limit methods are attached here when we find the documents from the model.
      // If you dont pass anything inside skip the it takes the value 0 as by default.
      .limit(limit); // If you dont pass anything inside limit then it returns all the objects.

    if (allUsers.length === 0) {
      return res.send("You have no new users in you feed.");
    }

    // Instead of doing so much logic we can use a simple .select() method to get the only required fields.
    // const allUsersSafeData = allUsers.map((eachUser) => {
    //   const { firstName, lastName, userName, age, gender, Technical_skills, bio } = eachUser;
    //   return {
    //     firstName,
    //     lastName,
    //     userName,
    //     age,
    //     gender,
    //     Technical_skills,
    //     bio,
    //   };
    // });

    res.json({
      data: allUsers,
    });
  } catch (error) {
    console.error("Error in finding all users.", error);
    res.status(400).json({ message: "Error in finding all users: " + error.message });
  }
});

/*
# Pagination
- In mongoDb for pagination we have 2 functions 1st is `.skip()` and 2nd is `.limit()`.
- skip means how many docs do we want to skip from the start and limit means how many docs do we want to get from the DB.
- skip and limit methods are very important for pagination in mongoose.
*/
