import ICriterion from '@shared/interface/ICriterion';
import {CurrentScenarioContext} from 'app/ts/McdaApp/Workspace/CurrentScenarioContext/CurrentScenarioContext';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {hasNoRange} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/SubproblemUtil';
import {TEquivalentChange as TEquivalentChange} from 'app/ts/type/EquivalentChange';
import _ from 'lodash';
import React, {
  createContext,
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

  const [referenceCriterion, setReferenceCriterion] = useState<ICriterion>();
  const [otherCriteria, setOtherCriteria] = useState<ICriterion[]>();

  const [lowerBound, setLowerBound] = useState<number>();
  const [upperBound, setUpperBound] = useState<number>();
  const [referenceValueBy, setReferenceValueBy] = useState<number>();
  const [referenceValueFrom, setReferenceValueFrom] = useState<number>();
  const [referenceValueTo, setReferenceValueTo] = useState<number>();
  const referenceWeight =
    currentScenario.state.weights?.mean[referenceCriterion?.id] || null;

  const [partOfInterval, setPartOfInterval] = useState<number>();
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

  useEffect(() => {
    if (canShowEquivalentChanges) {
      const newReferenceCriterion =
        _.find(filteredCriteria, [
          'id',
          currentScenario.state.equivalentChange?.referenceCriterionId
        ]) || filteredCriteria[0];
      const newOtherCriteria = _.reject(filteredCriteria, [
        'id',
        newReferenceCriterion.id
      ]);
      const [initialLowerBound, initialUpperBound] = getBounds(
        newReferenceCriterion.dataSources[0].id,
        currentSubproblem.definition.ranges,
        observedRanges
      );
      const newReferenceValueBy = currentScenario.state.equivalentChange
        ?.referenceValueBy
        ? currentScenario.state.equivalentChange.referenceValueBy
        : getInitialReferenceValueBy(initialLowerBound, initialUpperBound);
      const newReferencevalueFrom = currentScenario.state.equivalentChange
        ?.referenceValueFrom
        ? currentScenario.state.equivalentChange.referenceValueFrom
        : getInitialReferenceValueFrom(
            initialLowerBound,
            initialUpperBound,
            pvfs[newReferenceCriterion.id]
          );
      const newReferenceValueTo = currentScenario.state.equivalentChange
        ?.referenceValueTo
        ? currentScenario.state.equivalentChange.referenceValueTo
        : getInitialReferenceValueTo(
            initialLowerBound,
            initialUpperBound,
            pvfs[newReferenceCriterion.id]
          );
      const newPartOfInterval = getPartOfInterval(
        0,
        newReferenceValueBy,
        initialLowerBound,
        initialUpperBound
      );
      setReferenceCriterion(newReferenceCriterion);
      setOtherCriteria(newOtherCriteria);
      setLowerBound(initialLowerBound);
      setUpperBound(initialUpperBound);
      setReferenceValueBy(newReferenceValueBy);
      setReferenceValueFrom(newReferencevalueFrom);
      setReferenceValueTo(newReferenceValueTo);
      setPartOfInterval(newPartOfInterval);
    }
    // currentScenario is not in here because I don't want it to trigger this
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    canShowEquivalentChanges,
    currentSubproblem.definition.ranges,
    filteredCriteria,
    observedRanges,
    pvfs
  ]);

  function updateReferenceCriterion(newId: string): void {
    if (canShowEquivalentChanges) {
      const newReferenceCriterion = _.find(filteredCriteria, ['id', newId]);
      const [newLowerBound, newUpperBound] = getBounds(
        newReferenceCriterion.dataSources[0].id,
        currentSubproblem.definition.ranges,
        observedRanges
      );
      const newReferenceValueBy = getInitialReferenceValueBy(
        newLowerBound,
        newUpperBound
      );
      const newReferencevalueFrom = getInitialReferenceValueFrom(
        newLowerBound,
        newUpperBound,
        pvfs[newReferenceCriterion.id]
      );
      const newReferenceValueTo = getInitialReferenceValueTo(
        newLowerBound,
        newUpperBound,
        pvfs[newReferenceCriterion.id]
      );
      const newPartOfInterval =
        equivalentChangeType === 'amount'
          ? getPartOfInterval(
              0,
              newReferenceValueBy,
              newLowerBound,
              newUpperBound
            )
          : getPartOfInterval(
              newReferencevalueFrom,
              newReferenceValueTo,
              newLowerBound,
              newUpperBound
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
        setOtherCriteria(_.reject(filteredCriteria, ['id', newId]));
        setLowerBound(newLowerBound);
        setUpperBound(newUpperBound);
        setReferenceValueBy(newReferenceValueBy);
        setReferenceValueFrom(newReferencevalueFrom);
        setReferenceValueTo(newReferenceValueTo);
        setPartOfInterval(newPartOfInterval);
      });
    }
  }

  function reset(): void {
    updateReferenceCriterion(filteredCriteria[0].id);
  }

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
      setPartOfInterval(getPartOfInterval(0, newValue, lowerBound, upperBound));
    });
  }

  function updateReferenceValueRange(newFrom: number, newTo: number) {
    updateScenario({
      ...currentScenario,
      state: {
        ...currentScenario.state,
        equivalentChange: {
          ...currentScenario.state.equivalentChange,
          referenceValueFrom: newFrom,
          referenceValueTo: newTo
        }
      }
    }).then(() => {
      setReferenceValueFrom(newFrom);
      setReferenceValueTo(newTo);
      setPartOfInterval(
        getPartOfInterval(newFrom, newTo, lowerBound, upperBound)
      );
    });
  }

  function updateEquivalentChangeType(newType: TEquivalentChange) {
    setEquivalentChangeType(newType);
    const newPartOfInterval =
      newType === 'amount'
        ? getPartOfInterval(0, referenceValueBy, lowerBound, upperBound)
        : getPartOfInterval(
            referenceValueFrom,
            referenceValueTo,
            lowerBound,
            upperBound
          );
    setPartOfInterval(newPartOfInterval);
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
        updateEquivalentChangeType,
        updateReferenceValueBy,
        updateReferenceValueRange,
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
