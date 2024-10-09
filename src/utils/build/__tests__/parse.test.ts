import { parse } from "../parse";

describe("Given a connector file to parse", () => {
  it("should handle a valid connector file", () => {
    expect(parse("src/utils/__mocks__/valid/")).toEqual({
      name: "some-connector",
      version: "1.0",
    });
  });

  it("should handle a invalid connector file", () => {
    expect(() => parse("src/utils/__mocks__/invalid/")).toThrow(
      `The "connector.json" file must contain "name" and "version" fields`,
    );
  });

  it("should handle a missing file", () => {
    expect(() =>
      parse("src/utils/__mocks__/not-a-connector-file-path/"),
    ).toThrow(
      "Connector file not found at path: src/utils/__mocks__/not-a-connector-file-path/connector.json",
    );
  });
});
