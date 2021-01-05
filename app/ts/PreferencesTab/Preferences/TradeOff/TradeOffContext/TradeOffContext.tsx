import ICriterion from '@shared/interface/ICriterion';
import {PreferencesContext} from 'app/ts/PreferencesTab/PreferencesContext';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import _ from 'lodash';
import React, {createContext, useContext, useEffect, useState} from 'react';
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
  const {currentSubproblem} = useContext(WorkspaceContext);
  const {currentScenario} = useContext(PreferencesContext);

  const [referenceCriterion, setReferenceCriterion] = useState<ICriterion>(
    filteredCriteria[0]
  );
  const [criteria, setCriteria] = useState<ICriterion[]>(
    filteredCriteria.slice(1, filteredCriteria.length)
  );

  const [
    configuredLowerBound,
    configuredUpperBound
  ] = currentSubproblem.definition.ranges[referenceCriterion.dataSources[0].id];

  const [lowerBound, setLowerBound] = useState<number>(configuredLowerBound);
  const [upperBound, setUpperBound] = useState<number>(configuredUpperBound);
  const [value1, setValue1] = useState<number>(
    (configuredUpperBound - configuredLowerBound) * 0.45 + configuredLowerBound
  );
  const [value2, setValue2] = useState<number>(
    (configuredUpperBound - configuredLowerBound) * 0.55 + configuredLowerBound
  );
  const weight = currentScenario.state.weights.mean[referenceCriterion.id];
  const [partOfInterval, setPartOfInterval] = useState<number>(
    (value2 - value1) / ((configuredUpperBound - configuredLowerBound) * weight)
  );

  useEffect(() => {
    const [
      configuredLowerBound,
      configuredUpperBound
    ] = currentSubproblem.definition.ranges[
      referenceCriterion.dataSources[0].id
    ];
    setLowerBound(configuredLowerBound);
    setUpperBound(configuredUpperBound);
    setValue1(
      (configuredUpperBound - configuredLowerBound) * 0.45 +
        configuredLowerBound
    );
    setValue2(
      (configuredUpperBound - configuredLowerBound) * 0.55 +
        configuredLowerBound
    );
  }, [referenceCriterion]);

  useEffect(() => {
    const weight = currentScenario.state.weights.mean[referenceCriterion.id];
    setPartOfInterval(
      (value2 - value1) /
        ((configuredUpperBound - configuredLowerBound) * weight)
    );
  }, [value1, value2]);

  function updateReferenceCriterion(newId: string): void {
    setReferenceCriterion(_.find(filteredCriteria, ['id', newId]));
    setCriteria(_.reject(filteredCriteria, ['id', newId]));
  }

  return (
    <TradeOffContext.Provider
      value={{
        criteria,
        lowerBound,
        partOfInterval,
        referenceCriterion,
        upperBound,
        value1,
        value2,
        setValue1,
        setValue2,
        updateReferenceCriterion
      }}
    >
      {children}
    </TradeOffContext.Provider>
  );
}
