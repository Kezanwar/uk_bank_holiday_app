import _axios from "axios";

const axios = _axios.create();

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(
      (error.response && error.response.data) || "Something went wrong",
    );
  },
);

export default axios;
