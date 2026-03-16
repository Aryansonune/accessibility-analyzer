import axios from "axios";

export const analyzeWebsite = (url) => {
  return axios.post("http://127.0.0.1:8000/analyze", { url });
};