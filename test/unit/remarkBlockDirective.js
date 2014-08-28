define(['angular', 'angular-mocks', 'mcda/directives'],
  function(angular) {
    var element, scope,
    replacedHtml = '<div>ok</div>';
    describe('the remarksblock directive', function() {

      beforeEach(module('elicit.directives', function($provide) {
        $provide.constant('mcdaRootPath', 'yopath/');
      }));

      beforeEach(inject(function($rootScope, $compile, $httpBackend) {
        $httpBackend.when('GET', 'yopath/partials/remark.html').respond(replacedHtml);

        $rootScope.remarkStr = "initial value";
        $rootScope.saveRemarks = function() {};

        element = angular.element('<remarkblock remark="remarkStr" save-remarks="saveRemarks"></remarkblock>');
        scope = $rootScope;
        $compile(element)(scope);
      }));

      it('should true', function() {
        expect(element.html()).toBe(replacedHtml)
        scope.$digest();
        expect(scope.model.saveRemarks).isDefined();
      });
    });
  });