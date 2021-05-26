export default function significantDigits(x: number, precision?: number) {
  if (x === undefined || x === null || isNaN(x)) {
    throw `attempt to apply significant digits to non-numeric value: ${x}`;
  }
  if (precision !== 0 && !precision) {
    precision = 3;
  }
  if (x === 0) {
    return x;
  }
  if (x > 1 || x < -1) {
    return Number.parseFloat(x.toFixed(precision));
  } else {
    return Number.parseFloat(x.toPrecision(precision));
  }
}
