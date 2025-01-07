import IAnswerAndQuestion from './IAnswerAndQuestion';
import IReducedCriterion from './IReducedCriterion';
import IUpperRatioConstraint from './Scenario/IUpperRatioConstraint';

export default interface IChoiceBasedMatchingState {
  preferences?: IUpperRatioConstraint[];
  answersAndQuestions: IAnswerAndQuestion[];
  criteria: IReducedCriterion[];
}
