import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:1001",
  withCredentials: true,
});

export const signupUser = async (signupdata) => {
  try {
    const response = await api.post("/userSignUp", signupdata);
    return response.data;
  } catch (error) {
    throw error;
  }
};

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

    // console.log(response.data);

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

export const updateUserProfile = async (userData) => {
  try {
    const response = await api.patch("/updateUserProfile", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchConnetions = async () => {
  try {
    const response = await api.get("/myConnections");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchReceivedConnections = async () => {
  try {
    const response = await api.get("/receivedConnectionRequest");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchSentConnections = async () => {
  try {
    const response = await api.get("/getSentConnectionRequests");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const reviewRequest = async (reqReviewData) => {
  const { reqStatus, reqId } = reqReviewData;

  try {
    const response = await api.post(`/request/review/${reqStatus}/${reqId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const connectionRequest = async (reqData) => {
  try {
    const { reqStatus, receiverId } = reqData;
    const response = await api.post(`/request/send/${reqStatus}/${receiverId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
