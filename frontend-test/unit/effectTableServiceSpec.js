'use strict';
define(['angular-mocks',
  'mcda/evidence/evidence'
], function() {
  describe('EffectsTableService', function() {
    var effectTableService;

    beforeEach(module('elicit.evidence'));

    beforeEach(inject(function(EffectsTableService) {
      effectTableService = EffectsTableService;
    }));

    describe('EffectsTableService', function() {
      describe('buildEffectsTable', function() {
        it('should return the order of the criterion in the effectstable including the favorability headers if needed', function() {
          var problem = {
            valueTree: {
              children: [{
                criteria: ['crit3','crit2']
              }, {
                criteria: ['crit1']
              }]
            }
          };
          var criteria = [{
            id: 'crit1'
          }, {
            id: 'crit2'
          }, {
            id: 'crit3'
          }];
          var result = effectTableService.buildEffectsTable(problem, criteria);
          var expectedResult = [{
              isHeaderRow: true,
              headerText: 'Favorable effects'
            },
            'crit2',
            'crit3',
             {
              isHeaderRow: true,
              headerText: 'Unfavorable effects'
            },
            'crit1'
          ];
          expect(result).toEqual(expectedResult);
        });
      });
    });

  });
});