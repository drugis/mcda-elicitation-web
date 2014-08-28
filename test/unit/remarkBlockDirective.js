define(['angular', 'angular-mocks', 'mcda/directives'], 
  function(angular) {
    var element;
    describe('the remarksblock directive', function() {
      beforeEach(module('elicit.directives'));
      beforeEach(inject(function($rootScope, $compile) {
        $rootScope.remarkStr = "initial value";
        $rootScope.saveRemarks = function() {};
        element = angular.element('<remarkblock remark="remarkStr" save-remarks="saveRemarks"></remarkblock>');
      }));
      it('should true', function() {
        console.log('poep');
        expect(true).toEqual(true);
      });
    });
  });
