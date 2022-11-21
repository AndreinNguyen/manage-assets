/** typescript implementation of DSMath https://github.com/dapphub/ds-math */
import { BigNumber } from "@ethersproject/bignumber";

export const WAD = BigNumber.from(10).pow(18);
export const RAY = BigNumber.from(10).pow(27);
/**
 * Check is x - y > or === value?
 * @param x
 * @param y
 * @param value
 */
export function differenceComparesValue(
  x: BigNumber,
  y: BigNumber,
  value: BigNumber,
  operator: "lt" | "eq" | "gt"
): boolean {
  return x.sub(y)[operator](value);
}

/**
 *
 * @param {BigNumber} x
 * @param {number} decimal
 * @returns {boolean}
 */
export function lessThanZeroPointZeroOne(
  x: BigNumber,
  decimal: number
): boolean {
  return x.lt(BigNumber.from(10).pow(decimal).div(100));
}
/**
 *
 * @param {Number}fromDecimal
 * @param {Number}toDecimal
 * @param {BigNumber}fromAmount
 * @returns {BigNumber} toAmount in BigNumber
 */
export function changeDecimal(
  fromDecimal: number,
  toDecimal: number,
  fromAmount: BigNumber
): BigNumber {
  const multiplier = BigNumber.from(10).pow(Math.abs(fromDecimal - toDecimal));
  let toAmount = fromAmount;
  if (fromDecimal > toDecimal) {
    toAmount = fromAmount.div(multiplier);
  } else if (fromDecimal < toDecimal) {
    toAmount = fromAmount.mul(multiplier);
  }
  return toAmount;
}
/**
 * @param {BigNumber} x in BigNumber
 * @returns convertion to WAD
 */
export function nativeToWAD(x: BigNumber, decimal: number): BigNumber {
  const denominator = BigNumber.from(10).pow(decimal);
  const multiplier = WAD;
  return x.mul(multiplier).div(denominator);
}

/**
 * @param {BigNumber} x in BigNumber
 * @returns convertion to Origin
 */
export function wadToNative(x: BigNumber, decimal: number): BigNumber {
  const denominator = WAD;
  const multiplier = BigNumber.from(10).pow(decimal);
  return x.mul(multiplier).div(denominator);
}

/**
 * @param {BigNumber} x in BigNumber Int
 * @returns convertion to WAD
 */
export function bnIntToWAD(x: BigNumber): BigNumber {
  return x.mul(WAD);
}

/**
 * @param {BigNumber} x in BigNumber Int
 * @returns convertion to RAY
 */
export function bnIntToRAY(x: BigNumber): BigNumber {
  return x.mul(RAY);
}

/**
 * @param {BigNumber} x in WAD
 * @returns convertion to RAY
 */
export function wadToRay(x: BigNumber): BigNumber {
  return x.mul(RAY).div(WAD);
}

/**
 * @param {BigNumber} x in RAY
 * @returns convertion to WAD
 */
export function rayToWad(x: BigNumber): BigNumber {
  return x.mul(WAD).div(RAY);
}

/**
 * @param {BigNumber} x in WAD
 * @param {BigNumber} y in WAD
 * @returns the product of x and y, in WAD
 */
export function wmul(x: BigNumber, y: BigNumber): BigNumber {
  return x.mul(y).add(WAD.div(2)).div(WAD);
}

/**
 * @param {BigNumber} x in WAD
 * @param {BigNumber} y in WAD
 * @returns the quotient of x divided by y, in WAD
 */
export function wdiv(x: BigNumber, y: BigNumber): BigNumber {
  if (y.gt(BigNumber.from(0))) {
    return x.mul(WAD).add(y.div(2)).div(y);
  }
  // in case slippage(%) is a big negative number, return value default = 1
  return BigNumber.from(1);
}

/**
 * @param {BigNumber} x in RAY
 * @param {BigNumber} y in RAY
 * @returns the product of x and y, in RAY
 */
export function rmul(x: BigNumber, y: BigNumber): BigNumber {
  return x.mul(y).add(RAY.div(2)).div(RAY);
}

/**
 * @param {BigNumber} x in RAY
 * @param {BigNumber} n
 * @returns the exponential of x to the power n, in RAY
 */
export function rpow(x: BigNumber, n: BigNumber): BigNumber {
  let z = !n.mod(2).eq(0) ? x : RAY;

  for (n = n.div(2); !n.eq(0); n = n.div(2)) {
    x = rmul(x, x);

    if (!n.mod(2).eq(0)) {
      z = rmul(z, x);
    }
  }
  return z;
}
