'use strict';
define([ 'angular-mocks', 'mcda/preferences/preferences'], function() {
  var tradeOffService, q;

  var pataviResultsServiceMock = jasmine.createSpyObj('PataviResultsService', ['postAndHandleResults']);

  beforeEach(module('elicit.preferences', function($provide) {
    $provide('PataviResultsService', pataviResultsServiceMock);
  }));
  beforeEach(inject(function (TradeOffService, $q) {
    tradeOffService = TradeOffService;
    q = $q;
  }));

  define('getIndifferenceCurve', function() {
    beforeEach(function(){
      var taskResultsDefer = q.defer();
      var taskResultsPromise = taskResultsDefer.promise;
      pataviResultsServiceMock.postAndHandleResults.and.returnValue(taskResultsPromise);
    });

    it('should attach the selected coordinates and criteria, query R and return a promise for the results', function(){
      tradeOffService.getIndifferenceCurve(criteria, coordinates)
    });
  });
});
