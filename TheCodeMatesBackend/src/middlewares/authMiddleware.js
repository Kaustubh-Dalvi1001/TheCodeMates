import jwt from "jsonwebtoken";
import { UserModel } from "../models/userSchema.js";

export const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
     return res.status(401).json({ message: "No token found." });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findById(decodedToken.id);
    if (!user) {
     return res.status(401).json({ message: "No user found." });
    }

    // Suppose if we want to send some data back to the RH from this middleware then we just attach it to the user object, and then access it in the request object in the RH and use it.
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in validating the token: ", error);
    res.status(401).json({ message: "Error in validating the token: " + error.message });
  }
};
