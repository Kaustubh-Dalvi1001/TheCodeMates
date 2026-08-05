import validator from "validator";

export const ValidateUpdateUserApi = (reqBody) => {
  // Validating req query params
  const acceptedFields = [
    "firstName",
    "lastName",
    "userName",
    "password",
    "age",
    "gender",
    "bio",
    "Technical_skills",
    "otherSkills",
    "hobbies",
  ];

  const isWrongParam = Object.keys(reqBody).filter((eachKey) => !acceptedFields.includes(eachKey));

  if (isWrongParam.length > 0) {
    throw new Error(`This field is invalid: ${isWrongParam}`);
  }

  // Validating reqBody
  const {
    firstName,
    lastName,
    userName,
    password,
    age,
    gender,
    bio,
    Technical_skills,
    otherSkills,
    hobbies,
  } = reqBody;

  if (firstName?.length > 50) {
    throw new Error("First Name cannot be more than 50 characters.");
  }

  if (lastName?.length > 50) {
    throw new Error("Last Name cannot be more than 50 characters.");
  }

  if (userName?.length > 50) {
    throw new Error("User Name cannot be more than 50 characters.");
  }

  if ((age && age < 10) || age > 100) {
    throw new Error("Age cannot be less than 10 years or more than 100 years.");
  }

  if (bio?.length > 200) {
    throw new Error("Bio cannot be more than 200 characters.");
  }

  if (gender && !["male", "female", "others"].includes(gender)) {
    throw new Error("Gender can only be male, female or others.");
  }

  if (Technical_skills && Technical_skills?.length > 20) {
    throw new Error("Technical skills cannot be more than 20.");
  }

  if (otherSkills?.length > 20) {
    throw new Error("Other skills cannot be more than 20.");
  }

  if (hobbies?.length > 20) {
    throw new Error("Hobbies cannot be more than 20.");
  }
};
