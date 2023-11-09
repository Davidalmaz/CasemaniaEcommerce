import axios from "axios";

// Create an Axios instance for making HTTP requests

const instance = axios.create({
  baseURL: "http://localhost:8080",
});

export default instance;
