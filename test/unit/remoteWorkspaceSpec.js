define(['angular', 'angular-mocks', 'angular-ui-router', 'mcda/services/partialValueFunction', 'mcda/services/remoteWorkspaces'],
  function(angular, RemoteWorkspaces) {

    window.config.examplesRepository = "/examples/";
    window.config.workspacesRepository = {
      service: "RemoteWorkspaces",
      url: "workspaces/"
    };

    describe('remote workspace init test', function() {

      beforeEach(module('elicit.pvfService'));
      beforeEach(module('elicit.remoteWorkspaces'));

      beforeEach(module(function($provide) {
        var $state = jasmine.createSpyObj('$state', ['go']);
        $provide.value('$state', $state);
      }));

      it('should expose a set of resource functions', inject(function(RemoteWorkspaces) {
        expect(RemoteWorkspaces.create).toBeDefined();
        expect(RemoteWorkspaces.get).toBeDefined();
        expect(RemoteWorkspaces.query).toBeDefined();
      }));

    });

    describe('remote workspace get test', function() {

      beforeEach(module('elicit.remoteWorkspaces'));

      beforeEach(module(function($provide) {
        var $location = jasmine.createSpyObj('$location', ['path']);
        $location.path.and.returnValue('/choose-problem');
        $provide.value('$location', $location);
        var $state = jasmine.createSpyObj('$state', ['go']);
        $provide.value('$state', $state);
      }));

      it('should get the decorated workspace', inject(function($rootScope, $httpBackend, $location, RemoteWorkspaces) {
        var workspaceId = 1,
          mockWorkspace = jasmine.createSpyObj('mockWorkspace', ['test']),
          resolvedValue,
          getPromise;

        mockWorkspace.problem = {
          criteria: {}
        };

        $httpBackend.when('GET', 'workspaces/1').respond(mockWorkspace);
        getPromise = RemoteWorkspaces.get(workspaceId);

        getPromise.then(function(value) {
          resolvedValue = value;
        });
        $httpBackend.flush();
        $rootScope.$apply();

        // check to see is resolved workspace has been decorated as expected
        expect(typeof resolvedValue.redirectToDefaultView).toBe('function');
        expect(typeof resolvedValue.getScenario).toBe('function');
        expect(typeof resolvedValue.newScenario).toBe('function');
        expect(typeof resolvedValue.query).toBe('function');
      }));

    });
  });