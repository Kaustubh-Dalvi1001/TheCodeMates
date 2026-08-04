import express from "express";
import { userAuth } from "../middlewares/authMiddleware.js";
import { ConnectionRequestsModel } from "../models/connectionRequestsSchema.js";
import { UserModel } from "../models/userSchema.js";

export const connectionReqRouter = express.Router();

connectionReqRouter.post("/request/send/:status/:receiverId", userAuth, async (req, res) => {
  try {
    const { user } = req;
    const senderId = user._id;
    const status = req.params.status;
    const receiverId = req.params.receiverId;

    // Allowed status check
    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      throw new Error(`status is invalid: ${status}`);
    }

    // Check if the receiver id is present in the db
    const receiverPresent = await UserModel.findById(receiverId);
    if (!receiverPresent) {
      throw new Error("Receiver is not present in the DB.");
    }

    // We can write both the conditions using a `$or[]` operator which is give to us by mongodb.
    const existingRequest = await ConnectionRequestsModel.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });
    // In the $or:[] we pass 2 objects each object is a condition.

    if (existingRequest.length > 0) {
      throw new Error("Connection request already present: " + existingRequest);
    }

    const userRequest = new ConnectionRequestsModel({
      senderId,
      receiverId,
      status,
    });

    const savedRequest = await userRequest.save();

    res.json({
      message: `${status === "interested" ? "Connection request sent successfully." : "Profiled ignored succeessfully."}`,
      savedRequest,
    });
  } catch (error) {
    console.error("Error in connection request", error);
    res.status(401).send("Error in connection request." + " " + error.message);
  }
});

connectionReqRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // Status validation
    const allowedStatus = ["accepted", "rejected"];
    const { status, requestId } = req.params;
    if (!allowedStatus.includes(status)) {
      throw new Error("Status is invalid");
    }

    const requestObj = await ConnectionRequestsModel.findOne({
      _id: requestId,
      receiverId: loggedInUser._id,
      status: "interested",
    });

    if (!requestObj) {
      throw new Error("No connection request found ");
    }

    requestObj.status = status;
    // here we are updating the instance of the object which was present in the db which has a flag `isNew:false` so we are not updating a new object we updating the old object.

    const updatedRequest = await requestObj.save();
    // When you fetch a document with findOne(), Mongoose returns a document instance that already knows its _id exists in the DB and internally marks itself as not new (isNew: false). Calling .save() on it checks that flag — since it's not new, Mongoose runs an update matching that existing _id, sending only the fields you changed. If instead you'd created the document with new Model({...}), isNew would be true, and .save() would run an insert instead. So .save() isn't inherently "create" or "update" — it decides based on whether the document came from the DB (update) or was freshly constructed (insert).

    res.json({
      message: `Connection request ${updatedRequest.status}`,
      updatedRequest,
    });
  } catch (error) {
    console.log("Error in reviewing request handler.", error);
    res.status(401).send(`Error in reviewing request handler: ${error.message}`);
  }
});
