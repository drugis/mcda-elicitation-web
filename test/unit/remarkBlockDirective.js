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

        element = angular.element('<remarkblock remark="remarkStr" save-remarks="saveRemarks()" cancel-remarks="cancelRemarks()"></remarkblock>');
        scope = $rootScope;
        element = $compile(element)(scope);
        scope.$digest();

      }));

      it('should have a cancel function', function() {
        var isolateScope = element.isolateScope();
        expect(isolateScope.cancelRemarks).toBeDefined;
      });

      it('should have a save function', function() {
        var isolateScope = element.isolateScope();
        expect(isolateScope.saveRemarks).toBeDefined;
      })
    });
  });