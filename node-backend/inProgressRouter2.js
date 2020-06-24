"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var inProgressWorkspaceHandler2_1 = __importDefault(require("./inProgressWorkspaceHandler2"));
function InProgressRouter(db) {
    var inProgressHandler = inProgressWorkspaceHandler2_1["default"](db);
    return express_1["default"]
        .Router()
        .post('/', inProgressHandler.create)
        .get('/:id', inProgressHandler.get)
        .put('/:id', inProgressHandler.updateWorkspace)
        .put('/:id/criteria/:criterionId', inProgressHandler.updateCriterion)["delete"]('/:id/criteria/:criterionId', inProgressHandler.deleteCriterion)
        .put('/:id/criteria/:criterionId/dataSources/:dataSourceId', inProgressHandler.updateDataSource)["delete"]('/:id/criteria/:criterionId/dataSources/:dataSourceId', inProgressHandler.deleteDataSource);
    // .post('/:id/criteria', inProgressHandler.addCriterion)
    // .post('/:id/alternatives', inProgressHandler.addAlternative)
    // .put(
    //   '/:id/alternatives/:alternativeId',
    //   inProgressHandler.updateAlternative
    // )
    // .delete(
    //   '/:id/alternatives/:alternativeId',
    //   inProgressHandler.deleteAlternative
    // )
    // .post(
    //   '/:id/criteria/:criterionId/dataSources',
    //   inProgressHandler.addDataSource
    // )
    // .put('/:id/effects', inProgressHandler.setEffect)
    // .get('/:id', inProgressHandler.get)
    // .get('/', inProgressHandler.query)
    // .delete('/:id', inProgressHandler.delete);
}
exports["default"] = InProgressRouter;
//# sourceMappingURL=inProgressRouter2.js.map