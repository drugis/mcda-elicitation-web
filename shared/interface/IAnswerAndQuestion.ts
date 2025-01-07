import IChoiceBasedMatchingQuestion from './IChoiceBasedMatchingQuestion';

export default interface IAnswerAndQuestion {
  question: IChoiceBasedMatchingQuestion;
  answer?: 'A' | 'B';
}
