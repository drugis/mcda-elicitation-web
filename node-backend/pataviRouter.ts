import {Router} from 'express';
import IDB from './interface/IDB';
import PataviHandler from './pataviHandler';

export default function PataviRouter(db: IDB) {
  const {
    postTask,
    getWeights,
    getSmaaResults,
    getDeterministicResults,
    getRecalculatedDeterministicResults,
    getMeasurementsSensitivity
  } = PataviHandler(db);
  return Router()
    .post('/weights', getWeights)
    .post('/smaaResults', getSmaaResults)
    .post('/deterministicResults', getDeterministicResults)
    .post(
      '/recalculateDeterministicResults',
      getRecalculatedDeterministicResults
    )
    .post('/measurementsSensitivity', getMeasurementsSensitivity)
    .post('/', postTask);
}
