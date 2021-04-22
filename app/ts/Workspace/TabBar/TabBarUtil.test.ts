import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import {Distribution} from '@shared/interface/IDistribution';
import {Effect} from '@shared/interface/IEffect';
import IRelativePerformance from '@shared/interface/IRelativePerformance';
import IWorkspace from '@shared/interface/IWorkspace';
import IPvf from '@shared/interface/Problem/IPvf';
import {
  findCriterionWithTooManyDataSources,
  findMissingPvfs,
  findMissingValue
} from './TabBarUtil';

describe('TabBarUtil', () => {
  describe('findMissingValue', () => {
    const baseWorkspace = {
      criteria: [{id: 'crit1Id', dataSources: [{id: 'ds1Id'}]} as ICriterion],
      alternatives: [{id: 'alt1Id'} as IAlternative]
    };

    it('should return true if there is a non-value effect and no distribution or relative performance', () => {
      const textEffect: Effect[] = [
        {alternativeId: 'alt1Id', dataSourceId: 'ds1Id', type: 'text'} as Effect
      ];
      expect(
        findMissingValue({...baseWorkspace, effects: textEffect} as IWorkspace)
      ).toBeTruthy();

      const emptyEffect: Effect[] = [
        {
          alternativeId: 'alt1Id',
          dataSourceId: 'ds1Id',
          type: 'empty'
        } as Effect
      ];
      expect(
        findMissingValue({...baseWorkspace, effects: emptyEffect} as IWorkspace)
      ).toBeTruthy();
    });

    it('should return false if there is a non-value effect and no distribution but a relative performance', () => {
      const relativePerformances: IRelativePerformance[] = [
        {dataSourceId: 'ds1Id'} as IRelativePerformance
      ];

      const textEffect: Effect[] = [
        {alternativeId: 'alt1Id', dataSourceId: 'ds1Id', type: 'text'} as Effect
      ];
      expect(
        findMissingValue({
          ...baseWorkspace,
          effects: textEffect,
          relativePerformances: relativePerformances
        } as IWorkspace)
      ).toBeFalsy();

      const emptyEffect: Effect[] = [
        {
          alternativeId: 'alt1Id',
          dataSourceId: 'ds1Id',
          type: 'empty'
        } as Effect
      ];
      expect(
        findMissingValue({
          ...baseWorkspace,
          effects: emptyEffect,
          relativePerformances: relativePerformances
        } as IWorkspace)
      ).toBeFalsy();
    });

    it('should return false if there is a non-value effect and no relative performance but a distribution', () => {
      const distributions: Distribution[] = [
        {alternativeId: 'alt1Id', dataSourceId: 'ds1Id'} as Distribution
      ];

      const textEffect: Effect[] = [
        {alternativeId: 'alt1Id', dataSourceId: 'ds1Id', type: 'text'} as Effect
      ];
      expect(
        findMissingValue({
          ...baseWorkspace,
          effects: textEffect,
          distributions: distributions
        } as IWorkspace)
      ).toBeFalsy();

      const emptyEffect: Effect[] = [
        {
          alternativeId: 'alt1Id',
          dataSourceId: 'ds1Id',
          type: 'empty'
        } as Effect
      ];
      expect(
        findMissingValue({
          ...baseWorkspace,
          effects: emptyEffect,
          distributions: distributions
        } as IWorkspace)
      ).toBeFalsy();
    });

    it('should return true if there is a non-value distribution and no effect or relative performance', () => {
      const textDistribution: Distribution[] = [
        {
          alternativeId: 'alt1Id',
          dataSourceId: 'ds1Id',
          type: 'text'
        } as Distribution
      ];
      expect(
        findMissingValue({
          ...baseWorkspace,
          distributions: textDistribution
        } as IWorkspace)
      ).toBeTruthy();

      const emptyDistribution: Distribution[] = [
        {
          alternativeId: 'alt1Id',
          dataSourceId: 'ds1Id',
          type: 'empty'
        } as Distribution
      ];
      expect(
        findMissingValue({
          ...baseWorkspace,
          distributions: emptyDistribution
        } as IWorkspace)
      ).toBeTruthy();
    });

    it('should return false if there is a non-value distributions and no effect but a relative performance', () => {
      const relativePerformances: IRelativePerformance[] = [
        {dataSourceId: 'ds1Id'} as IRelativePerformance
      ];

      const textDistribution: Distribution[] = [
        {
          alternativeId: 'alt1Id',
          dataSourceId: 'ds1Id',
          type: 'text'
        } as Distribution
      ];
      expect(
        findMissingValue({
          ...baseWorkspace,
          distributions: textDistribution,
          relativePerformances: relativePerformances
        } as IWorkspace)
      ).toBeFalsy();

      const emptyDistribution: Distribution[] = [
        {
          alternativeId: 'alt1Id',
          dataSourceId: 'ds1Id',
          type: 'empty'
        } as Distribution
      ];
      expect(
        findMissingValue({
          ...baseWorkspace,
          distributions: emptyDistribution,
          relativePerformances: relativePerformances
        } as IWorkspace)
      ).toBeFalsy();
    });

    it('should return false if there is a non-value distribution and no relative performance but an effect', () => {
      const effects: Effect[] = [
        {alternativeId: 'alt1Id', dataSourceId: 'ds1Id'} as Effect
      ];

      const textDistribution: Distribution[] = [
        {
          alternativeId: 'alt1Id',
          dataSourceId: 'ds1Id',
          type: 'text'
        } as Distribution
      ];
      expect(
        findMissingValue({
          ...baseWorkspace,
          effects: effects,
          distributions: textDistribution
        } as IWorkspace)
      ).toBeFalsy();

      const emptyDistribution: Distribution[] = [
        {
          alternativeId: 'alt1Id',
          dataSourceId: 'ds1Id',
          type: 'empty'
        } as Distribution
      ];
      expect(
        findMissingValue({
          ...baseWorkspace,
          effects: effects,
          distributions: emptyDistribution
        } as IWorkspace)
      ).toBeFalsy();
    });

    it('should return true if both effect and ditribution have no value and there is no relative perofmrance', () => {
      const textDistribution: Distribution[] = [
        {
          alternativeId: 'alt1Id',
          dataSourceId: 'ds1Id',
          type: 'text'
        } as Distribution
      ];
      const emptyEffect: Effect[] = [
        {
          alternativeId: 'alt1Id',
          dataSourceId: 'ds1Id',
          type: 'empty'
        } as Effect
      ];
      expect(
        findMissingValue({
          ...baseWorkspace,
          effects: emptyEffect,
          distributions: textDistribution
        } as IWorkspace)
      ).toBeTruthy();
    });

    it('should return false if both effect and ditribution have no value but there is a relative perofmrance', () => {
      const relativePerformances: IRelativePerformance[] = [
        {dataSourceId: 'ds1Id'} as IRelativePerformance
      ];

      const textDistribution: Distribution[] = [
        {
          alternativeId: 'alt1Id',
          dataSourceId: 'ds1Id',
          type: 'text'
        } as Distribution
      ];
      const emptyEffect: Effect[] = [
        {
          alternativeId: 'alt1Id',
          dataSourceId: 'ds1Id',
          type: 'empty'
        } as Effect
      ];
      expect(
        findMissingValue({
          ...baseWorkspace,
          effects: emptyEffect,
          distributions: textDistribution,
          relativePerformances: relativePerformances
        } as IWorkspace)
      ).toBeFalsy();
    });
  });

  describe('findMissingPvfs', () => {
    const criteria: ICriterion[] = [
      {id: 'crit1Id'} as ICriterion,
      {id: 'crit2Id'} as ICriterion
    ];

    it('should return false if all criteria have a pvf set', () => {
      const pvfs: Record<string, IPvf> = {
        crit1Id: {} as IPvf,
        crit2Id: {} as IPvf
      };
      expect(findMissingPvfs(pvfs, criteria)).toBeFalsy();
    });

    it('should return true if any criteria is missing a pvf', () => {
      const pvfs: Record<string, IPvf> = {
        crit1Id: {} as IPvf
      };
      expect(findMissingPvfs(pvfs, criteria)).toBeTruthy();
    });

    it('should return true if pvfs are empty', () => {
      expect(findMissingPvfs({}, criteria)).toBeTruthy();
    });
  });

  describe('findCriterionWithTooManyDataSources', () => {
    it('should return false if all criteria have only one data source', () => {
      const criteria: ICriterion[] = [
        {dataSources: [{id: 'ds1Id'}]} as ICriterion,
        {dataSources: [{id: 'ds2Id'}]} as ICriterion
      ];
      expect(findCriterionWithTooManyDataSources(criteria)).toBeFalsy();
    });

    it('should return true if any criterion has more than one data source', () => {
      const criteria: ICriterion[] = [
        {dataSources: [{id: 'ds1Id'}]} as ICriterion,
        {dataSources: [{id: 'ds2Id'}, {id: 'ds3Id'}]} as ICriterion
      ];
      expect(findCriterionWithTooManyDataSources(criteria)).toBeTruthy();
    });
  });
});
