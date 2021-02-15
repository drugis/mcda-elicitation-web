import {Router} from 'express';
import IDB from './interface/IDB';
import PataviHandler from './pataviHandler';

export default function PataviRouter(db: IDB) {
  const {postTask, getWeights, getPataviResults} = PataviHandler(db);
  return Router()
    .post('/deterministicResults', getPataviResults)
    .post('/measurementsSensitivity', getPataviResults)
    .post('/preferencesSensitivity', getPataviResults)
    .post('/recalculateDeterministicResults', getPataviResults)
    .post('/scales', getPataviResults)
    .post('/smaaResults', getPataviResults)
    .post('/weights', getWeights)
    .post('/', postTask);
}
