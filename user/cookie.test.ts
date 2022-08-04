import { sessionCookieName, parseSessionIdentifier } from "./cookie";

describe("parseSessionIdentifier()", () => {
  it("should return null given an empty string", () => {
    expect(parseSessionIdentifier("")).toBeNull();
  });

  it("should return the sessionIdentifier given a cookie containing only that", () => {
    const expected = "💌";
    const input = `${sessionCookieName}=${expected}`;
    expect(parseSessionIdentifier(input)).toBe(expected);
  });

  it("should return the sessionIdentifier given a more complex cookie string", () => {
    const expected = "💌";
    const input = `name=value; ${sessionCookieName}=${expected}; name3=value3`;
    expect(parseSessionIdentifier(input)).toBe(expected);
  });
});
