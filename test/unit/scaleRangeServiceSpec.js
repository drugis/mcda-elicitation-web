define(['angular', 'angular-mocks', 'mcda/services/scaleRangeService'], function() {

  // - the lower bound must be lower than the lower end of the observed range
  // - the upper bound should be higher than the upper end of the observed range
  // - the values should be "nice" (have no more than two significant digits, preferably only one)

  // - the lower bound must be greater than or equal to the theoretical lower bound
  // - the upper bound must be smaller than or equal to the theoretical upper bound


  describe('The scaleRange service', function() {

    beforeEach(module('elicit.scaleRangeService'));

    describe('calculateScales', function() {
      it('on unbounded scales, bounds should lie outside the observed range', inject(function(ScaleRangeService) {
        var criterionScale = [null, null];
        var from = -16.123;
        var to = -12.123;
        var criterionRange = [from, to];

        var result = ScaleRangeService.calculateScales(criterionScale, from, to, criterionRange);
        expect(result.from).toEqual(-20);
        expect(result.to).toEqual(-10);
      }));
    });

    describe('niceFrom', function() {
      it('should', inject(function(ScaleRangeService) {
        expect(ScaleRangeService.niceFrom(150)).toEqual(100);
        expect(ScaleRangeService.niceFrom(15)).toEqual(10);
        expect(ScaleRangeService.niceFrom(1.5)).toEqual(1);
        expect(ScaleRangeService.niceFrom(0.15)).toEqual(0.1);
        expect(ScaleRangeService.niceFrom(0.015)).toEqual(0.01);

        expect(ScaleRangeService.niceFrom(-150)).toEqual(-200);
        expect(ScaleRangeService.niceFrom(-15)).toEqual(-20);
        expect(ScaleRangeService.niceFrom(-1.5)).toEqual(-2);
        expect(ScaleRangeService.niceFrom(-0.15)).toEqual(-0.2);
        expect(ScaleRangeService.niceFrom(-0.015)).toEqual(-0.02);

        expect(ScaleRangeService.niceFrom(0)).toEqual(0);

      }));
    });
    describe('niceTo', function() {
      it('should', inject(function(ScaleRangeService) {
        expect(ScaleRangeService.niceTo(150)).toEqual(200);
        expect(ScaleRangeService.niceTo(15)).toEqual(20);
        expect(ScaleRangeService.niceTo(1.5)).toEqual(2);
        expect(ScaleRangeService.niceTo(0.15)).toEqual(0.2);
        expect(ScaleRangeService.niceTo(0.015)).toEqual(0.02);

        expect(ScaleRangeService.niceTo(-150)).toEqual(-100);
        expect(ScaleRangeService.niceTo(-15)).toEqual(-10);
        expect(ScaleRangeService.niceTo(-1.5)).toEqual(-1);
        expect(ScaleRangeService.niceTo(-0.15)).toEqual(-0.1);
        expect(ScaleRangeService.niceTo(-0.015)).toEqual(-0.01);

        expect(ScaleRangeService.niceTo(0)).toEqual(0);
      }));
    });
  });
});