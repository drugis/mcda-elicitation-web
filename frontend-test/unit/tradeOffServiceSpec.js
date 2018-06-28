'use strict';
define(['angular', 'angular-mocks', 'mcda/preferences/preferences'], function() {
  describe('the TradeOffService', function() {
    var tradeOffService;
    var taskResultsDefer;
    var pataviResultsServiceMock = jasmine.createSpyObj('PataviResultsService', ['postAndHandleResults']);

    beforeEach(module('elicit.preferences', function($provide) {
      $provide.value('PataviResultsService', pataviResultsServiceMock);
    }));
    beforeEach(inject(function($q, TradeOffService) {
      tradeOffService = TradeOffService;
      taskResultsDefer = $q.defer();
    }));
    
    describe('getIndifferenceCurve', function() {
      beforeEach(function() {
        var taskResultsPromise = taskResultsDefer.promise;
        pataviResultsServiceMock.postAndHandleResults.and.returnValue(taskResultsPromise);
      });

      it('should attach the selected coordinates and criteria, query R and return a promise for the results', function() {
        var problem = {};
        var criteria = {
          firstCriterion: {
            id: 'crit1'
          },
          secondCriterion: {
            id: 'crit2'
          }
        };
        var coordinates = { x: 1, y: 2 };
        tradeOffService.getIndifferenceCurve(problem, criteria, coordinates);
        expect(pataviResultsServiceMock).toHaveBeenCalledWith({
          method: 'indifferenceCurve',
          indifferenceCurve: {
            criterionX: 'crit1',
            criterionY: 'crit2',
            x: 1,
            y: 2
          }
        });

      });
    });
  });
});
