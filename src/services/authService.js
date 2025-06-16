import axiosInstance from "./axiosInstance";

export const login = async (email, password) => {
  const response = await axiosInstance.post("/auth/login", { email, password });
  return response.data;
};

export const register = async (userData) => {
  const response = await axiosInstance.post("/auth/signup", userData);
  return response.data;
};

export const getProfile = async () => {
  const response = await axiosInstance.get("/profile");
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await axiosInstance.put("/profile", profileData);
  return response.data;
};
