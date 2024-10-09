# Tray CDK Deployment

A GitHub Action which can deploy Tray.ai CDK connectors to your Tray.io account.

## Inputs

- `apiKey` - The API key for the Tray.ai account (**Required**)
- `region` - The region of the Tray.ai account. Options: `us1`, `eu1`, `apac1` (**Required**)
- `executable` - The path to the CDK executable. If not set, the global executable will be used (**Optional**)
- `path` - The path to the CDK connector which should be built and deployed. If not set, the project root will be used (**Optional**)

## Outputs

- `name` - The name of the deployed connector which was deployed.
- `version` - The version of the deployed connector which was deployed.
- `buildPath` The full path to the built connector (if successful).
- `deploymentId` The ID of the deployment which was created (if successful).
- `successful` - Whether the deployment was completed successfully.

## Example usage

```yaml
uses: mention-me/tray-cdk-deployment@v0.1.0
with:
  path: "path/to/connector/root"
  region: "us1"
  apiKey: ${{ secrets.TRAY_API_KEY }}
```

# Contributing

## Development

To develop this action, you can use the following commands:
- `npm run test` - Run the tests
- `npm run bundle` - Update the distribution files (`./dist`). This is required before merging changes.

## Releasing

To release a new version of this action, you can do the following:
1. Update the version in `package.json` (and run `npm install` to update the lock file)
2. Run `npm run bundle` to update the distribution files
3. Commit the changes
4. Publish the [draft release](https://github.com/mention-me/tray-cdk-deployment/releases)