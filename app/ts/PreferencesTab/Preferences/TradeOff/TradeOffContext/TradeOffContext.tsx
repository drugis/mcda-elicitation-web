import ICriterion from '@shared/interface/ICriterion';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import _ from 'lodash';
import React, {createContext, useContext, useState} from 'react';
import ITradeOffContext from './ITradeOffContext';

export const TradeOffContext = createContext<ITradeOffContext>(
  {} as ITradeOffContext
);

export function TradeOffContextProviderComponent({
  children
}: {
  children: any;
}): JSX.Element {
  const {filteredCriteria} = useContext(SubproblemContext);

  const [referenceCriterion, setReferenceCriterion] = useState<ICriterion>(
    filteredCriteria[0]
  );
  const [criteria, setCriteria] = useState<ICriterion[]>(
    filteredCriteria.slice(1, filteredCriteria.length)
  );

  function updateReferenceCriterion(newId: string): void {
    setReferenceCriterion(_.find(filteredCriteria, ['id', newId]));
    setCriteria(_.reject(filteredCriteria, ['id', newId]));
  }

  return (
    <TradeOffContext.Provider
      value={{
        referenceCriterion,
        criteria,
        updateReferenceCriterion
      }}
    >
      {children}
    </TradeOffContext.Provider>
  );
}
