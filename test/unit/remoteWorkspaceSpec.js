define(['angular', 'angular-mocks', 'services/partialValueFunction', 'services/remoteWorkspaces'], function(angular, RemoteWorkspaces) {

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

    it('should get the decorated workspace', inject(function($rootScope, $httpBackend, RemoteWorkspaces) {
      var workspaceId = 1,
        mockWorkspace = jasmine.createSpyObj('mockWorkspace', ['test']),
        resolvedValue,
        getPromise;

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

    it('use the config url', inject(function($rootScope, $httpBackend, RemoteWorkspaces) {
      var workspaceId = 1,
        mockWorkspace = jasmine.createSpyObj('mockWorkspace', ['test']),
        resolvedValue,
        getPromise;

      $httpBackend.when('GET', 'workspaces/1').respond(mockWorkspace);

      getPromise = RemoteWorkspaces.get(workspaceId);

      getPromise.then(function(value) {
        resolvedValue = value;
      });
      $httpBackend.flush();
      $rootScope.$apply();

      expect(resolvedValue).toBeDefined();
    }));

  });
});