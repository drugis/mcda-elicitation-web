import IChoiceBasedMatchingState from '@shared/interface/IChoiceBasedMatchingState';
import {Request, Response} from 'express';
import logger from './logger';
import {postAndHandleResults} from './patavi';

export function getChoiceBasedMatchingState(
  request: Request,
  response: Response
) {
  const oldCBMstate: IChoiceBasedMatchingState = request.body;

  postAndHandleResults(
    {
      ...oldCBMstate,
      method: 'choiceBasedMatching'
    },
    (error, result) => {
      if (error) {
        errorHandler(response, 500, error.message);
      } else {
        response.json(result);
      }
    }
  );
}

function errorHandler(response: Response, status: number, message: string) {
  logger.error(message);
  response.status(status);
  response.send(message);
}
