import { getApiBaseUrl } from "../getApiBaseUrl";
import { Region } from "../getRegion";

describe("Given a valid region", () => {
  it.each([
    [Region[0], "https://api.tray.io"],
    [Region[1], "https://api.eu1.tray.io"],
    [Region[2], "https://api.ap1.tray.io"],
  ])(
    "should cover the region into the correct base url",
    (region: (typeof Region)[number], expectedBaseUrl: string) => {
      expect(getApiBaseUrl(region)).toEqual(expectedBaseUrl);
    },
  );
});
