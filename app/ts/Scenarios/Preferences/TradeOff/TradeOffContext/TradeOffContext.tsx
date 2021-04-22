import ICriterion from '@shared/interface/ICriterion';
import {CurrentScenarioContext} from 'app/ts/Scenarios/CurrentScenarioContext/CurrentScenarioContext';
import {CurrentSubproblemContext} from 'app/ts/Workspace/SubproblemsContext/CurrentSubproblemContext/CurrentSubproblemContext';
import {hasNoRange} from 'app/ts/Workspace/SubproblemsContext/CurrentSubproblemContext/SubproblemUtil';
import _ from 'lodash';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
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
  const {filteredCriteria, observedRanges} = useContext(
    CurrentSubproblemContext
  );
  const {currentSubproblem} = useContext(CurrentSubproblemContext);
  const {currentScenario, pvfs, areAllPvfsSet} = useContext(
    CurrentScenarioContext
  );

  const [referenceCriterion, setReferenceCriterion] = useState<ICriterion>(
    filteredCriteria[0]
  );
  const [otherCriteria, setCriteria] = useState<ICriterion[]>(
    filteredCriteria.slice(1)
  );

  const [configuredLowerBound, configuredUpperBound] = useMemo(() => {
    return getBounds(
      referenceCriterion.dataSources[0].id,
      currentSubproblem.definition.ranges,
      observedRanges
    );
  }, [
    currentSubproblem.definition.ranges,
    observedRanges,
    referenceCriterion.dataSources
  ]);
  const [lowerBound, setLowerBound] = useState<number>(configuredLowerBound);
  const [upperBound, setUpperBound] = useState<number>(configuredUpperBound);
  const [referenceValueFrom, setReferenceValueFrom] = useState<number>();
  const [referenceValueTo, setReferenceValueTo] = useState<number>();
  const referenceWeight =
    currentScenario.state.weights.mean[referenceCriterion.id];
  const [partOfInterval, setPartOfInterval] = useState<number>();

  useEffect(reset, [
    referenceCriterion,
    pvfs,
    areAllPvfsSet,
    currentSubproblem.definition.ranges,
    observedRanges
  ]);

  useEffect(() => {
    setPartOfInterval(
      getPartOfInterval(
        referenceValueFrom,
        referenceValueTo,
        configuredLowerBound,
        configuredUpperBound
      )
    );
  }, [
    configuredLowerBound,
    configuredUpperBound,
    referenceValueFrom,
    referenceValueTo
  ]);

  function reset(): void {
    if (areAllPvfsSet) {
      const [configuredLowerBound, configuredUpperBound] = getBounds(
        referenceCriterion.dataSources[0].id,
        currentSubproblem.definition.ranges,
        observedRanges
      );
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

function getBounds(
  dataSourceId: string,
  configuredRanges: Record<string, [number, number]>,
  observedRanges: Record<string, [number, number]>
): [number, number] {
  if (hasNoRange(configuredRanges, dataSourceId)) {
    return observedRanges[dataSourceId];
  } else {
    return configuredRanges[dataSourceId];
  }
}
