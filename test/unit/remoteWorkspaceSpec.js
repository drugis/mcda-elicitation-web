define(['angular', 'angular-mocks', 'services/remoteWorkspaces'], function(angular, RemoteWorkspaces) {
  describe('remote workspace init test', function() {

    beforeEach(module('elicit.remoteWorkspaces'));

    it('should expose a set of resource functions', inject(function(RemoteWorkspaces) {
     expect(RemoteWorkspaces.create).toBeDefined();
     expect(RemoteWorkspaces.get).toBeDefined();
     expect(RemoteWorkspaces.query).toBeDefined();
    }));
  });
});