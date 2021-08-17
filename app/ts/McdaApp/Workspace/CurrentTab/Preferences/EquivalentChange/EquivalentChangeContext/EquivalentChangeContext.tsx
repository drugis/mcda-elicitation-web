import ICriterion from '@shared/interface/ICriterion';
import {CurrentScenarioContext} from 'app/ts/McdaApp/Workspace/CurrentScenarioContext/CurrentScenarioContext';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {hasNoRange} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/SubproblemUtil';
import {TEquivalentChange as TEquivalentChange} from 'app/ts/type/EquivalentChange';
import _ from 'lodash';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import {
  getInitialReferenceValueBy,
  getInitialReferenceValueFrom,
  getInitialReferenceValueTo,
  getPartOfInterval
} from '../equivalentChangeUtil';
import IEquivalentChangeContext from './IEquivalentChangeContext';

export const EquivalentChangeContext = createContext<IEquivalentChangeContext>(
  {} as IEquivalentChangeContext
);

export function EquivalentChangeContextProviderComponent({
  children
}: {
  children: any;
}): JSX.Element {
  const {filteredCriteria, observedRanges} = useContext(
    CurrentSubproblemContext
  );
  const {currentSubproblem} = useContext(CurrentSubproblemContext);
  const {currentScenario, pvfs, areAllPvfsSet, updateScenario} = useContext(
    CurrentScenarioContext
  );

  const [referenceCriterion, setReferenceCriterion] = useState<ICriterion>(
    _.find(
      filteredCriteria,
      ['id', currentScenario.state.equivalentChange?.referenceCriterionId] ||
        filteredCriteria[0]
    )
  );
  const [otherCriteria, setCriteria] = useState<ICriterion[]>(
    filteredCriteria.slice(1)
  );

  const [configuredLowerBound, configuredUpperBound] = useMemo(() => {
    return (
      getBounds(
        referenceCriterion.dataSources[0].id,
        currentSubproblem.definition.ranges,
        observedRanges
      ) || [undefined, undefined]
    );
  }, [
    currentSubproblem.definition.ranges,
    observedRanges,
    referenceCriterion.dataSources
  ]);
  const [lowerBound, setLowerBound] = useState<number>(configuredLowerBound);
  const [upperBound, setUpperBound] = useState<number>(configuredUpperBound);
  const [referenceValueBy, setReferenceValueBy] = useState<number>(
    currentScenario.state.equivalentChange?.referenceValueBy
      ? currentScenario.state.equivalentChange.referenceValueBy
      : getInitialReferenceValueBy(configuredLowerBound, configuredUpperBound)
  );
  const [referenceValueFrom, setReferenceValueFrom] = useState<number>();
  const [referenceValueTo, setReferenceValueTo] = useState<number>();
  const referenceWeight =
    currentScenario.state.weights?.mean[referenceCriterion.id];

  const [partOfInterval, setPartOfInterval] = useState<number>(
    getPartOfInterval(
      0,
      referenceValueBy,
      configuredLowerBound,
      configuredUpperBound
    )
  );
  const [equivalentChangeType, setEquivalentChangeType] =
    useState<TEquivalentChange>('amount');

  const canShowEquivalentChanges = useMemo(
    () =>
      pvfs &&
      areAllPvfsSet &&
      currentScenario.state?.weights &&
      _.every(pvfs, ['type', 'linear']) &&
      !_.isEmpty(observedRanges),
    [areAllPvfsSet, currentScenario.state?.weights, observedRanges, pvfs]
  );

  const updateReferenceCriterion = useCallback(
    (newId: string): void => {
      if (canShowEquivalentChanges) {
        const newReferenceCriterion = _.find(filteredCriteria, ['id', newId]);
        const [lowerBound, upperBound] = getBounds(
          newReferenceCriterion.dataSources[0].id,
          currentSubproblem.definition.ranges,
          observedRanges
        );
        const newReferenceValueBy = getInitialReferenceValueBy(
          lowerBound,
          upperBound
        );
        const newReferencevalueFrom = getInitialReferenceValueFrom(
          lowerBound,
          upperBound,
          pvfs[newReferenceCriterion.id]
        );
        const newReferenceValueTo = getInitialReferenceValueTo(
          lowerBound,
          upperBound,
          pvfs[newReferenceCriterion.id]
        );

        updateScenario({
          ...currentScenario,
          state: {
            ...currentScenario.state,
            equivalentChange: {
              referenceCriterionId: newId,
              referenceValueBy: newReferenceValueBy,
              referenceValueTo: newReferenceValueTo,
              referenceValueFrom: newReferencevalueFrom
            }
          }
        }).then(() => {
          setReferenceCriterion(newReferenceCriterion);
          setCriteria(_.reject(filteredCriteria, ['id', newId]));
          setLowerBound(lowerBound);
          setUpperBound(upperBound);
          setReferenceValueBy(newReferenceValueBy);
          setReferenceValueFrom(newReferencevalueFrom);
          setReferenceValueTo(newReferenceValueTo);
        });
      }
    },
    [
      canShowEquivalentChanges,
      currentScenario,
      currentSubproblem.definition.ranges,
      filteredCriteria,
      observedRanges,
      pvfs,
      updateScenario
    ]
  );

  function reset(): void {
    updateReferenceCriterion(filteredCriteria[0].id);
  }

  useEffect(reset, [filteredCriteria, updateReferenceCriterion]);

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

  useEffect(() => {
    setPartOfInterval(
      getPartOfInterval(
        0,
        referenceValueBy,
        configuredLowerBound,
        configuredUpperBound
      )
    );
  }, [configuredLowerBound, configuredUpperBound, referenceValueBy]);

  function updateReferenceValueBy(newValue: number) {
    updateScenario({
      ...currentScenario,
      state: {
        ...currentScenario.state,
        equivalentChange: {
          ...currentScenario.state.equivalentChange,
          referenceValueBy: newValue
        }
      }
    }).then(() => {
      setReferenceValueBy(newValue);
    });
  }

  function updateReferenceValueFrom(newValue: number) {
    updateScenario({
      ...currentScenario,
      state: {
        ...currentScenario.state,
        equivalentChange: {
          ...currentScenario.state.equivalentChange,
          referenceValueFrom: newValue
        }
      }
    }).then(() => {
      setReferenceValueFrom(newValue);
    });
  }

  function updateReferenceValueTo(newValue: number) {
    updateScenario({
      ...currentScenario,
      state: {
        ...currentScenario.state,
        equivalentChange: {
          ...currentScenario.state.equivalentChange,
          referenceValueTo: newValue
        }
      }
    }).then(() => {
      setReferenceValueTo(newValue);
    });
  }

  return (
    <EquivalentChangeContext.Provider
      value={{
        canShowEquivalentChanges,
        equivalentChangeType,
        lowerBound,
        otherCriteria,
        partOfInterval,
        referenceCriterion,
        referenceValueBy,
        referenceValueFrom,
        referenceValueTo,
        referenceWeight,
        upperBound,
        resetEquivalentChange: reset,
        setEquivalentChangeType,
        updateReferenceValueFrom,
        updateReferenceValueBy,
        updateReferenceValueTo,
        updateReferenceCriterion
      }}
    >
      {children}
    </EquivalentChangeContext.Provider>
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
