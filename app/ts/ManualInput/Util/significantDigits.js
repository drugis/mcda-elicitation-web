"use strict";
exports.__esModule = true;
function significantDigits(x, precision) {
    if (precision !== 0 && !precision) {
        precision = 3;
    }
    if (x === 0) {
        return x;
    }
    if (x > 1 || x < -1) {
        return Number.parseFloat(x.toFixed(precision));
    }
    else {
        return Number.parseFloat(x.toPrecision(precision));
    }
}
exports["default"] = significantDigits;
//# sourceMappingURL=significantDigits.js.map