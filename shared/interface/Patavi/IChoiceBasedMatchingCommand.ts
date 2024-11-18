import IChoiceBasedMatchingState from '../IChoiceBasedMatchingState';

export default interface IChoiceBasedMatchingCommand
  extends IChoiceBasedMatchingState {
  method: 'choiceBasedMatching';
}
