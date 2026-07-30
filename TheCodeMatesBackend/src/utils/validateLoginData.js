import validator from "validator";

export const ValidateLoginData = ( emailId, password ) => {
  if (!emailId || !password) {
    throw new Error("Email ID and Password is required.");
  }

  if (emailId.length > 50) {
    throw new Error("Email cannot be more than 50 characters.");
  }

  if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid.");
  }
};
