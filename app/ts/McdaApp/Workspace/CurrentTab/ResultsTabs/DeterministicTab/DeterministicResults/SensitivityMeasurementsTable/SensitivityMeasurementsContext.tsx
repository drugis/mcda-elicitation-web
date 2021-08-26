import {IRecalculatedCell} from '@shared/interface/Patavi/IRecalculatedCell';
import IChangeableValue from 'app/ts/interface/IChangeableValue';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {WorkspaceContext} from 'app/ts/McdaApp/Workspace/WorkspaceContext/WorkspaceContext';
import _ from 'lodash';
import {createContext, useContext, useState} from 'react';
import {DeterministicResultsContext} from '../../DeterministicResultsContext/DeterministicResultsContext';
import {getInitialSensitivityValues} from '../../DeterministicResultsUtil';
import ISensitivityMeasurementsContext from './ISensitivityMeasurementsContext';

export const SensitivityMeasurementsContext =
  createContext<ISensitivityMeasurementsContext>(
    {} as ISensitivityMeasurementsContext
  );

export function SensitivityMeasurementsContextProviderComponent({
  children
}: {
  children: any;
}) {
  const {scales} = useContext(WorkspaceContext);
  const {filteredCriteria, filteredAlternatives, filteredEffects} = useContext(
    CurrentSubproblemContext
  );
  const {
    recalculatedCells,
    setRecalculatedCells,
    setRecalculatedTotalValues,
    setRecalculatedValueProfiles
  } = useContext(DeterministicResultsContext);

  const [sensitivityTableValues, setSensitivityTableValues] = useState<
    Record<string, Record<string, IChangeableValue>>
  >(
    getInitialSensitivityValues(
      filteredCriteria,
      filteredAlternatives,
      filteredEffects,
      scales
    )
  );

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

  return (
    <SensitivityMeasurementsContext.Provider
      value={{
        sensitivityTableValues,
        resetSensitivityTable,
        setCurrentValue
      }}
    >
      {children}
    </SensitivityMeasurementsContext.Provider>
  );
}
