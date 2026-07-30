import express from "express";
import { userAuth } from "../middlewares/authMiddleware.js";
import { ValidateUpdateUserApi } from "../utils/validateUpdateUser.js";
import { UserModel } from "../models/userSchema.js";
import { validateUpdatePassApi } from "../utils/validateUpdatePassApi.js";
import bcrypt from "bcrypt";

export const userProfileRouter = express.Router();

// get a user profile
userProfileRouter.get("/userProfile", userAuth, async (req, res) => {
  try {
    const { user } = req;
    res.send(user);
  } catch (error) {
    console.error("Error in fetching the profile: ", error);
    res.send("Error in fetching the profile: " + error.message);
  }
});

// update user profile
userProfileRouter.patch("/updateUserProfile", userAuth, async (req, res) => {
  try {
    const updatedData = req.body;
    ValidateUpdateUserApi(updatedData);

    const { _id } = req.user;

    const updatedUser = await UserModel.findByIdAndUpdate(_id, updatedData, {
      returnDocument: "after",
      runValidators: true,
    });

    res.json({
      message: `${updatedUser.userName}, your profile updated successfully.`,
      updatedUser,
    });
  } catch (error) {
    console.error("Error in updating the user profile: ", error);
    res.send("Error in updating the user profile: " + error.message);
  }
});

// update password
userProfileRouter.patch("/updateUserPassword", userAuth, async (req, res) => {
  try {
    const { user } = req;

    const reqBody = req?.body;

    await validateUpdatePassApi(reqBody, user.password);

    const { newPassword } = req.body;

    const passHash = await bcrypt.hash(newPassword, 10);
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      { password: passHash },
      { returnDocument: "after", runValidators: true },
    );

    res.json({
      message: `password updated successfully`,
      updatedUser,
    });
  } catch (error) {
    console.error("Error in updating password: ", error);
    res.send("Error in updating password: " + error.message);
  }
});
