import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:1001",
  withCredentials: true,
});

export const loginUser = async (loginData) => {
  try {
    const response = await api.post("/userLogin", loginData);

    return response.data;
  } catch (error) {
    console.error("Error in loginUser: " + error);
    throw error;
  }
};

export const fetchUser = async () => {
  try {
    const response = await api.get("/userProfile");

    return response.data;
  } catch (error) {
    console.error("Error in fetching user: ", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post("/userLogout");
    return response.data;
  } catch (error) {
    console.error("Error in logoutUser: " + error);
    throw error;
  }
};

export const userFeed = async () => {
  try {
    const response = await api.get("/feed");
    return response.data;
  } catch (error) {
    throw error;
  }
};
