import fs from "fs";
import { getApiBaseUrl } from "../getApiBaseUrl";
import * as core from "@actions/core";
import axios from "axios";

export type Deployment = {
  region: Parameters<typeof getApiBaseUrl>[0];
  baseUrl: ReturnType<typeof getApiBaseUrl>;
  connectorName: string;
  connectorVersion: string;
  deploymentId?: string;
};

export async function startDeployment(
  region: Parameters<typeof getApiBaseUrl>[0],
  connectorName: string,
  connectorVersion: string,
  buildPath: string,
): Promise<Deployment> {
  const apiKey = core.getInput("apiKey", { required: true });
  const baseUrl = getApiBaseUrl(region);

  core.info(
    `Starting a deployment of ${connectorName} (${connectorVersion}) in ${region}`,
  );

  const encodedBuild = fs.readFileSync(`${buildPath}/connector.zip`, {
    encoding: "base64",
  });

  const response = await axios.post(
    `${baseUrl}/cdk/v1/deployments/connectors/${connectorName}/versions/${connectorVersion}/deploy-connector-from-source`,
    {
      connectorSourceCode: encodedBuild,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },

      // We want to handle all of the possible response statuses, so that we can log them out in debug mode.
      validateStatus: () => true,
    },
  );

  core.debug(`Deployment response: ${JSON.stringify(response.data)}`);

  if (response.status !== 200) {
    core.error(
      `Failed to start deployment. The error code returned was ${response.status}`,
    );

    throw new Error(
      `Failed to start deployment: ${JSON.stringify(response.data)}`,
    );
  }

  if (!response.data?.id) {
    core.error(
      `Failed to start deployment. The response did not contain a deployment ID`,
    );

    throw new Error(
      `Unable to read deployment ID from response: ${response.data}`,
    );
  }

  core.info(
    `Deployment of ${connectorName} (${connectorVersion}) in ${region} started successfully. Deployment ID: ${response.data.id}`,
  );

  return {
    region,
    baseUrl,
    connectorName,
    connectorVersion,
    deploymentId: response.data.id,
  };
}
