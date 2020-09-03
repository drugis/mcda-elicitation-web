import significantDigits from '../ManualInput/Util/significantDigits';
import IElicitationCriterion from './Interface/IElicitationCriterion';
// import IChoiceBasedMatchingState from '../Interface/IChoiceBasedMatchingState';
// import ICriterion from '../Interface/ICriterion';
// import IFinishedSurvey from '../Interface/IFinishedSurvey';
// import IPVF from '../Interface/IPVF';
// import IRow from '../Interface/IRow';
// import ISurveyPreciseSwingAnswer from '../Interface/ISurveyPreciseSwingAnswer';
// import ISurveyRankingAnswer from '../Interface/ISurveyRankingAnswer';
// import significantDigits from '../util/significantDigits';

// type Answer = ISurveyRankingAnswer | ISurveyPreciseSwingAnswer;

// export function buildFinishedRankingSurvey(
//   criteria: Map<string, ICriterion>,
//   name: string
// ): IFinishedSurvey {
//   return {
//     ...buildFinishedSurvey(criteria, name, rankAnswerBuilder),
//     type: 'ranking'
//   };
// }

// function rankAnswerBuilder(criterion: ICriterion): ISurveyRankingAnswer {
//   return {
//     rowId: criterion.mcdaId,
//     databaseId: criterion.databaseId,
//     rank: criterion.rank!
//   };
// }

// function buildFinishedSurvey(
//   criteria: Map<string, ICriterion>,
//   name: string,
//   answerBuilder: (crit: ICriterion) => Answer
// ): Omit<IFinishedSurvey, 'type'> {
//   const criteriaAsArray = [...criteria.values()];
//   return {
//     name: name,
//     partialValueFunctions: _.map(criteriaAsArray, buildPvf),
//     answers: _.map(criteriaAsArray, answerBuilder)
//   };
// }

// function buildPvf(criterion: ICriterion): IPVF {
//   return {
//     type: 'linear',
//     direction: criterion.pvfDirection!,
//     rowMCDAId: criterion.mcdaId,
//     rowDatabaseId: criterion.databaseId
//   };
// }

// export function buildFinishedPreciseSwing(
//   mostImportantCriterionId: string,
//   criteria: Map<string, ICriterion>,
//   name: string
// ): IFinishedSurvey {
//   return {
//     ...buildFinishedSurvey(criteria, name, preciseSwingAnswerBuilder),
//     type: 'precise',
//     mostImportantCriterionId: mostImportantCriterionId
//   };
// }

// function preciseSwingAnswerBuilder(criterion: ICriterion) {
//   return {
//     rowId: criterion.mcdaId,
//     databaseId: criterion.databaseId,
//     importance: criterion.importance!
//   };
// }

export function getWorst(criterion: IElicitationCriterion): number {
  if (criterion.scales) {
    return significantDigits(
      criterion.pvfDirection === 'increasing'
        ? Math.min(...criterion.scales)
        : Math.max(...criterion.scales)
    );
  } else {
    return -1;
  }
}

export function getBest(criterion: IElicitationCriterion): number {
  if (criterion.scales) {
    return significantDigits(
      criterion.pvfDirection === 'increasing'
        ? Math.max(...criterion.scales)
        : Math.min(...criterion.scales)
    );
  } else {
    return -1;
  }
}

// export function buildFinishedChoiceBasedMatchingSurvey(
//   cbmState: IChoiceBasedMatchingState,
//   effectsTableRows: IRow[],
//   name: string
// ): IFinishedSurvey {
//   return {
//     type: 'choice',
//     answers: cbmState.preferences!,
//     name: name,
//     partialValueFunctions: _.map(effectsTableRows, buildPvf)
//   };
// }
