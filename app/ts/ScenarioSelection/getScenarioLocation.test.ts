import getScenarioLocation from './getScenarioLocation';

describe('getScenarioLocation', () => {
  it('shoud return a url for the provided scenario id while preserving the tab', () => {
    const location = new URL(
      'https://mcda-test.drugis.org/#!/workspaces/1/problems/1/scenarios/1/preferences'
    );
    Object.defineProperty(window, 'location', {
      value: location
    });

    const result = getScenarioLocation('2');
    const expectedResult =
      'https://mcda-test.drugis.org/#!/workspaces/1/problems/1/scenarios/2/preferences';
    expect(result).toEqual(expectedResult);
  });
});
