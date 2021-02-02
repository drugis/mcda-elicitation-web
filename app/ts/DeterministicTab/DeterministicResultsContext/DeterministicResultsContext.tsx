import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import {Effect} from '@shared/interface/IEffect';
import IScale from '@shared/interface/IScale';
import {IDeterministicResults} from '@shared/interface/Patavi/IDeterministicResults';
import {IDeterministicResultsCommand} from '@shared/interface/Patavi/IDeterministicResultsCommand';
import {IRecalculatedCell} from '@shared/interface/Patavi/IRecalculatedCell';
import {IRecalculatedDeterministicResultsCommand} from '@shared/interface/Patavi/IRecalculatedDeterministicResultsCommand';
import IWeights from '@shared/interface/Scenario/IWeights';
import {findScale, findValue} from 'app/ts/EffectsTable/EffectsTableUtil';
import {ErrorContext} from 'app/ts/Error/ErrorContext';
import ISensitivityValue from 'app/ts/interface/ISensitivityValue';
import significantDigits from 'app/ts/ManualInput/Util/significantDigits';
import {PreferencesContext} from 'app/ts/PreferencesTab/PreferencesContext';
import {getPataviProblem} from 'app/ts/util/PataviUtil';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import axios, {AxiosResponse} from 'axios';
import _ from 'lodash';
import React, {createContext, useContext, useEffect, useState} from 'react';
import IDeterministicResultsContext from './IDeterministicResultsContext';

export const DeterministicResultsContext = createContext<IDeterministicResultsContext>(
  {} as IDeterministicResultsContext
);

export function DeterministicResultsContextProviderComponent({
  children
}: {
  children: any;
}): JSX.Element {
  const {setError} = useContext(ErrorContext);
  const {scales} = useContext(WorkspaceContext);
  const {filteredCriteria, filteredAlternatives, filteredEffects} = useContext(
    SubproblemContext
  );
  const {pvfs, problem, currentScenario} = useContext(PreferencesContext);

  const [sensitivityTableValues, setSensitivityTableValues] = useState<
    Record<string, Record<string, ISensitivityValue>>
  >(
    getInitialSensitivityValues(
      filteredCriteria,
      filteredAlternatives,
      filteredEffects,
      scales
    )
  );
  const [recalculatedCells, setRecalculatedCells] = useState<
    IRecalculatedCell[]
  >([]);
  const [weights, setWeights] = useState<IWeights>();
  const [baseTotalValues, setBaseTotalValues] = useState<
    Record<string, number>
  >();
  const [baseValueProfiles, setBaseValueProfiles] = useState<
    Record<string, Record<string, number>>
  >();
  const [recalculatedTotalValues, setRecalculatedTotalValues] = useState<
    Record<string, number>
  >();
  const [recalculatedValueProfiles, setRecalculatedValueProfiles] = useState<
    Record<string, Record<string, number>>
  >();

  useEffect(() => {
    if (!_.isEmpty(pvfs)) {
      calculateResults();
    }
  }, [pvfs]);

  function calculateResults(): void {
    const pataviProblem = getPataviProblem(
      problem,
      filteredCriteria,
      filteredAlternatives,
      pvfs
    );

    const deterministicResultsCommand: IDeterministicResultsCommand = {
      ...pataviProblem,
      preferences: currentScenario.state.prefs,
      method: 'deterministic'
    };

    axios
      .post('/patavi/deterministicResults', deterministicResultsCommand)
      .then((result: AxiosResponse<IDeterministicResults>) => {
        setWeights(result.data.weights);
        setBaseTotalValues(result.data.total);
        setBaseValueProfiles(result.data.value);
      })
      .catch(setError);
  }

  function getInitialSensitivityValues(
    criteria: ICriterion[],
    alternatives: IAlternative[],
    effects: Effect[],
    scales: Record<string, Record<string, IScale>>
  ): Record<string, Record<string, ISensitivityValue>> {
    return _.mapValues(_.keyBy(criteria, 'id'), (criterion) => {
      return _.mapValues(_.keyBy(alternatives, 'id'), (alternative) => {
        const effect = findValue(
          effects,
          criterion.dataSources[0].id,
          alternative.id
        );
        const scale = findScale(
          scales,
          criterion.dataSources[0].id,
          alternative.id
        );
        const value = getValue(effect, scale);
        return {originalValue: value, currentValue: value};
      });
    });
  }

  function getValue(effect: Effect, scale: IScale): number {
    if (effect) {
      switch (effect.type) {
        case 'value':
          return effect.value;
        case 'valueCI':
          return effect.value;
        case 'range':
          return significantDigits((effect.lowerBound + effect.upperBound) / 2);
        default:
          return scale['50%'];
      }
    } else {
      return scale['50%'];
    }
  }

  function setCurrentValue(
    criterionId: string,
    alternativeId: string,
    newValue: number
  ): void {
    const originalValue =
      sensitivityTableValues[criterionId][alternativeId].originalValue;
    const newValues = {
      ...sensitivityTableValues,
      [criterionId]: {
        ...sensitivityTableValues[criterionId],
        [alternativeId]: {
          originalValue: originalValue,
          currentValue: newValue
        }
      }
    };
    setSensitivityTableValues(newValues);
    const filteredRecalculatedCells = _.reject(
      recalculatedCells,
      (cell: IRecalculatedCell) =>
        cell.criterion === criterionId && cell.alternative === alternativeId
    );
    setRecalculatedCells(
      filteredRecalculatedCells.concat({
        alternative: alternativeId,
        criterion: criterionId,
        value: newValue
      })
    );
  }

  function resetSensitivityTable(): void {
    setSensitivityTableValues(
      getInitialSensitivityValues(
        filteredCriteria,
        filteredAlternatives,
        filteredEffects,
        scales
      )
    );
    setRecalculatedCells([]);
    setRecalculatedTotalValues(undefined);
    setRecalculatedValueProfiles(undefined);
  }

  function recalculateValuePlots(): void {
    const pataviProblem = getPataviProblem(
      problem,
      filteredCriteria,
      filteredAlternatives,
      pvfs
    );

    const deterministicResultsCommand: IRecalculatedDeterministicResultsCommand = {
      ...pataviProblem,
      preferences: currentScenario.state.prefs,
      method: 'sensitivityMeasurements',
      sensitivityAnalysis: {
        meas: recalculatedCells
      }
    };

    axios
      .post(
        '/patavi/recalculateDeterministicResults',
        deterministicResultsCommand
      )
      .then((result: AxiosResponse<IDeterministicResults>) => {
        setRecalculatedTotalValues(result.data.total);
        setRecalculatedValueProfiles(result.data.value);
      })
      .catch(setError);
  }

  return (
    <DeterministicResultsContext.Provider
      value={{
        weights,
        baseTotalValues,
        baseValueProfiles,
        recalculatedTotalValues,
        recalculatedValueProfiles,
        sensitivityTableValues,
        recalculateValuePlots,
        resetSensitivityTable,
        setCurrentValue
      }}
    >
      {children}
    </DeterministicResultsContext.Provider>
  );
}
