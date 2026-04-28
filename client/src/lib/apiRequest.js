import axios from "axios";

const apiRequest = axios.create({
  baseURL: "https://findproperty-platform-api.onrender.com/api",
  withCredentials: true, // Include cookies in requests
});

export default apiRequest;