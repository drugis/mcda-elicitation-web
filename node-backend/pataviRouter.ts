import {Router} from 'express';
import PataviHandler from './pataviHandler';
import IDB from './interface/IDB';

export default function PataviRouter(db: IDB) {
  const {postTask, getWeights} = PataviHandler(db);
  return Router().post('/weights', getWeights).post('/', postTask);
}
