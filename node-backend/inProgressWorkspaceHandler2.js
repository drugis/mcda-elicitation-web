"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var http_status_codes_1 = require("http-status-codes");
var inProgressWorkspaceRepository2_1 = __importDefault(require("./inProgressWorkspaceRepository2"));
var util_1 = require("./util");
function InProgressHandler(db) {
    var inProgressWorkspaceRepository = inProgressWorkspaceRepository2_1["default"](db);
    function create(request, response, next) {
        var user = util_1.getUser(request);
        inProgressWorkspaceRepository.create(user.id, function (error, createdId) {
            if (error) {
                util_1.handleError(error, next);
            }
            else {
                response.status(http_status_codes_1.CREATED);
                response.json({ id: createdId });
            }
        });
    }
    function get(request, response, next) {
        inProgressWorkspaceRepository.get(Number.parseInt(request.params.id), function (error, inProgressWorkspace) {
            if (error) {
                util_1.handleError(error, next);
            }
            else {
                response.status(http_status_codes_1.OK);
                response.json(inProgressWorkspace);
            }
        });
    }
    function updateWorkspace(request, response, next) {
        inProgressWorkspaceRepository.updateWorkspace(request.body, function (error) {
            if (error) {
                util_1.handleError(error, next);
            }
            else {
                response.sendStatus(http_status_codes_1.OK);
            }
        });
    }
    function updateCriterion(request, response, next) {
        var command = request.body;
        inProgressWorkspaceRepository.upsertCriterion(command, function (error) {
            if (error) {
                util_1.handleError(error, next);
            }
            else {
                response.sendStatus(http_status_codes_1.OK);
            }
        });
    }
    function deleteCriterion(request, response, next) {
        inProgressWorkspaceRepository.deleteCriterion(request.params.criterionId, function (error) {
            if (error) {
                util_1.handleError(error, next);
            }
            else {
                response.sendStatus(http_status_codes_1.OK);
            }
        });
    }
    function updateDataSource(request, response, next) {
        var command = request.body;
        inProgressWorkspaceRepository.upsertDataSource(command, function (error) {
            if (error) {
                util_1.handleError(error, next);
            }
            else {
                response.sendStatus(http_status_codes_1.OK);
            }
        });
    }
    function deleteDataSource(request, response, next) {
        inProgressWorkspaceRepository.deleteDataSource(request.params.dataSourceId, function (error) {
            if (error) {
                util_1.handleError(error, next);
            }
            else {
                response.sendStatus(http_status_codes_1.OK);
            }
        });
    }
    return {
        create: create,
        get: get,
        updateWorkspace: updateWorkspace,
        updateCriterion: updateCriterion,
        deleteCriterion: deleteCriterion,
        updateDataSource: updateDataSource,
        deleteDataSource: deleteDataSource
    };
}
exports["default"] = InProgressHandler;
//# sourceMappingURL=inProgressWorkspaceHandler2.js.map