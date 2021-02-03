import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import {IDeterministicResults} from '@shared/interface/Patavi/IDeterministicResults';
import {IDeterministicResultsCommand} from '@shared/interface/Patavi/IDeterministicResultsCommand';
import {IMeasurementsSensitivityCommand} from '@shared/interface/Patavi/IMeasurementsSensitivityCommand';
import {IMeasurementsSensitivityResults} from '@shared/interface/Patavi/IMeasurementsSensitivityResults';
import {IPataviProblem} from '@shared/interface/Patavi/IPataviProblem';
import {IRecalculatedCell} from '@shared/interface/Patavi/IRecalculatedCell';
import {IRecalculatedDeterministicResultsCommand} from '@shared/interface/Patavi/IRecalculatedDeterministicResultsCommand';
import IWeights from '@shared/interface/Scenario/IWeights';
import {ErrorContext} from 'app/ts/Error/ErrorContext';
import ISensitivityValue from 'app/ts/interface/ISensitivityValue';
import {PreferencesContext} from 'app/ts/PreferencesTab/PreferencesContext';
import {getPataviProblem} from 'app/ts/util/PataviUtil';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import axios, {AxiosResponse} from 'axios';
import _ from 'lodash';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {getInitialSensitivityValues} from '../DeterministicResultsUtil';
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
  const [
    measurementSensitivityCriterion,
    setMeasurementSensitivityCriterion
  ] = useState<ICriterion>(filteredCriteria[0]);
  const [
    measurementSensitivityAlternative,
    setMeasurementSensitivityAlternative
  ] = useState<IAlternative>(filteredAlternatives[0]);
  const [
    measurementsSensitivityResults,
    setMeasurementsSensitivityResults
  ] = useState<Record<string, Record<number, number>>>();

  useEffect(() => {
    if (!_.isEmpty(pvfs)) {
      const pataviProblem = getPataviProblem(
        problem,
        filteredCriteria,
        filteredAlternatives,
        pvfs
      );
      getDeterministicResults(pataviProblem);
      getMeasurementsSensitivityResults(pataviProblem);
    }
  }, [pvfs]);

  useEffect(() => {
    if (!_.isEmpty(pvfs)) {
      const pataviProblem = getPataviProblem(
        problem,
        filteredCriteria,
        filteredAlternatives,
        pvfs
      );
      getMeasurementsSensitivityResults(pataviProblem);
    }
  }, [measurementSensitivityCriterion, measurementSensitivityAlternative]);

  function getDeterministicResults(pataviProblem: IPataviProblem): void {
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

  function getMeasurementsSensitivityResults(
    pataviProblem: IPataviProblem
  ): void {
    const measurementsSensitivityCommand: IMeasurementsSensitivityCommand = {
      ...pataviProblem,
      preferences: currentScenario.state.prefs,
      method: 'sensitivityMeasurementsPlot',
      sensitivityAnalysis: {
        alternative: measurementSensitivityAlternative.id,
        criterion: measurementSensitivityCriterion.id
      }
    };

    axios
      .post('/patavi/measurementsSensitivity', measurementsSensitivityCommand)
      .then((result: AxiosResponse<IMeasurementsSensitivityResults>) => {
        setMeasurementsSensitivityResults(result.data.total);
      })
      .catch(setError);
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
        measurementSensitivityCriterion,
        measurementSensitivityAlternative,
        measurementsSensitivityResults,
        recalculateValuePlots,
        resetSensitivityTable,
        setCurrentValue,
        setMeasurementSensitivityCriterion,
        setMeasurementSensitivityAlternative
      }}
    >
      {children}
    </DeterministicResultsContext.Provider>
  );
}
