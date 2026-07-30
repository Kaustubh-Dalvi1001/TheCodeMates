import bcrypt from "bcrypt";
import validator from "validator";

export const validateUpdatePassApi = async (reqbody, userPassword) => {
  const allowedField = ["oldPassword", "newPassword"];

  const clientBodyKeys = Object.keys(reqbody);

  const wrongField = clientBodyKeys.filter((eachKey) => !allowedField.includes(eachKey));

  if (wrongField.length > 0) {
    throw new Error(
      wrongField.length > 1
        ? `Updating these fields are invaid: ${wrongField}`
        : `Updating this field is invalid: ${wrongField}`,
    );
  }

  const { oldPassword, newPassword } = reqbody;

  if (oldPassword.length === 0) {
    throw new Error("Old password cannot be an empty string.");
  }

  if (newPassword.length === 0) {
    throw new Error("New password cannot be an empty string.");
  }

  const isOldPassValid = await bcrypt.compare(oldPassword, userPassword);

  if (!isOldPassValid) {
    throw new Error("old Password is invalid.");
  }

  if (!validator.isStrongPassword(newPassword)) {
    throw new Error(
      "New password is not strong!! The password must contain minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1",
    );
  }
};
