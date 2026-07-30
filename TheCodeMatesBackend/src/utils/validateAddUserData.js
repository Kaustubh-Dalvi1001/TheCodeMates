import validator from "validator";

export const ValidateAddUserData = (clientUser) => {
  // Validating req body
  const validFields = [
    "firstName",
    "lastName",
    "userName",
    "emailId",
    "password",
    "age",
    "gender",
    "Technical_skills",
    "bio",
  ];

  const invalidField = Object.keys(clientUser).filter((eachKey) => !validFields.includes(eachKey));

  if (invalidField.length > 0) {
    
    throw new Error("Invalid field encountered!!: " + invalidField);
  }

  const { firstName, lastName, userName, emailId, password, age, gender, Technical_skills, bio } = clientUser;

  if (!firstName || !userName || !emailId || !password || !age || !gender || !Technical_skills) {
    throw new Error(
      "First Name, User Name, Email ID, Password, Age, Gender and Technical_skills are mandatory fields.",
    );
  }

  if (lastName?.length === 0) {
    throw new Error("The length of Last Name cannot be 0.");
  }

  if (bio?.length === 0) {
    throw new Error("The length of Bio cannot be 0.");
  }

  if (firstName.length > 50 || lastName.length > 50 || userName.length > 50 || emailId.length > 50) {
    throw new Error("First Name, Last Name, User Name or Email Id cannot be more than 50 characters. ");
  }

  if (!validator.isEmail(emailId)) {
    throw new Error("Email id is not valid. ");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password is not strong!! The password must atleast contain minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1",
    );
  }

  if (!["male", "female", "others"].includes(gender)) {
    throw new Error("Gender can be male, female or others only.");
  }

  if (age < 10 || age > 100) {
    throw new Error("Age can't be less than 10 years or greater than 100 years.");
  }

  if (Technical_skills.length > 20) {
    throw new Error("Technical skills cannot be more than 20.");
  }

  if (bio?.length > 200) {
    throw new Error("Bio cannot be more than 200 characters.");
  }
};
