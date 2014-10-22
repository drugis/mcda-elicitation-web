define(['angular', 'angular-mocks', 'mcda/services/scaleRangeService'], function() {
  describe('The scaleRange service', function() {

    var a;

    describe('nice', function() {

      beforeEach(module('elicit.scaleRangeService'));

      beforeEach(function() {

      });

      it('should do something',
        inject(function($rootScope, ScaleRangeService) {
          
          expect(ScaleRangeService.nice(-16)).toEqual(-20);
        }));

    });
  });
});