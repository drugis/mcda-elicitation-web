define(['angular', 'angular-mocks', 'services/partialValueFunction', 'services/remoteWorkspaces'], function(angular, $location, RemoteWorkspaces) {

  window.config = {
    examplesRepository: "/examples/",
    workspacesRepository: {
      service: "RemoteWorkspaces",
      url: "workspaces/"
    }
  };

  describe('remote workspace init test', function() {

    beforeEach(module('elicit.pvfService'));
    beforeEach(module('elicit.remoteWorkspaces'));

    it('should expose a set of resource functions', inject(function(RemoteWorkspaces) {
      expect(RemoteWorkspaces.create).toBeDefined();
      expect(RemoteWorkspaces.get).toBeDefined();
      expect(RemoteWorkspaces.query).toBeDefined();
    }));

  });

  describe('remote workspace get test', function() {

    beforeEach(module('elicit.remoteWorkspaces'));

    it('should get the decorated workspace', inject(function($rootScope, $httpBackend, $location, RemoteWorkspaces) {
      var workspaceId = 1,
        mockWorkspace = jasmine.createSpyObj('mockWorkspace', ['test']),
        resolvedValue,
        getPromise;

      spyOn($location, 'path').and.returnValue('/choose-problem');
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

    xit('should use the config url', inject(function($rootScope, $httpBackend, $location, $stateParams, RemoteWorkspaces) {
      var workspaceId = 1,
       scenarioId = 2,
        mockWorkspace = jasmine.createSpyObj('mockWorkspace', ['test']),
        workspace,
        getPromise;

      spyOn($location, 'path').and.callFake(function() {});

      $httpBackend.when('GET', 'workspaces/1').respond(mockWorkspace);
      getPromise = RemoteWorkspaces.get(workspaceId);
      getPromise.then(function(value) {
        workspace = value;
      });
      $httpBackend.flush();
      $rootScope.$apply();

      workspace.redirectToDefaultView(scenarioId);
      expect(workspace).toBeDefined();
      expect($location.path).toHaveBeenCalled();
    }));

  });
});