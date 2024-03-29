import ICriterion from '@shared/interface/ICriterion';
import {CurrentScenarioContext} from 'app/ts/McdaApp/Workspace/CurrentScenarioContext/CurrentScenarioContext';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import ShowIf from 'app/ts/ShowIf/ShowIf';
import _ from 'lodash';
import {
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
  getEquivalentChangeByThreshold,
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
  const {currentSubproblem, getCriterion} = useContext(
    CurrentSubproblemContext
  );
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

  const canCalculateEquivalentChanges: boolean = useMemo(
    () =>
      areAllPvfsSet &&
      currentScenario.state?.weights &&
      _.every(pvfs, ['type', 'linear']) &&
      !_.isEmpty(observedRanges),
    [areAllPvfsSet, currentScenario.state?.weights, observedRanges, pvfs]
  );

  const canShowEquivalentChange: boolean = Boolean(equivalentChange);

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

  const getThresholdDefault = useCallback(() => {
    const dataSourceId = getCriterion(
      currentScenario.state.prefs[0].criteria[0]
    ).dataSources[0].id;
    const bounds = getBounds(
      dataSourceId,
      currentSubproblem.definition.ranges,
      observedRanges
    );
    return getEquivalentChangeByThreshold(currentScenario, bounds);
  }, [
    currentScenario,
    currentSubproblem.definition.ranges,
    getCriterion,
    observedRanges
  ]);

  const setDefaultEquivalentChange = useCallback(() => {
    if (currentScenario.state.prefs[0]?.elicitationMethod === 'threshold') {
      const thresholdEquivalentChange = getThresholdDefault();
      updateEquivalentChange(thresholdEquivalentChange);
    } else {
      const newReferenceCriterion = filteredCriteria[0];
      const defaultEquivalentChange = getEquivalentChange(
        newReferenceCriterion,
        [lowerBound, upperBound]
      );
      updateEquivalentChange(defaultEquivalentChange);
    }
  }, [
    currentScenario.state.prefs,
    filteredCriteria,
    getThresholdDefault,
    lowerBound,
    updateEquivalentChange,
    upperBound
  ]);

  const initialise = useCallback(() => {
    const initialOtherCriteria = _.reject(filteredCriteria, [
      'id',
      referenceCriterion.id
    ]);
    setOtherCriteria(initialOtherCriteria);
  }, [filteredCriteria, referenceCriterion]);

  useEffect(() => {
    if (canCalculateEquivalentChanges) {
      if (!Boolean(equivalentChange)) {
        setDefaultEquivalentChange();
      } else {
        initialise();
      }
    }
  }, [
    canCalculateEquivalentChanges,
    equivalentChange,
    initialise,
    setDefaultEquivalentChange
  ]);

  function updateReferenceCriterion(newId: string): void {
    if (canShowEquivalentChange) {
      const newReferenceCriterion = _.find(filteredCriteria, ['id', newId]);
      const newEquivalentChange = getEquivalentChange(
        newReferenceCriterion,
        getBounds(
          newReferenceCriterion.dataSources[0].id,
          currentSubproblem.definition.ranges,
          observedRanges
        )
      );

      updateEquivalentChange(newEquivalentChange);
    }
  }

  function reset(): void {
    setDefaultEquivalentChange();
  }

  function updateReferenceValueBy(newValue: number) {
    updateEquivalentChange({
      ...equivalentChange,
      by: newValue,
      partOfInterval: getPartOfInterval(newValue, [lowerBound, upperBound])
    });
  }

  return (
    <EquivalentChangeContext.Provider
      value={{
        canShowEquivalentChange,
        lowerBound,
        otherCriteria,
        referenceCriterion,
        referenceWeight,
        upperBound,
        resetEquivalentChange: reset,
        updateReferenceValueBy,
        updateReferenceCriterion
      }}
    >
      <ShowIf
        condition={
          !canCalculateEquivalentChanges ||
          (canCalculateEquivalentChanges && canShowEquivalentChange)
        }
      >
        {children}
      </ShowIf>
    </EquivalentChangeContext.Provider>
  );
}
