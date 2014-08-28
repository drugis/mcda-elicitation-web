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
        //$httpBackend.when('GET', 'yopath/partials/remark.html').respond(replacedHtml);

     //   template = $templateCache.get('app/partials/remark.html');
     //  $templateCache.put('mcda/partials/remark.html',template);

        $rootScope.remarkStr = "initial value";
        $rootScope.saveRemarks = function() {};

        element = angular.element('<remarkblock remark="remarkStr" save-remarks="saveRemarks"></remarkblock>');
        scope = $rootScope;
        element = $compile(element)(scope);
        scope.$digest();
      //  $httpBackend.flush();
      }));

      it('should true', function() {
        expect(element.html()).not.toBeNull();
        var btn = $('#remark-succes-btn', element);
        btn.click(); 
        
      });
    });
  });