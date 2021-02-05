import {Router} from 'express';
import IDB from './interface/IDB';
import PataviHandler from './pataviHandler';

export default function PataviRouter(db: IDB) {
  const {postTask, getWeights, getPataviResults} = PataviHandler(db);
  return Router()
    .post('/weights', getWeights)
    .post('/smaaResults', getPataviResults)
    .post('/deterministicResults', getPataviResults)
    .post('/recalculateDeterministicResults', getPataviResults)
    .post('/measurementsSensitivity', getPataviResults)
    .post('/preferencesSensitivity', getPataviResults)
    .post('/', postTask);
}
