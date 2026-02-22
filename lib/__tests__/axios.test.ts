import axios from "@/lib/axios";
import MockAdapter from "axios-mock-adapter";
import ProblemDetail from "../problem-detail";

const mock = new MockAdapter(axios);

afterEach(() => mock.reset());

describe("axios interceptor", () => {
  it("should reject with ProblemDetail on server error", async () => {
    mock.onGet("/test").reply(404);
    expect.assertions(3);
    try {
      await axios.get("/test");
      fail("Should reject with Problem Detail");
    } catch (error: any) {
      expect(error).toBeInstanceOf(ProblemDetail);
      expect(error.status).toBe(404);
      expect(error.type).toBe(
        "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/" +
          error.status,
      );
    }
  });

  it("should reject with ProblemDetail on network error", async () => {
    mock.onGet("/test").networkError();
    expect.assertions(3);
    try {
      await axios.get("/test");
    } catch (error: any) {
      expect(error).toBeInstanceOf(ProblemDetail);
      expect(error.status).toBe(0);
      expect(error.type).toBe("about:blank");
      /*somethings going on with mock adapter here in this case we don't have 
     request or response so its being treated as config error*/
    }
  });

  it("it should reject with ProblemDetail on timeout", async () => {
    mock.onGet("/test").timeout();
    expect.assertions(3);
    try {
      await axios.get("/test");
    } catch (error: any) {
      expect(error).toBeInstanceOf(ProblemDetail);
      expect(error.status).toBe(0);
      expect(error.type).toBe("about:blank");
      /*somethings going on with mock adapter here in this case we don't have 
     request or response so its being treated as config error*/
    }
  });
});
