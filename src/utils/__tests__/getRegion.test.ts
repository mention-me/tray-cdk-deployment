import { getRegion, Region } from "../getRegion";

describe("Given a user inputted region", () => {
  it.each([
    ["us1", Region[0]],
    ["eu1", Region[1]],
    ["apac1", Region[2]],
  ])(
    "should parse valid inputs into the correct region",
    (region: string, expectedRegion: string) => {
      expect(getRegion(region)).toEqual(expectedRegion);
    },
  );

  it.each([["   us1    "], ["eu1 "], ["not-a-region"], [""]])(
    "should throw an error when the user inputted region is not valid",
    (invalidRegion: string) => {
      expect(() => getRegion(invalidRegion)).toThrow(
        `Invalid region: ${invalidRegion}`,
      );
    },
  );
});
