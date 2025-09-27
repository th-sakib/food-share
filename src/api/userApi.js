// api will add the authorization header and getToken from firebase
import axios from "axios";
import api from "./axios";

export const getProfile = async () => {
  const res = await api.get("/user/me");
  return res.data;
};

export const createUser = async (data) => {
  try {
    const res = await api.post("/user/create", data);
    return res.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error; // rethrow the error to be handled by the caller
  }
};

export const updateProfile = async (data) => {
  const res = await api.post("/profile", data);
  return res.data;
};

export const createFoodDonation = async (data) => {
  try {
    const res = await api.post("/food/donate", data);
    console.log("Food donation created:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error creating food donation:", error);
    throw error; // rethrow the error to be handled by the caller
  }
};

export const getFoodDonations = async () => {
  try {
    const res = await api.get("/food/donations");
    return res.data;
  } catch (error) {
    console.error("Error fetching food donations:", error);
    throw error;
  }
};

// Get all food donations (basic version without requests data)
// Note: This uses the /donations endpoint which doesn't include request information
// For request status, individual requests need to be fetched separately
export const getFoodDonationsWithRequests = async () => {
  try {
    const res = await api.get("/food/donations");
    return res.data;
  } catch (error) {
    console.error("Error fetching food donations:", error);
    throw error;
  }
};

export const requestFood = async (foodId) => {
  try {
    const res = await api.post(`/food/request/${foodId}`);
    console.log("Food request created:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error requesting food:", error);
    throw error;
  }
};

export const getFoodDetailsWithRequests = async (foodId) => {
  try {
    // Make both API calls in parallel
    const [foodResponse, requestsResponse] = await Promise.all([
      api.get(`/food/${foodId}`),
      api.get(`/food/${foodId}/request`),
    ]);

    // Combine the data
    const combinedData = {
      food: foodResponse.data,
      requests: requestsResponse.data,
    };

    return combinedData;
  } catch (error) {
    console.error("Error fetching food details with requests:", error);
    throw error;
  }
};

// Separate function to get just food details
export const getFoodDetails = async (foodId) => {
  try {
    const res = await api.get(`/food/${foodId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching food details:", error);
    throw error;
  }
};

// Separate function to get just requests for a food
export const getFoodRequests = async (foodId) => {
  try {
    const res = await api.get(`/food/${foodId}/request`);
    return res.data;
  } catch (error) {
    console.error("Error fetching food requests:", error);
    throw error;
  }
};

export const getDonatedFoods = async () => {
  try {
    const res = await api.get("/food/donated-foods");
    return res.data;
  } catch (error) {
    console.error("Error fetching donated foods:", error);
    throw error;
  }
};

export const updateRequestStatus = async (requestId, status) => {
  try {
    const res = await api.patch(`/request/${requestId}/status`, {
      status,
    });
    console.log("Request status updated:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error updating request status:", error);
    throw error;
  }
};

// Get all requests made by the current user
export const getUserRequests = async () => {
  try {
    const res = await api.get("/food/requests/my-requests");
    return res.data;
  } catch (error) {
    console.error("Error fetching user requests:", error);
    throw error;
  }
};
