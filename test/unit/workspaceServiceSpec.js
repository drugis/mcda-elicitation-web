define(['angular', 'angular-mocks', 'mcda/services/workspaceService'], function() {

  describe('the workspace service', function() {

    var mockPataviService;

    beforeEach(module('elicit.workspaceService', function($provide) {
      mockPataviService = jasmine.createSpyObj('MCDAPataviService', ['run']);
        mockRunResult = {
          then: function() { return 'mockResult'}
        };

      mockPataviService.run.and.returnValue(mockRunResult);
      $provide.value('MCDAPataviService', mockPataviService);
    }));

    describe('buildValueTree', function() {
      it('should build the value tree from the problem criteria',
        inject(function(WorkspaceService) {
          var problem = {
            criteria: {
              'crit 1': 'val1',
              'crit 2': 'val2',
            }
          };

          var result = WorkspaceService.buildValueTree(problem);
          expect(result.title).toEqual('Overall value');
          expect(result.criteria).toEqual(['crit 1', 'crit 2']);
        }));
    });

    describe('buildTheoreticalScales', function() {
      it('should build theoretical scales', inject(function(WorkspaceService) {
        var problem = {
          criteria: {
            'crit1': {},
            'crit2': {
              scale: [
                10,
                20
              ]
            }
          }
        };
        var result = WorkspaceService.buildTheoreticalScales(problem);
        console.log(JSON.stringify(result));
        expect(result.crit1[0]).toBe(-Infinity);
        expect(result.crit1[1]).toBe(Infinity);
        expect(result.crit2[0]).toBe(problem.criteria.crit2.scale[0]);
        expect(result.crit2[1]).toBe(problem.criteria.crit2.scale[1]);
      }));
    });

    describe('getObservedScales', function() {

      beforeEach(function() {
      });

      it('should call the pataviService', inject(function(WorkspaceService) {
        var problem = {}
        var result = WorkspaceService.getObservedScales(problem);
        expect(mockPataviService.run).toHaveBeenCalled();
        expect(result).toBe('mockResult');
      }));

    });
  });

});
