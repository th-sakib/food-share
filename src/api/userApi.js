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
    console.log(res);
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
