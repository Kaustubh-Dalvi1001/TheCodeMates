import express from "express";
import { ValidateAddUserData } from "../utils/validateAddUserData.js";
import bcrypt from "bcrypt";
import { UserModel } from "../models/userSchema.js";
import { ValidateLoginData } from "../utils/validateLoginData.js";
import { userAuth } from "../middlewares/authMiddleware.js";

export const authRouter = express.Router();

// add a new user
authRouter.post("/userSignUp", async (req, res) => {
  try {
    const clientUser = req.body;
    ValidateAddUserData(clientUser);
    const passHash = await bcrypt.hash(clientUser.password, 10);
    const updatedUserPass = { ...clientUser, password: passHash };
    const newUser = new UserModel(updatedUserPass);
    const savedUser = await newUser.save();
    res.json({
      message: "User added successfully!!",
      savedUser,
    });
  } catch (error) {
    // Mongoose validation errors (missing required fields, bad types, etc.)
    if (error.name === "ValidationError") {
      const details = Object.values(error.errors).map((e) => e.message);
      // We are looping on the objects error.error's key's value and returning each error's message.
      return res.status(400).json({
        message: "Validation failed.",
        errors: details,
      });
    } else if (error.code === 11000) {
      console.log("error in index: ", error.errmsg);
      res.send({
        message: "Error in adding user: ",
        err: error.errmsg,
      });
    } else {
      console.error("error in saving user: ", error);

      res.status(401).send({
        error: error.message,
      });
    }
  }
});

// login
authRouter.post("/userLogin", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    ValidateLoginData(emailId, password);

    const dbUser = await UserModel.findOne({ emailId });

    if (dbUser) {
      const isPasswordValid = await dbUser.validatePassword(password);

      if (dbUser && isPasswordValid) {
        const token = dbUser.getJWT(); // offloaded the logic to the schema method.

        res.cookie("token", token, { maxAge: 7 * 24 * 60 * 60 * 1000 }); //cookie expires in 7days
        res.json({
          message: `Welcome ${dbUser.gender === "male" ? "Mr." : dbUser.gender === "female" ? "Ms." : ""} ${dbUser.userName}`,
        });
      } else {
        res.status(401).json({ message: "Invalid Credentials!!" });
      }
    } else {
      res.status(401).json({ message: "Invalid Credentials!!" });
    }
  } catch (error) {
    console.log("Error in Login: ", error);
    res.json({ message: `Error in Login: ${error.message}` });
  }
});

// logout
authRouter.post("/userLogout", userAuth, (req, res) => {
  const { userName } = req.user;
  try {
    res.cookie("token", null, { maxAge: 0 }).json({ message: `${userName} logged out successfully` });
  } catch (error) {
    console.error("Error in logging out the user", error);
    res.status(401).json({ message: "Error in logging out the user" + error.message });
  }
});

// Delete a user
authRouter.delete("/deleteUser", userAuth, async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await UserModel.findByIdAndDelete(_id);
    res.json({
      message: "User deleted successfully",
      user,
    });
  } catch (error) {
    console.error("Error in deleting the user: ", error);
    res.send("Error in deleting the user: " + error.message);
  }
});
