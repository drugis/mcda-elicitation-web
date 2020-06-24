"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var lodash_1 = __importDefault(require("lodash"));
var significantDigits_1 = __importDefault(require("../Util/significantDigits"));
function generateUuid() {
    var pattern = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    return pattern.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0;
        var v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
exports.generateUuid = generateUuid;
function createDistributions(distributions, effects) {
    var distributionsCopy = lodash_1["default"].cloneDeep(distributions);
    lodash_1["default"].forEach(effects, function (row, dataSourceId) {
        lodash_1["default"].forEach(row, function (effect, alternativeId) {
            var newDistribution = generateDistribution(effect);
            if (!distributionsCopy[dataSourceId]) {
                distributionsCopy[dataSourceId] = {};
            }
            distributionsCopy[dataSourceId][alternativeId] = newDistribution;
        });
    });
    return distributionsCopy;
}
exports.createDistributions = createDistributions;
function generateDistribution(effect) {
    switch (effect.type) {
        case 'valueCI':
            return generateValueCIDistribution(effect);
        default:
            return lodash_1["default"].cloneDeep(effect);
    }
}
function generateValueCIDistribution(effect) {
    if (areBoundsSymmetric(effect)) {
        return createNormalDistribution(effect);
    }
    else {
        return createValueDistribution(effect);
    }
}
exports.generateValueCIDistribution = generateValueCIDistribution;
function areBoundsSymmetric(effect) {
    return (Math.abs(1 -
        (effect.value - effect.lowerBound) / (effect.upperBound - effect.value)) < 0.05);
}
exports.areBoundsSymmetric = areBoundsSymmetric;
function createNormalDistribution(effect) {
    return {
        alternativeId: effect.alternativeId,
        dataSourceId: effect.dataSourceId,
        criterionId: effect.criterionId,
        mean: effect.value,
        type: 'normal',
        standardError: boundsToStandardError(effect.lowerBound, effect.upperBound)
    };
}
exports.createNormalDistribution = createNormalDistribution;
function boundsToStandardError(lowerBound, upperBound) {
    return significantDigits_1["default"]((upperBound - lowerBound) / (2 * 1.96));
}
exports.boundsToStandardError = boundsToStandardError;
function createValueDistribution(effect) {
    return {
        alternativeId: effect.alternativeId,
        dataSourceId: effect.dataSourceId,
        criterionId: effect.criterionId,
        value: effect.value,
        type: 'value'
    };
}
exports.createValueDistribution = createValueDistribution;
function createWarnings(title, criteria, alternatives) {
    var newWarnings = [];
    if (!title) {
        newWarnings.push('No title entered');
    }
    if (criteria.length < 2) {
        newWarnings.push('At least two criteria are required');
    }
    if (alternatives.length < 2) {
        newWarnings.push('At least two alternatives are required');
    }
    if (isDataSourceMissing(criteria)) {
        newWarnings.push('All criteria require at least one reference');
    }
    if (hasDuplicateTitle(criteria)) {
        newWarnings.push('Criteria must have unique titles');
    }
    if (hasDuplicateTitle(alternatives)) {
        newWarnings.push('Alternatives must have unique titles');
    }
    if (hasEmptyTitle(criteria)) {
        newWarnings.push('Criteria must have a title');
    }
    if (hasEmptyTitle(alternatives)) {
        newWarnings.push('Alternatives must have a title');
    }
    // each datasource/alternative pair should have at least an effect or a distribution ? Douwe
    return newWarnings;
}
exports.createWarnings = createWarnings;
function hasEmptyTitle(items) {
    return lodash_1["default"].some(items, { title: '' });
}
function isDataSourceMissing(criteria) {
    return lodash_1["default"].some(criteria, function (criterion) {
        return !criterion.dataSources.length;
    });
}
function hasDuplicateTitle(list) {
    return lodash_1["default"].uniqBy(list, 'title').length !== list.length;
}
function swapItems(id1, id2, items) {
    var _a;
    var index1 = lodash_1["default"].findIndex(items, ['id', id1]);
    var index2 = lodash_1["default"].findIndex(items, ['id', id2]);
    var itemsCopy = lodash_1["default"].cloneDeep(items);
    // ES6 swap trick below, don't even worry about it
    _a = [
        itemsCopy[index2],
        itemsCopy[index1]
    ], itemsCopy[index1] = _a[0], itemsCopy[index2] = _a[1];
    return itemsCopy;
}
exports.swapItems = swapItems;
//# sourceMappingURL=ManualInputService.js.map