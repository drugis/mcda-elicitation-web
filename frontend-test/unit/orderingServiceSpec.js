'use strict';
define(['angular-mocks', 'mcda/workspace/workspace'], function() {
  describe('OrderingService', function() {
    var orderingService;
    var rootScope;
    var orderDefer;
    var orderingResourceMock = jasmine.createSpyObj('OrderingResource', ['get']);

    beforeEach(module('elicit.workspace', function($provide) {
      $provide.value('OrderingResource', orderingResourceMock);
    }));

    beforeEach(inject(function($rootScope, $q, OrderingService) {
      orderDefer = $q.defer();
      var orderPromise = orderDefer.promise;
      orderingResourceMock.get.and.returnValue({
        $promise: orderPromise
      });
      orderingService = OrderingService;
      rootScope = $rootScope;
    }));

    describe('getOrderedCriteriaAndAlternatives', function() {
      it('should return the orders of the alternatives and criteria of a problem', function(done) {
        var order = {
          ordering: {
            criteria: ['crit2', 'crit3', 'crit1', 'crit4'],
            alternatives: ['alt1', 'alt3', 'alt2']
          }
        };
        orderDefer.resolve(order);
        rootScope.$digest();

        var problem = {
          criteria: {
            crit1: {
              title: 'criterion1'
            },
            crit2: {
              title: 'criterion2'
            },
            crit4: {
              title: 'criterion4'
            }
          },
          alternatives: {
            alt1: {
              title: 'alternative1'
            },
            alt2: {
              title: 'alternative2'
            },
            alt3: {
              title: 'alternative3'
            },
          }
        };
        var workspaceId = 1;
        var expectedResult = {
          alternatives: [{
            id: 'alt1',
            title: 'alternative1'
          }, {
            id: 'alt3',
            title: 'alternative3'
          }, {
            id: 'alt2',
            title: 'alternative2'
          }],
          criteria: [{
            id: 'crit2',
            title: 'criterion2'
          }, {
            id: 'crit1',
            title: 'criterion1'
          }, {
            id: 'crit4',
            title: 'criterion4'
          }]
        };
        orderingService.getOrderedCriteriaAndAlternatives(problem, workspaceId).then(function(result) {
          expect(result).toEqual(expectedResult);
          done();
        });
        rootScope.$digest();
      });

      it('should return a new order of the alternatives and criteria if no order is available for a given problem', function(done) {
        orderDefer.resolve({});
        rootScope.$digest();
        var problem = {
          criteria: {
            crit1: {
              title: 'criterion1'
            },
            crit2: {
              title: 'criterion2'
            },
            crit4: {
              title: 'criterion4'
            }
          },
          alternatives: {
            alt1: {
              title: 'alternative1'
            },
            alt2: {
              title: 'alternative2'
            },
            alt3: {
              title: 'alternative3'
            },
          }
        };
        var workspaceId = 1;
        var expectedResult = {
          alternatives: [{
            id: 'alt1',
            title: 'alternative1'
          }, {
            id: 'alt2',
            title: 'alternative2'
          }, {
            id: 'alt3',
            title: 'alternative3'
          }],
          criteria: [{
            id: 'crit1',
            title: 'criterion1'
          }, {
            id: 'crit2',
            title: 'criterion2'
          }, {
            id: 'crit4',
            title: 'criterion4'
          }]
        };
        orderingService.getOrderedCriteriaAndAlternatives(problem, workspaceId).then(function(result) {
          expect(result).toEqual(expectedResult);
          done();
        });
        rootScope.$digest();
      });

      it('should return a new order based on favorability when criteria have favorability', function(done) {
        orderDefer.resolve({});
        rootScope.$digest();
        var problem = {
          criteria: {
            crit1: {
              title: 'criterion1'
            },
            crit2: {
              title: 'criterion2'
            },
            crit4: {
              title: 'criterion4'
            }
          },
          alternatives: {
            alt1: {
              title: 'alternative1'
            },
            alt2: {
              title: 'alternative2'
            }
          },
          valueTree: {
            children: [{ criteria: ['crit2'] }, {
              criteria: ['crit1', 'crit4']
            }]
          }
        };
        var workspaceId = 1;
        var expectedResult = {
          alternatives: [{
            id: 'alt1',
            title: 'alternative1'
          }, {
            id: 'alt2',
            title: 'alternative2'
          }],
          criteria: [{
            id: 'crit2',
            title: 'criterion2'
          }, {
            id: 'crit1',
            title: 'criterion1'
          }, {
            id: 'crit4',
            title: 'criterion4'
          }]
        };
        orderingService.getOrderedCriteriaAndAlternatives(problem, workspaceId).then(function(result) {
          expect(result).toEqual(expectedResult);
          done();
        });
        rootScope.$digest();
      });
    });
  });
});