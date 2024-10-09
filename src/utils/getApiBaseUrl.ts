import { getRegion } from "./getRegion";

export type ApiBaseUrl =
  | "https://api.tray.io"
  | "https://api.eu1.tray.io"
  | "https://api.ap1.tray.io";

/**
 * Get the base URL for a given region.
 */
export const getApiBaseUrl = (
  region: ReturnType<typeof getRegion>,
): ApiBaseUrl => {
  switch (region) {
    case "us1":
      return "https://api.tray.io";
    case "eu1":
      return "https://api.eu1.tray.io";
    case "apac1":
      return "https://api.ap1.tray.io";
    default:
      throw new Error(`Invalid region: ${region}`);
  }
};
