export default interface IChoiceBasedMatchingQuestion {
  A: {criterion1Value: number; criterion2Value: number};
  B: {criterion1Value: number; criterion2Value: number};
  criterionIds: [string, string];
}
