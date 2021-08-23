import ICriterion from '@shared/interface/ICriterion';
import {CurrentScenarioContext} from 'app/ts/McdaApp/Workspace/CurrentScenarioContext/CurrentScenarioContext';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
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
import {getBounds, getEquivalentChange} from '../equivalentChangeUtil';
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
  const {
    currentScenario,
    equivalentChange,
    pvfs,
    areAllPvfsSet,
    updateEquivalentChange
  } = useContext(CurrentScenarioContext);

  const [referenceCriterion, setReferenceCriterion] = useState<ICriterion>();
  const [otherCriteria, setOtherCriteria] = useState<ICriterion[]>();
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
  const [lowerBound, upperBound] = useMemo(() => {
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

  const setDefaultEquivalentChange = useCallback(() => {
    const newReferenceCriterion = filteredCriteria[0];
    const defaultEquivalentChange = getEquivalentChange(
      newReferenceCriterion,
      [lowerBound, upperBound],
      pvfs[newReferenceCriterion.id]
    );
    updateEquivalentChange(defaultEquivalentChange);
  }, [filteredCriteria, lowerBound, pvfs, updateEquivalentChange, upperBound]);

  const initialise = useCallback(() => {
    const {
      referenceCriterionId,
      by: initialBy,
      from: initialFrom,
      to: initialTo,
      partOfInterval: initialPartOfInterval
    } = equivalentChange;
    const initialReferenceCriterion = _.find(filteredCriteria, [
      'id',
      referenceCriterionId
    ]);
    const initialOtherCriteria = _.reject(filteredCriteria, [
      'id',
      referenceCriterionId
    ]);

    setReferenceCriterion(initialReferenceCriterion);
    setOtherCriteria(initialOtherCriteria);
    setReferenceValueBy(initialBy);
    setReferenceValueFrom(initialFrom);
    setReferenceValueTo(initialTo);
    setPartOfInterval(initialPartOfInterval);
  }, [equivalentChange, filteredCriteria]);

  useEffect(() => {
    if (canShowEquivalentChanges && !equivalentChange) {
      setDefaultEquivalentChange();
    } else {
      initialise();
    }
  }, [
    canShowEquivalentChanges,
    equivalentChange,
    initialise,
    setDefaultEquivalentChange
  ]);

  function updateReferenceCriterion(newId: string): void {
    if (canShowEquivalentChanges) {
      const newReferenceCriterion = _.find(filteredCriteria, ['id', newId]);
      const newEquivalentChange = getEquivalentChange(
        newReferenceCriterion,
        [lowerBound, upperBound],
        pvfs[newReferenceCriterion.id]
      );

      updateEquivalentChange(newEquivalentChange);
    }
  }

  function reset(): void {
    updateReferenceCriterion(filteredCriteria[0].id);
  }

  function updateReferenceValueBy(newValue: number) {
    updateEquivalentChange({
      ...equivalentChange,
      by: newValue
    });
  }

  function updateReferenceValueRange(newFrom: number, newTo: number) {
    updateEquivalentChange({
      ...equivalentChange,
      from: newFrom,
      to: newTo
    });
  }

  function updateEquivalentChangeType(newType: TEquivalentChange) {
    updateEquivalentChange({
      ...equivalentChange,
      type: newType
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
