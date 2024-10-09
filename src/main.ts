import * as core from "@actions/core";
import { parse } from "@utils/build/parse";
import { build } from "@utils/build/build";
import { startDeployment } from "@utils/deploy/startDeployment";
import { getRegion } from "@utils/getRegion";
import { waitForDeploymentToFinish } from "@utils/deploy/waitForDeploymentToFinish";

/**
 * Deploy a CDK connector to Tray.ai.
 *
 * The process is as follows:
 * 1. Parse the connectors information (name and version) from the `connector.json` file.
 * 2. Build the connector (using the `tray-cdk` executable).
 * 3. Start a deployment of the connector to Tray.ai.
 * 4. Wait for the deployment to finish.
 */
export async function run(): Promise<void> {
  try {
    const region = getRegion(core.getInput("region", { required: true }));

    const path = core.getInput("path", { required: false });
    const executable = core.getInput("executable", { required: true });

    const normalizedPath = path ? path.replace(/\/*$/g, "") + "/" : "";

    const { name, version } = parse(normalizedPath);
    core.setOutput("name", name);
    core.setOutput("version", version);

    const buildPath = await build(executable, normalizedPath);
    core.setOutput("buildPath", buildPath);

    const deployment = await startDeployment(region, name, version, buildPath);
    core.setOutput("deploymentId", deployment.deploymentId);

    const status = await waitForDeploymentToFinish(deployment);

    if (status.isDeployed) {
      core.info("Deployment successful!");
    } else if (status.hasFailed) {
      core.error("Deployment failed!");
    }

    core.setOutput("successful", status.isDeployed && !status.hasFailed);
  } catch (error) {
    core.setOutput("successful", false);

    if (error instanceof Error) core.setFailed(error.message);
  }
}
