import IPreferencesCriterion from '@shared/interface/Preferences/IPreferencesCriterion';
import IPvf from '@shared/interface/Problem/IPvf';
import IExactSwingRatio from '@shared/interface/Scenario/IExactSwingRatio';
import {
  buildInitialPrecisePreferences,
  getSwingStatement
} from './PreciseSwingElicitationUtil';

const criteria: Record<string, IPreferencesCriterion> = {
  critId1: {
    id: 'critId1',
    title: 'title1',
    unitOfMeasurement: {
      type: 'custom',
      label: 'kg'
    },
    dataSourceId: 'ds1',
    description: 'description'
  },
  critId2: {
    id: 'critId2',
    title: 'title2',
    unitOfMeasurement: {
      type: 'custom',
      label: 'kg'
    },
    dataSourceId: 'ds2',
    description: 'description'
  },
  critId3: {
    id: 'critId3',
    title: 'title3',
    unitOfMeasurement: {
      type: 'percentage',
      label: '%'
    },
    dataSourceId: 'ds3',
    description: 'description'
  }
};

describe('getSwingStatement', () => {
  it('should return a complete matching statement', () => {
    const showPercentages = false;
    const pvf: IPvf = {direction: 'increasing', range: [0, 1]};
    const result: string = getSwingStatement(
      criteria['critId1'],
      pvf,
      showPercentages
    );
    const expectedResult =
      "You've indicated that improving title1 from 0 kg to 1 kg is the most important (i.e. it has 100% importance). Now indicate the relative importance (in %) to this improvement of each other criterion's improvement using the sliders below.";
    expect(result).toEqual(expectedResult);
  });

  it('should return a complete matching statement as percentages', () => {
    const showPercentages = true;
    const pvf: IPvf = {direction: 'increasing', range: [0, 1]};
    const result: string = getSwingStatement(
      criteria['critId3'],
      pvf,
      showPercentages
    );
    const expectedResult =
      "You've indicated that improving title3 from 0 % to 100 % is the most important (i.e. it has 100% importance). Now indicate the relative importance (in %) to this improvement of each other criterion's improvement using the sliders below.";
    expect(result).toEqual(expectedResult);
  });

  it('should return a complete matching statement as decimals', () => {
    const showPercentages = false;
    const pvf: IPvf = {direction: 'increasing', range: [0, 1]};
    const result: string = getSwingStatement(
      criteria['critId3'],
      pvf,
      showPercentages
    );
    const expectedResult =
      "You've indicated that improving title3 from 0  to 1  is the most important (i.e. it has 100% importance). Now indicate the relative importance (in %) to this improvement of each other criterion's improvement using the sliders below.";
    expect(result).toEqual(expectedResult);
  });
});

describe('buildInitialPrecisePreferences', () => {
  it('should set criteria ratios to 1 except for the most important criterion', () => {
    const result: Record<
      string,
      IExactSwingRatio
    > = buildInitialPrecisePreferences(criteria, 'critId1');
    const expectedResult: Record<string, IExactSwingRatio> = {
      critId2: {
        criteria: ['critId1', 'critId2'],
        elicitationMethod: 'precise',
        type: 'exact swing',
        ratio: 1
      },
      critId3: {
        criteria: ['critId1', 'critId3'],
        elicitationMethod: 'precise',
        type: 'exact swing',
        ratio: 1
      }
    };
    expect(result).toEqual(expectedResult);
  });
});
