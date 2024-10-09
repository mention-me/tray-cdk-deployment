import axios from "axios";
import * as core from "@actions/core";
import { DeploymentStatus, getDeploymentStatus } from "../getDeploymentStatus";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.mock("@actions/core");
const mockedCore = core as jest.Mocked<typeof core>;

describe("Given a deployment", () => {
  it.each([
    [
      "Deployed",
      {
        hasFailed: false,
        isDeployed: true,
        status: "Deployed" as DeploymentStatus["status"],
      },
    ],
    [
      "Deploying",
      {
        hasFailed: false,
        isDeployed: false,
        status: "Deploying" as DeploymentStatus["status"],
      },
    ],

    [
      "Building",
      {
        hasFailed: false,
        isDeployed: false,
        status: "Building" as DeploymentStatus["status"],
      },
    ],
    [
      "Some other value",
      {
        hasFailed: true,
        isDeployed: false,
        status: "Failed" as DeploymentStatus["status"],
      },
    ],
  ])(
    "Should handle the expected set of deployment statuses",
    async (
      deploymentStatus: string,
      expectedReturnedStatus: DeploymentStatus,
    ) => {
      mockedCore.getInput.mockImplementationOnce((name) => {
        if (name === "apiKey") {
          return "some-api-key";
        }

        throw new Error(`Unexpected input: ${name}`);
      });

      mockedAxios.get.mockResolvedValue({
        status: 200,
        data: {
          deploymentStatus: deploymentStatus,
        },
      });

      const status = await getDeploymentStatus(
        "eu1",
        "mock-connector-name",
        "1.0",
      );

      // Should have called for the API key
      expect(mockedCore.getInput).toHaveBeenCalledTimes(1);

      expect(status).toEqual(expectedReturnedStatus);
    },
  );

  it("should handle invalid responses", async () => {
    mockedCore.getInput.mockImplementationOnce((name: string) => {
      if (name === "apiKey") {
        return "some-api-key";
      }

      throw new Error(`Unexpected input: ${name}`);
    });

    mockedAxios.get.mockResolvedValue({
      status: 500,
      data: "Invalid response",
    });

    await expect(
      async () =>
        await getDeploymentStatus("eu1", "mock-connector-name", "1.0"),
    ).rejects.toThrow("Failed to get deployment status: Invalid response");
  });
});
