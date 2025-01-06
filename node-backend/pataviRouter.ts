import {Router} from 'express';
import {getChoiceBasedMatchingState} from './choiceBasedMatchingHandler';
import IDB from './interface/IDB';
import PataviHandler from './pataviHandler';

export default function PataviRouter(db: IDB) {
  const {getWeights, getPataviResults} = PataviHandler(db);
  return Router()
    .post('/choice-based-matching-state', getChoiceBasedMatchingState)
    .post('/deterministicResults', getPataviResults)
    .post('/measurementsSensitivity', getPataviResults)
    .post('/preferencesSensitivity', getPataviResults)
    .post('/recalculateDeterministicResults', getPataviResults)
    .post('/scales', getPataviResults)
    .post('/smaaResults', getPataviResults)
    .post('/weights', getWeights);
}
