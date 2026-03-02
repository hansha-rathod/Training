import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json"
  }
});

const login = async (data) => {
  const response = await axiosInstance.post("/login", data);
  return response.data;
};

const getRole = async (roleId, token) => {
  const response = await axiosInstance.get(`/roles/${roleId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export default {
  login,
  getRole,
};