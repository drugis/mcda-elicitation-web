"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var async_1 = require("async");
var lodash_1 = __importDefault(require("lodash"));
var pg_promise_1 = __importDefault(require("pg-promise"));
var ManualInputService_1 = require("../app/js/manualInput/ManualInput/ManualInputService/ManualInputService");
var inProgressRepositoryService_1 = require("./inProgressRepositoryService");
function InProgressWorkspaceRepository(db) {
    var pgp = pg_promise_1["default"]();
    function create(userId, callback) {
        db.runInTransaction(lodash_1["default"].partial(createInProgressWorkspaceTransaction, userId), callback);
    }
    function createInProgressWorkspaceTransaction(ownerId, client, transactionCallback) {
        async_1.waterfall([
            lodash_1["default"].partial(createInProgressWorkspace, client, ownerId),
            lodash_1["default"].partial(createInProgressCriteria, client),
            lodash_1["default"].partial(createInProgressDataSources, client),
            lodash_1["default"].partial(createInProgressAlternatives, client)
        ], transactionCallback);
    }
    function createInProgressWorkspace(client, ownerId, callback) {
        var query = "INSERT INTO inProgressWorkspace (owner, state, useFavourability, title, therapeuticContext) \n         VALUES ($1, $2, true, $3, $3) \n       RETURNING id";
        client.query(query, [ownerId, {}, ''], function (error, result) {
            callback(error, error || result.rows[0].id);
        });
    }
    function createInProgressCriteria(client, inProgressworkspaceId, callback) {
        var toCreate = [
            {
                id: ManualInputService_1.generateUuid(),
                orderindex: 0,
                isfavourable: true,
                title: 'criterion 1',
                description: '',
                inprogressworkspaceid: inProgressworkspaceId
            },
            {
                id: ManualInputService_1.generateUuid(),
                orderindex: 1,
                isfavourable: false,
                title: 'criterion 2',
                description: '',
                inprogressworkspaceid: inProgressworkspaceId
            }
        ];
        var columns = new pgp.helpers.ColumnSet([
            'id',
            'orderindex',
            'isfavourable',
            'title',
            'description',
            'inprogressworkspaceid'
        ], { table: 'inprogresscriterion' });
        var query = pgp.helpers.insert(toCreate, columns) + ' RETURNING id';
        client.query(query, [], function (error, result) {
            if (error) {
                callback(error, null, null);
            }
            else {
                callback(null, inProgressworkspaceId, lodash_1["default"].map(result.rows, 'id'));
            }
        });
    }
    function createInProgressDataSources(client, inProgressworkspaceId, criterionIds, callback) {
        var toCreate = [
            {
                id: ManualInputService_1.generateUuid(),
                orderindex: 0,
                criterionid: criterionIds[0],
                inprogressworkspaceid: inProgressworkspaceId
            },
            {
                id: ManualInputService_1.generateUuid(),
                orderindex: 0,
                criterionid: criterionIds[1],
                inprogressworkspaceid: inProgressworkspaceId
            }
        ];
        var columns = new pgp.helpers.ColumnSet(['id', 'orderindex', 'criterionid', 'inprogressworkspaceid'], { table: 'inprogressdatasource' });
        var query = pgp.helpers.insert(toCreate, columns);
        client.query(query, [], function (error) {
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, inProgressworkspaceId);
            }
        });
    }
    function createInProgressAlternatives(client, inProgressworkspaceId, callback) {
        var toCreate = [
            {
                id: ManualInputService_1.generateUuid(),
                orderindex: 0,
                inprogressworkspaceid: inProgressworkspaceId,
                title: 'alternative 1'
            },
            {
                id: ManualInputService_1.generateUuid(),
                orderindex: 0,
                inprogressworkspaceid: inProgressworkspaceId,
                title: 'alternative 2'
            }
        ];
        var columns = new pgp.helpers.ColumnSet(['id', 'orderindex', 'inprogressworkspaceid', 'title'], { table: 'inprogressalternative' });
        var query = pgp.helpers.insert(toCreate, columns);
        client.query(query, [], function (error) {
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, inProgressworkspaceId);
            }
        });
    }
    function get(inProgressId, callback) {
        db.runInTransaction(lodash_1["default"].partial(getTransaction, inProgressId), function (error, results) {
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, inProgressRepositoryService_1.mapCombinedResults(results));
            }
        });
    }
    function getTransaction(inProgressId, client, transactionCallback) {
        async_1.parallel([
            lodash_1["default"].partial(getWorkspace, inProgressId, client),
            lodash_1["default"].partial(getCriteria, inProgressId, client),
            lodash_1["default"].partial(getAlternatives, inProgressId, client),
            lodash_1["default"].partial(getDataSources, inProgressId, client),
            lodash_1["default"].partial(getInProgressValues, inProgressId, client)
        ], transactionCallback);
    }
    function getWorkspace(inProgressId, client, callback) {
        var query = 'SELECT * FROM inProgressWorkspace WHERE id=$1';
        client.query(query, [inProgressId], function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, inProgressRepositoryService_1.mapWorkspace(result.rows[0]));
            }
        });
    }
    function getCriteria(inProgressId, client, callback) {
        var query = 'SELECT * FROM inProgressCriterion WHERE inProgressWorkspaceId=$1';
        client.query(query, [inProgressId], function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, inProgressRepositoryService_1.mapCriteria(result.rows));
            }
        });
    }
    function getAlternatives(inProgressId, client, callback) {
        var query = 'SELECT * FROM inProgressAlternative WHERE inProgressWorkspaceId=$1';
        client.query(query, [inProgressId], function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, inProgressRepositoryService_1.mapAlternatives(result.rows));
            }
        });
    }
    function getDataSources(inProgressId, client, callback) {
        var query = 'SELECT * FROM inProgressDataSource WHERE inProgressWorkspaceId=$1';
        client.query(query, [inProgressId], function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, inProgressRepositoryService_1.mapDataSources(result.rows));
            }
        });
    }
    function getInProgressValues(inProgressId, client, callback) {
        var query = 'SELECT * FROM inProgressWorkspaceCell WHERE inProgressWorkspaceId=$1';
        client.query(query, [inProgressId], function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, inProgressRepositoryService_1.mapCellValues(result.rows));
            }
        });
    }
    function updateWorkspace(_a, callback) {
        var title = _a.title, therapeuticContext = _a.therapeuticContext, useFavourability = _a.useFavourability, id = _a.id;
        var query = "UPDATE inProgressWorkspace\n                   SET (title, therapeuticContext, useFavourability) = ($1,$2,$3) \n                   WHERE id=$4";
        db.query(query, [title, therapeuticContext, useFavourability, id], callback);
    }
    function upsertCriterion(_a, callback) {
        var id = _a.id, inProgressWorkspaceId = _a.inProgressWorkspaceId, orderIndex = _a.orderIndex, title = _a.title, description = _a.description, isFavourable = _a.isFavourable;
        var query = "INSERT INTO inProgressCriterion \n                  (id, inProgressWorkspaceId, orderIndex, title , description, isFavourable) \n                  VALUES ($1, $2, $3, $4, $5, $6)\n                  ON CONFLICT (id)\n                  DO UPDATE\n                  SET (orderIndex, title , description, isFavourable) = ($3, $4, $5, $6)";
        db.query(query, [id, inProgressWorkspaceId, orderIndex, title, description, isFavourable], callback);
    }
    function deleteCriterion(criterionId, callback) {
        var query = "DELETE FROM inProgressCriterion WHERE id=$1";
        db.query(query, [criterionId], callback);
    }
    function upsertDataSource(_a, callback) {
        var id = _a.id, inProgressWorkspaceId = _a.inProgressWorkspaceId, criterionId = _a.criterionId, orderIndex = _a.orderIndex, reference = _a.reference, strengthOfEvidence = _a.strengthOfEvidence, uncertainty = _a.uncertainty, unitOfMeasurement = _a.unitOfMeasurement;
        var query = "INSERT INTO inProgressDataSource \n                  (id, inProgressWorkspaceId, criterionId, orderIndex, reference, strengthOfEvidence, uncertainty, unitLabel, unitType, unitLowerBound, unitUpperBound) \n                  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)\n                  ON CONFLICT (id)\n                  DO UPDATE\n                  SET (orderIndex, reference, strengthOfEvidence, uncertainty, unitLabel, unitType, unitLowerBound, unitUpperBound) = ($4, $5, $6, $7, $8, $9, $10, $11)";
        db.query(query, [
            id,
            inProgressWorkspaceId,
            criterionId,
            orderIndex,
            reference,
            strengthOfEvidence,
            uncertainty,
            unitOfMeasurement.label,
            unitOfMeasurement.type,
            unitOfMeasurement.lowerBound,
            unitOfMeasurement.upperBound
        ], callback);
    }
    function deleteDataSource(dataSourceId, callback) {
        var query = "DELETE FROM inProgressDataSource WHERE id=$1";
        db.query(query, [dataSourceId], callback);
    }
    function upsertAlternative(_a, callback) {
        var id = _a.id, inProgressWorkspaceId = _a.inProgressWorkspaceId, orderIndex = _a.orderIndex, title = _a.title;
        var query = "INSERT INTO inProgressAlternative \n                  (id, inProgressWorkspaceId, orderIndex, title) \n                  VALUES ($1, $2, $3, $4)\n                  ON CONFLICT (id)\n                  DO UPDATE\n                  SET (orderIndex, title) = ($3, $4)";
        db.query(query, [id, inProgressWorkspaceId, orderIndex, title], callback);
    }
    function deleteAlternative(alternativeId, callback) {
        var query = "DELETE FROM inProgressAlternative WHERE id=$1";
        db.query(query, [alternativeId], callback);
    }
    return {
        create: create,
        get: get,
        updateWorkspace: updateWorkspace,
        upsertCriterion: upsertCriterion,
        deleteCriterion: deleteCriterion,
        upsertDataSource: upsertDataSource,
        deleteDataSource: deleteDataSource,
        upsertAlternative: upsertAlternative,
        deleteAlternative: deleteAlternative
    };
}
exports["default"] = InProgressWorkspaceRepository;
//# sourceMappingURL=inProgressWorkspaceRepository2.js.map