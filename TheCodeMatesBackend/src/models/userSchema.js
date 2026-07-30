import { Schema, model } from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxLength: 50,
      trim: true,
    },
    lastName: {
      type: String,
      maxLength: 50,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      minLength: 2,
      maxLength: 50,
      unique: true,
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid!!");
        }
      },
      immutable: true,
      maxLength: 50,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "Password is not strong!! The password must atleast contain minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1",
          );
        }
      },
    },
    age: {
      type: Number,
      required: true,
      trim: true,
      min: 10,
      max: 100,
    },
    gender: {
      type: String,
      lowercase: true,
      required: true,
      trim: true,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid!!");
        }
      },
    },
    Technical_skills: {
      type: [String],
      required: true,
      validate(value) {
        if (value.length > 20) {
          throw new Error("Only 20 skills are allowed!!");
        }
      },
    },
    bio: {
      type: String,
      default: "This is my default bio.",
      trim: true,
      maxLength: 200,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getJWT = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  // this here represents a particular instance of the userModel on which this function will be called. Do not use arrow function because we need the value of this.
  return token;
};

userSchema.methods.validatePassword = async function (clientPass) {
  const isPasswordValid = await bcrypt.compare(clientPass, this.password);
  return isPasswordValid;
};

export const UserModel = model("UserModel", userSchema);
