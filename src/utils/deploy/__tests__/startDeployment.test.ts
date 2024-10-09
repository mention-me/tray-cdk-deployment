import { startDeployment } from "../startDeployment";
import axios from "axios";
import * as core from "@actions/core";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.mock("@actions/core");
const mockedCore = core as jest.Mocked<typeof core>;

describe("Given a built connector to deploy", () => {
  it("should successfully create a deployment and return the id", async () => {
    mockedCore.getInput.mockImplementationOnce((name: string) => {
      if (name === "apiKey") {
        return "some-api-key";
      }

      throw new Error(`Unexpected input: ${name}`);
    });

    mockedAxios.post.mockResolvedValue({
      status: 200,
      data: {
        id: "12345",
      },
    });

    const deployment = await startDeployment(
      "eu1",
      "mock-connector-name",
      "1.0",
      "src/utils/__mocks__/valid",
    );

    // Should have called for the API key
    expect(mockedCore.getInput).toHaveBeenCalledTimes(1);

    expect(deployment).toEqual({
      baseUrl: "https://api.eu1.tray.io",
      connectorName: "mock-connector-name",
      connectorVersion: "1.0",
      deploymentId: "12345",
      region: "eu1",
    });
  });

  it("should handle invalid responses", async () => {
    mockedCore.getInput.mockImplementationOnce((name: string) => {
      if (name === "apiKey") {
        return "some-api-key";
      }

      throw new Error(`Unexpected input: ${name}`);
    });

    mockedAxios.post.mockResolvedValue({
      status: 500,
      data: "Invalid response",
    });

    await expect(
      async () =>
        await startDeployment(
          "eu1",
          "mock-connector-name",
          "1.0",
          "src/utils/__mocks__/valid",
        ),
    ).rejects.toThrow('Failed to start deployment: "Invalid response"');
  });
});
