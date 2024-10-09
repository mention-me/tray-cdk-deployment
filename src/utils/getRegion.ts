export const Region = ["us1", "eu1", "apac1"] as const;

/**
 * Get the base URL for a given region.
 */
export const getRegion = (region: string): (typeof Region)[number] => {
  const isValid = Region.includes(
    region.toLowerCase() as (typeof Region)[number],
  );

  if (!isValid) {
    throw new Error(`Invalid region: ${region}`);
  }

  return region.toLowerCase() as (typeof Region)[number];
};
