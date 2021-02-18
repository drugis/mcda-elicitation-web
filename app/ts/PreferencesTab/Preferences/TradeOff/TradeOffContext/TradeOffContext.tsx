import ICriterion from '@shared/interface/ICriterion';
import {PreferencesContext} from 'app/ts/PreferencesTab/PreferencesContext';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import {hasNoRange} from 'app/ts/Workspace/SubproblemContext/SubproblemUtil';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import _ from 'lodash';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {
  getInitialReferenceValueFrom,
  getInitialReferenceValueTo,
  getPartOfInterval
} from '../tradeOffUtil';
import ITradeOffContext from './ITradeOffContext';

export const TradeOffContext = createContext<ITradeOffContext>(
  {} as ITradeOffContext
);

export function TradeOffContextProviderComponent({
  children
}: {
  children: any;
}): JSX.Element {
  const {filteredCriteria, observedRanges} = useContext(SubproblemContext);
  const {currentSubproblem} = useContext(WorkspaceContext);
  const {currentScenario, pvfs} = useContext(PreferencesContext);

  const [referenceCriterion, setReferenceCriterion] = useState<ICriterion>(
    filteredCriteria[0]
  );
  const [otherCriteria, setCriteria] = useState<ICriterion[]>(
    filteredCriteria.slice(1)
  );

  const [configuredLowerBound, configuredUpperBound] = getBounds();
  const [lowerBound, setLowerBound] = useState<number>(configuredLowerBound);
  const [upperBound, setUpperBound] = useState<number>(configuredUpperBound);
  const [referenceValueFrom, setReferenceValueFrom] = useState<number>();
  const [referenceValueTo, setReferenceValueTo] = useState<number>();
  const referenceWeight =
    currentScenario.state.weights.mean[referenceCriterion.id];
  const [partOfInterval, setPartOfInterval] = useState<number>();

  useEffect(reset, [referenceCriterion, pvfs]);

  useEffect(() => {
    setPartOfInterval(
      getPartOfInterval(
        referenceValueFrom,
        referenceValueTo,
        configuredLowerBound,
        configuredUpperBound
      )
    );
  }, [referenceValueFrom, referenceValueTo]);

  function reset(): void {
    if (pvfs) {
      const [configuredLowerBound, configuredUpperBound] = getBounds();
      setLowerBound(configuredLowerBound);
      setUpperBound(configuredUpperBound);
      setReferenceValueFrom(
        getInitialReferenceValueFrom(
          configuredLowerBound,
          configuredUpperBound,
          pvfs[referenceCriterion.id]
        )
      );
      setReferenceValueTo(
        getInitialReferenceValueTo(
          configuredLowerBound,
          configuredUpperBound,
          pvfs[referenceCriterion.id]
        )
      );
    }
  }

  function getBounds(): [number, number] {
    const dataSourceId = referenceCriterion.dataSources[0].id;
    if (hasNoRange(currentSubproblem.definition.ranges, dataSourceId)) {
      return observedRanges[dataSourceId];
    } else {
      return currentSubproblem.definition.ranges[dataSourceId];
    }
  }

  function updateReferenceCriterion(newId: string): void {
    setReferenceCriterion(_.find(filteredCriteria, ['id', newId]));
    setCriteria(_.reject(filteredCriteria, ['id', newId]));
  }

  return (
    <TradeOffContext.Provider
      value={{
        otherCriteria,
        lowerBound,
        partOfInterval,
        referenceCriterion,
        upperBound,
        referenceValueFrom,
        referenceValueTo,
        referenceWeight,
        setReferenceValueFrom,
        setReferenceValueTo,
        updateReferenceCriterion
      }}
    >
      {children}
    </TradeOffContext.Provider>
  );
}
