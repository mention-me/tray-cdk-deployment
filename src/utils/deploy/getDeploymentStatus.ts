import { getApiBaseUrl } from "../getApiBaseUrl";
import axios from "axios";
import * as core from "@actions/core";

/**
 * The possible deployment statuses which will be returned by the Tray.ai API.
 */
const DEPLOYMENT_STATUSES = ["Deployed", "Deploying", "Building"] as const;

export type DeploymentStatus = {
  deploymentId?: string;
  status: (typeof DEPLOYMENT_STATUSES)[number] | "Failed";
  isDeployed: boolean;
  hasFailed: boolean;
};

export async function getDeploymentStatus(
  region: Parameters<typeof getApiBaseUrl>[0],
  connectorName: string,
  connectorVersion: string,
): Promise<DeploymentStatus> {
  const apiKey = core.getInput("apiKey", { required: true });
  const baseUrl = getApiBaseUrl(region);

  const response = await axios.get(
    `${baseUrl}/cdk/v1/deployments/connectors/${connectorName}/versions/${connectorVersion}/latest`,
    {
      method: "get",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    },
  );

  core.debug(`Status response: ${JSON.stringify(response?.data)}`);

  if (response?.status !== 200) {
    throw new Error(`Failed to get deployment status: ${response?.data}`);
  }

  const deploymentResponse = response.data;

  let deploymentStatus: DeploymentStatus["status"];

  if (DEPLOYMENT_STATUSES.includes(deploymentResponse?.deploymentStatus)) {
    deploymentStatus = deploymentResponse.deploymentStatus;
  } else {
    deploymentStatus = "Failed";
  }

  return {
    deploymentId: deploymentResponse?.id,
    status: deploymentStatus,
    isDeployed: deploymentStatus === "Deployed",
    hasFailed: deploymentStatus === "Failed",
  };
}
