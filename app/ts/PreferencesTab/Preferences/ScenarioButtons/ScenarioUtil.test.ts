import {checkScenarioTitleErrors} from './ScenarioUtil';
import IScenario from '@shared/interface/Scenario/IScenario';

describe('ScenarioUtil', () => {
  describe('checkScenarioTitleErrors', () => {
    it('should check if the title is empty', () => {
      const result = checkScenarioTitleErrors('', {});
      const expectedResult = ['Empty title'];
      expect(result).toEqual(expectedResult);
    });

    it('should check if the title is a duplicate', () => {
      const scenarios: Record<string, IScenario> = {
        scenarioId1: {title: 'scenario1', id: 'scenarioId1'} as IScenario,
        scenarioId2: {title: 'scenario2', id: 'scenarioId2'} as IScenario
      };
      const result = checkScenarioTitleErrors('scenario1', scenarios);
      const expectedResult = ['Duplicate title'];
      expect(result).toEqual(expectedResult);
    });

    it('should not return an error if the duplicate title is for the same scenario', () => {
      const scenarios: Record<string, IScenario> = {
        scenarioId1: {title: 'scenario1', id: 'scenarioId1'} as IScenario,
        scenarioId2: {title: 'scenario2', id: 'scenarioId2'} as IScenario
      };
      const result = checkScenarioTitleErrors(
        'scenario1',
        scenarios,
        'scenarioId1'
      );
      expect(result).toEqual([]);
    });
  });
});
