import express from "express";
import { userAuth } from "../middlewares/authMiddleware.js";
import { ValidateUpdateUserApi } from "../utils/validateUpdateUser.js";
import { UserModel } from "../models/userSchema.js";
import { validateUpdatePassApi } from "../utils/validateUpdatePassApi.js";
import bcrypt from "bcrypt";
import upload from "../config/multer.js";
import cloudinary from "../config/cloudinary.js";

export const userProfileRouter = express.Router();

// get a user profile
userProfileRouter.get("/userProfile", userAuth, async (req, res) => {
  try {
    const { user } = req;
    const {
      _id,
      userName,
      firstName,
      lastName,
      age,
      gender,
      bio,
      emailId,
      Technical_skills,
      otherSkills,
      hobbies,
      profilePhotoUrl,
    } = user;
    res.json({
      userProfile: {
        _id,
        userName,
        firstName,
        lastName,
        age,
        gender,
        bio,
        emailId,
        Technical_skills,
        otherSkills,
        hobbies,
        profilePhotoUrl,
      },
    });
  } catch (error) {
    console.error("Error in fetching the profile: ", error);
    res.status(401).send("Error in fetching the profile: " + error.message);
  }
});

// update user profile
userProfileRouter.patch("/updateUserProfile", userAuth, upload.single("photo"), async (req, res) => {
  try {
    const updatedData = req.body;
    updatedData.Technical_skills = JSON.parse(updatedData.Technical_skills || "[]");
    updatedData.otherSkills = JSON.parse(updatedData.otherSkills || "[]");
    updatedData.hobbies = JSON.parse(updatedData.hobbies || "[]");

    ValidateUpdateUserApi(updatedData);

    // Profile photo
    let profilePhotoUrl = req.user.profilePhotoUrl;

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "theCodeMates/profilePhotos",
            public_id: updatedData._id,
            overwrite: true,
          },
          (error, result) => {
            if (error) return reject(error);
            return resolve(result);
          },
        );

        stream.end(req?.file?.buffer);
      });

      profilePhotoUrl = uploadResult.secure_url;
    }
    const photoUpdatdData = { ...updatedData, profilePhotoUrl };

    const { _id } = req.user;

    const updatedUser = await UserModel.findByIdAndUpdate(_id, photoUpdatdData, {
      returnDocument: "after",
      runValidators: true,
    }).select([
      "_id",
      "userName",
      "firstName",
      "lastName",
      "age",
      "gender",
      "bio",
      "emailId",
      "Technical_skills",
      "otherSkills",
      "hobbies",
      "profilePhotoUrl",
    ]);

    res.json({
      message: `${updatedUser.userName}, your profile updated successfully.`,
      updatedUser,
    });
  } catch (error) {
    console.error("Error in updating the user profile: ", error);
    res.status(400).json({ message: "Error in updating the user profile: " + error.message });
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
    res.status(400).json({ message: `Error in updating password: ${error.message}` });
  }
});
