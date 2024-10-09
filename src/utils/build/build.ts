import * as exec from "@actions/exec";
import * as fs from "fs";
import * as core from "@actions/core";

/**
 * Build the CDK connector at a given path, using a given executable.
 *
 * If the build is successful, the path to the built connector will be returned.
 *
 * If the build fails, an error will be thrown.
 */
export async function build(
  executable: string,
  path?: string,
): Promise<string> {
  if (fs.existsSync(`${path}/.tray/`)) {
    core.debug(`Removing existing ".tray" directory at path: ${path}`);

    fs.rmSync(`${path}/.tray/`, { recursive: true, force: true });
  }

  try {
    await exec.exec(`${executable} connector build`, [], {
      cwd: path,
      silent: true,
    });
  } catch (error) {
    throw new Error(`Unable to run build command. Error was: ${error}`);
  }

  if (!fs.existsSync(`${path}/.tray/`)) {
    throw new Error(
      `Connector build failed. The ".tray" directory was not found at path: ${path}`,
    );
  }

  return `${path}/.tray/`;
}
