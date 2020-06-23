"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var lodash_1 = __importDefault(require("lodash"));
function mapWorkspace(queryResult) {
    return {
        id: queryResult.id,
        title: queryResult.title,
        therapeuticContext: queryResult.therapeuticcontext,
        useFavourability: queryResult.usefavourability
    };
}
exports.mapWorkspace = mapWorkspace;
function mapCriteria(criteria) {
    return lodash_1["default"](criteria)
        .sortBy('orderindex')
        .map(function (queryCriterion) {
        return {
            id: queryCriterion.id,
            title: queryCriterion.title,
            description: queryCriterion.description,
            isFavourable: queryCriterion.isfavourable,
            dataSources: []
        };
    })
        .value();
}
exports.mapCriteria = mapCriteria;
function mapAlternatives(alternatives) {
    return lodash_1["default"](alternatives)
        .sortBy('orderindex')
        .map(function (queryAlternative) {
        return {
            id: queryAlternative.id,
            title: queryAlternative.title
        };
    })
        .value();
}
exports.mapAlternatives = mapAlternatives;
function mapDataSources(dataSources) {
    return lodash_1["default"](dataSources)
        .sortBy('orderindex')
        .map(function (queryDataSource) {
        return {
            id: queryDataSource.id,
            criterionId: queryDataSource.criterionid,
            reference: queryDataSource.reference,
            uncertainty: queryDataSource.uncertainty,
            strengthOfEvidence: queryDataSource.strengthofevidence,
            unitOfMeasurement: {
                label: queryDataSource.unitlabel,
                type: queryDataSource.unittype,
                lowerBound: queryDataSource.unitlowerbound,
                upperBound: queryDataSource.unitupperbound
            }
        };
    })
        .value();
}
exports.mapDataSources = mapDataSources;
function mapCellValues(cellValues) {
    var _a = lodash_1["default"].partition(cellValues, [
        'cellType',
        'effect'
    ]), effectCellValues = _a[0], distributionCellValues = _a[1];
    return [
        createEffectRecords(effectCellValues),
        createDistributionRecords(distributionCellValues)
    ];
}
exports.mapCellValues = mapCellValues;
function createEffectRecords(effectQueryResults) {
    return lodash_1["default"].reduce(effectQueryResults, function (accum, effectQueryResult) {
        if (!accum[effectQueryResult.datasourceid]) {
            accum[effectQueryResult.datasourceid] = {};
        }
        accum[effectQueryResult.datasourceid][effectQueryResult.alternativeid] = mapEffect(effectQueryResult);
        return accum;
    }, {});
}
function mapEffect(effectQueryResult) {
    var sharedProperties = {
        alternativeId: effectQueryResult.alternativeid,
        dataSourceId: effectQueryResult.datasourceid,
        criterionId: effectQueryResult.criterionid
    };
    switch (effectQueryResult.inputtype) {
        case 'value':
            return __assign({ value: effectQueryResult.val, type: effectQueryResult.inputtype }, sharedProperties);
        case 'valueCI':
            return __assign({ value: effectQueryResult.val, lowerBound: effectQueryResult.lowerbound, upperBound: effectQueryResult.upperbound, type: effectQueryResult.inputtype }, sharedProperties);
        case 'range':
            return __assign({ lowerBound: effectQueryResult.lowerbound, upperBound: effectQueryResult.upperbound, type: effectQueryResult.inputtype }, sharedProperties);
        case 'empty':
            return __assign({ type: effectQueryResult.inputtype }, sharedProperties);
        case 'text':
            return __assign({ text: effectQueryResult.txt, type: effectQueryResult.inputtype }, sharedProperties);
    }
}
function createDistributionRecords(distributionQueryResults) {
    return lodash_1["default"].reduce(distributionQueryResults, function (accum, distributionQueryResult) {
        if (!accum[distributionQueryResult.datasourceid]) {
            accum[distributionQueryResult.datasourceid] = {};
        }
        accum[distributionQueryResult.datasourceid][distributionQueryResult.alternativeid] = mapDistribution(distributionQueryResult);
        return accum;
    }, {});
}
function mapDistribution(distributionQueryResult) {
    var sharedProperties = {
        alternativeId: distributionQueryResult.alternativeid,
        dataSourceId: distributionQueryResult.datasourceid,
        criterionId: distributionQueryResult.criterionid
    };
    switch (distributionQueryResult.inputtype) {
        case 'value':
            return __assign({ value: distributionQueryResult.val, type: distributionQueryResult.inputtype }, sharedProperties);
        case 'range':
            return __assign({ lowerBound: distributionQueryResult.lowerbound, upperBound: distributionQueryResult.upperbound, type: distributionQueryResult.inputtype }, sharedProperties);
        case 'empty':
            return __assign({ type: distributionQueryResult.inputtype }, sharedProperties);
        case 'text':
            return __assign({ text: distributionQueryResult.txt, type: distributionQueryResult.inputtype }, sharedProperties);
        case 'normal':
            return __assign({ mean: distributionQueryResult.mean, standardError: distributionQueryResult.standarderror, type: distributionQueryResult.inputtype }, sharedProperties);
        case 'beta':
            return __assign({ alpha: distributionQueryResult.alpha, beta: distributionQueryResult.beta, type: distributionQueryResult.inputtype }, sharedProperties);
        case 'gamma':
            return __assign({ alpha: distributionQueryResult.alpha, beta: distributionQueryResult.beta, type: distributionQueryResult.inputtype }, sharedProperties);
    }
}
function mapCombinedResults(results) {
    return {
        workspace: results[0],
        criteria: mapDataSourcesOntoCriteria(results[1], results[3]),
        alternatives: results[2],
        effects: results[4][0],
        distributions: results[4][1]
    };
}
exports.mapCombinedResults = mapCombinedResults;
function mapDataSourcesOntoCriteria(criteria, dataSources) {
    var dataSourcesGroupedByCriterion = lodash_1["default"].groupBy(dataSources, 'criterionId');
    return lodash_1["default"].map(criteria, function (criterion) {
        return __assign(__assign({}, criterion), { dataSources: dataSourcesGroupedByCriterion[criterion.id]
                ? dataSourcesGroupedByCriterion[criterion.id]
                : [] });
    });
}
//# sourceMappingURL=inProgressRepositoryService.js.map