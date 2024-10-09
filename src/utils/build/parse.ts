import * as fs from "fs";
import * as core from "@actions/core";

export type Connector = {
  name: string;
  version: string;
};

/**
 * Parse the connector.json file at the given path.
 *
 * If none is provided, it will look for the file in the current working directory.
 */
export function parse(path?: string): Connector {
  const connectorPath = `${path}connector.json`;

  if (!fs.existsSync(connectorPath)) {
    throw new Error(`Connector file not found at path: ${connectorPath}`);
  }

  let json;
  try {
    json = JSON.parse(fs.readFileSync(connectorPath, "utf8"));
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw new Error(
        `Error while parsing the "connector.json" file: ${e.message}`,
      );
    }

    throw new Error(
      `An unknown error occurred while reading "${connectorPath}"`,
    );
  }

  if (!json.name || !json.version) {
    throw new Error(
      `The "connector.json" file must contain "name" and "version" fields`,
    );
  }

  core.info(
    `Connector file has been parsed successfully. Name: ${json.name}, Version: ${json.version}`,
  );

  return {
    name: json.name,
    version: json.version,
  };
}
