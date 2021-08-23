import ICriterion from '@shared/interface/ICriterion';
import {CurrentScenarioContext} from 'app/ts/McdaApp/Workspace/CurrentScenarioContext/CurrentScenarioContext';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {TEquivalentChange as TEquivalentChange} from 'app/ts/type/equivalentChange';
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
  getBounds,
  getEquivalentChange,
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
  const {
    currentScenario,
    equivalentChange,
    pvfs,
    areAllPvfsSet,
    updateEquivalentChange
  } = useContext(CurrentScenarioContext);

  const [otherCriteria, setOtherCriteria] = useState<ICriterion[]>();
  const referenceWeight: number =
    currentScenario.state.weights?.mean[
      equivalentChange?.referenceCriterionId
    ] || null;
  const referenceCriterion: ICriterion =
    _.find(filteredCriteria, ['id', equivalentChange?.referenceCriterionId]) ||
    filteredCriteria[0];

  const canShowEquivalentChanges: boolean = useMemo(
    () =>
      areAllPvfsSet &&
      currentScenario.state?.weights &&
      _.every(pvfs, ['type', 'linear']) &&
      !_.isEmpty(observedRanges),
    [areAllPvfsSet, currentScenario.state?.weights, observedRanges, pvfs]
  );

  const [lowerBound, upperBound]: [number, number] = useMemo(() => {
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
    const initialOtherCriteria = _.reject(filteredCriteria, [
      'id',
      referenceCriterion.id
    ]);
    setOtherCriteria(initialOtherCriteria);
  }, [filteredCriteria, referenceCriterion]);

  useEffect(() => {
    if (canShowEquivalentChanges && !equivalentChange) {
      setDefaultEquivalentChange();
    } else if (canShowEquivalentChanges) {
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
      by: newValue,
      partOfInterval: getPartOfInterval({...equivalentChange, by: newValue}, [
        lowerBound,
        upperBound
      ])
    });
  }

  function updateReferenceValueRange(newFrom: number, newTo: number) {
    updateEquivalentChange({
      ...equivalentChange,
      from: newFrom,
      to: newTo,
      partOfInterval: getPartOfInterval(
        {...equivalentChange, from: newFrom, to: newTo},
        [lowerBound, upperBound]
      )
    });
  }

  function updateEquivalentChangeType(newType: TEquivalentChange) {
    updateEquivalentChange({
      ...equivalentChange,
      type: newType,
      partOfInterval: getPartOfInterval({...equivalentChange, type: newType}, [
        lowerBound,
        upperBound
      ])
    });
  }

  return (
    <EquivalentChangeContext.Provider
      value={{
        canShowEquivalentChanges,
        lowerBound,
        otherCriteria,
        referenceCriterion,
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
