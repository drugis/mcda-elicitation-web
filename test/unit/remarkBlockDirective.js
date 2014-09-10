define(['angular', 'angular-mocks', 'mcda/directives'],
  function(angular) {
    var element, scope,
    replacedHtml = '<div>ok</div>';
    describe('the remarksblock directive', function() {

      beforeEach(module('app/partials/remark.html'));

      beforeEach(module('elicit.directives', function($provide) {
        $provide.constant('mcdaRootPath', 'app/');
      }));

      beforeEach(inject(function($rootScope, $compile, $httpBackend, $templateCache) {
      
        $rootScope.remarkStr = 'initial value';
        $rootScope.saveRemarks = jasmine.createSpy('saveRemarks');

        element = angular.element('<remarkblock remark="remarkStr" save-remarks="saveRemarks"></remarkblock>');
        scope = $rootScope;
        element = $compile(element)(scope);
        scope.$digest();

      }));

      it('should put back the old remark when cancelled', function() {
        var isolateScope = element.isolateScope();
        isolateScope.remark = 'new value';
        isolateScope.model.cancelRemarks();
        expect(isolateScope.remark).toEqual('initial value');
      });

      it('should call save and update the cached remark when saving', function() {
        var isolateScope = element.isolateScope();
        isolateScope.remark = 'new value';
        isolateScope.model.saveRemarks();
        expect(isolateScope.cachedRemark).toEqual('new value');
        expect(scope.saveRemarks).toHaveBeenCalled();
      })
    });
  });