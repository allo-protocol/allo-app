import { Address } from "viem";
import { Allocation } from "~/schemas";

type MatchingResult = Record<string, bigint>;
type ContributionMap = Record<Address, Record<Address, number>>;

// Constants for precision handling
const PRECISION = 18n; // Number of decimal places for fixed-point arithmetic
const SCALE = 18n ** PRECISION; // Scaling factor for fixed-point numbers

export function getContributions(allocations: Allocation[]): ContributionMap {
  return allocations.reduce((acc, { to, from, amount }) => {
    (acc[to] ??= {})[from] = (acc[to][from] ?? 0) + amount;
    return acc;
  }, {} as ContributionMap);
}

export function calculateQuadraticMatching(
  allocations: Allocation[],
  matching: bigint
): MatchingResult {
  // Get contributions grouped by recipient and contributor
  const contributions = getContributions(allocations);
  const sqrtSums = Object.fromEntries(
    Object.entries(contributions).map(([recipient, contribs]) => [
      recipient,
      Object.values(contribs).reduce(
        (sum, amount) =>
          sum + sqrtBigInt(BigInt(Math.floor(amount * Number(SCALE)))),
        0n
      ),
    ])
  );

  const sumOfSquaredSums = Object.values(sqrtSums).reduce(
    (sum, sqrt) => sum + (sqrt * sqrt) / SCALE,
    0n
  );

  if (sumOfSquaredSums === 0n) {
    return Object.fromEntries(Object.keys(contributions).map((k) => [k, 0n]));
  }

  const result: MatchingResult = Object.fromEntries(
    Object.entries(sqrtSums).map(([recipient, sqrt]) => [
      recipient,
      (matching * (sqrt * sqrt)) / SCALE / sumOfSquaredSums,
    ])
  );

  const sumOfMatching = Object.values(result).reduce(
    (sum, amount) => sum + amount,
    0n
  );
  const dust = matching - sumOfMatching;

  if (dust > 0n) {
    const maxRecipient = Object.entries(sqrtSums).reduce(
      (max, [r, sum]) => (sum > max.sum ? { recipient: r, sum } : max),
      { recipient: "", sum: 0n }
    ).recipient;
    result[maxRecipient] = (result[maxRecipient] ?? 0n) + dust;
  }

  return result;
}

function sqrtBigInt(value: bigint): bigint {
  // Newton's method for square root with fixed-point arithmetic
  if (value < 0n) {
    throw new Error("Square root of negative number");
  }
  if (value === 0n) {
    return 0n;
  }

  // Scale up for more precision
  let z = value * SCALE;
  let x = value;
  let y = (x + 1n) / 2n;

  while (y < x) {
    x = y;
    y = (y + z / y) / 2n;
  }

  return x;
}
