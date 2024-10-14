import { getDeploymentStatus } from "./getDeploymentStatus";
import * as core from "@actions/core";
import { Deployment } from "./startDeployment";

export async function waitForDeploymentToFinish(
  { region, connectorVersion, connectorName, deploymentId }: Deployment,
  attempts = 120,
  waitTime = 4000,
): ReturnType<typeof getDeploymentStatus> {
  core.info(
    `Waiting for deployment of ${connectorName} (${connectorVersion}) in ${region} to finish...`,
  );

  for (let i = 1; i <= attempts; i++) {
    const status = await getDeploymentStatus(
      region,
      connectorName,
      connectorVersion,
    );

    if (status.deploymentId !== deploymentId) {
      throw new Error(
        `Deployment ID mismatch. Expected ${deploymentId}, got ${status.deploymentId}`,
      );
    }

    if (status.isDeployed || status.hasFailed) {
      return status;
    }

    core.info(`Attempt ${i} of ${attempts}: the status is "${status.status}".`);

    await new Promise((resolve) => setTimeout(resolve, waitTime));
  }

  core.info(
    `Deployment timed out after ${attempts} attempts (with a ${waitTime / 1000} second wait time).`,
  );

  return {
    status: "Failed",
    isDeployed: false,
    hasFailed: true,
  };
}
