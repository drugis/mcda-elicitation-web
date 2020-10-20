import IMcdaScenario from '@shared/interface/Scenario/IMcdaScenario';
import {checkTitleErrors} from './checkTitleErrors';

describe('checkTitleErrors', () => {
  it('should check if the title is empty', () => {
    const result = checkTitleErrors('', {});
    const expectedResult = 'Empty title';
    expect(result).toEqual(expectedResult);
  });

  it('should check if the title is a duplicate', () => {
    const scenarios: Record<string, IMcdaScenario> = {
      scenarioId1: {title: 'scenario1', id: 'scenarioId1'} as IMcdaScenario,
      scenarioId2: {title: 'scenario2', id: 'scenarioId2'} as IMcdaScenario
    };
    const result = checkTitleErrors('scenario1', scenarios);
    const expectedResult = 'Duplicate title';
    expect(result).toEqual(expectedResult);
  });

  it('should not return an error if the duplicate title is for the same scenario', () => {
    const scenarios: Record<string, IMcdaScenario> = {
      scenarioId1: {title: 'scenario1', id: 'scenarioId1'} as IMcdaScenario,
      scenarioId2: {title: 'scenario2', id: 'scenarioId2'} as IMcdaScenario
    };
    const result = checkTitleErrors('scenario1', scenarios, 'scenarioId1');
    expect(result).toEqual('');
  });
});
