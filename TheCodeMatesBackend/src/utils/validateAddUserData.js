import validator from "validator";

export const ValidateAddUserData = (clientUser) => {
  // Validating req body
  const validFields = ["userName", "emailId", "password"];

  const invalidField = Object.keys(clientUser).filter((eachKey) => !validFields.includes(eachKey));

  if (invalidField.length > 0) {
    throw new Error("Invalid field encountered!!: " + invalidField);
  }

  const { userName, emailId, password } = clientUser;

  if (!userName || !emailId || !password) {
    throw new Error("User Name, Email ID, Password are mandatory fields.");
  }

  if (userName.length > 50 || emailId.length > 50) {
    throw new Error("User Name or Email Id cannot be more than 50 characters. ");
  }

  if (!validator.isEmail(emailId)) {
    throw new Error("Email id is not valid. ");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password is not strong!! The password must atleast contain minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1",
    );
  }
};
