import _axios, { AxiosError } from "axios";
import ProblemDetail from "./problem-detail";

function toProblemDetail(error: AxiosError): ProblemDetail {
  if (error.response) {
    //server responded with an error
    return new ProblemDetail({
      type:
        "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/" +
        error.response.status,
      title: error.response.statusText || "Request Failed",
      status: error.response.status,
      detail: error.message,
      instance: error.config?.url,
    });
  }

  if (error.request) {
    //request fired but no response e.g timeout
    return new ProblemDetail({
      type: "about:blank",
      title: "Network Error",
      status: 0,
      detail: "No response received from server",
      instance: error.config?.url,
    });
  }

  //request never fired e.g configuration issue at call site
  return new ProblemDetail({
    type: "about:blank",
    title: "Request Error",
    status: 0,
    detail: error.message,
  });
}

const axios = _axios.create();

axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    return Promise.reject(toProblemDetail(error));
  },
);

export default axios;
