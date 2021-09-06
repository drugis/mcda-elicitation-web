import {TPvfDirection} from '@shared/types/TPvfDirection';
import {CurrentScenarioContext} from 'app/ts/McdaApp/Workspace/CurrentScenarioContext/CurrentScenarioContext';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import _ from 'lodash';
import {createContext, useContext, useEffect, useState} from 'react';
import {getCutoffsByValue} from '../../PartialValueFunctionUtil';
import {IAdvancedPartialValueFunctionContext} from './IAdvancedPartialValueFunctionContext';

export const AdvancedPartialValueFunctionContext =
  createContext<IAdvancedPartialValueFunctionContext>(
    {} as IAdvancedPartialValueFunctionContext
  );

export function AdvancedPartialValueFunctionContextProviderComponent({
  children
}: {
  children: any;
}) {
  const {getCriterion, getConfiguredRange} = useContext(
    CurrentSubproblemContext
  );
  const {getUsePercentage} = useContext(SettingsContext);

  const {advancedPvfCriterionId} = useContext(CurrentScenarioContext);
  const advancedPvfCriterion = getCriterion(advancedPvfCriterionId);
  const usePercentage = getUsePercentage(advancedPvfCriterion.dataSources[0]);
  const configuredRange = getConfiguredRange(advancedPvfCriterion);
  const rangeWidth = configuredRange[1] - configuredRange[0];
  const [direction, setDirection] = useState<TPvfDirection>('increasing');
  const [cutoffs, setCutoffs] = useState<[number, number, number]>([
    configuredRange[0] + rangeWidth * 0.25,
    configuredRange[0] + rangeWidth * 0.5,
    configuredRange[0] + rangeWidth * 0.75
  ]);
  const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(false);
  const [cutoffsByValue, setCutoffsByValue] = useState<Record<number, number>>(
    getCutoffsByValue(configuredRange, cutoffs, usePercentage, direction)
  );

  useEffect(() => {
    if (_.uniq(cutoffs).length < 3) {
      setIsSaveDisabled(true);
    } else {
      setIsSaveDisabled(false);
    }
    setCutoffsByValue(
      getCutoffsByValue(configuredRange, cutoffs, usePercentage, direction)
    );
  }, [configuredRange, cutoffs, direction, usePercentage]);

  return (
    <AdvancedPartialValueFunctionContext.Provider
      value={{
        advancedPvfCriterion,
        configuredRange,
        cutoffs,
        cutoffsByValue,
        direction,
        isSaveDisabled,
        usePercentage,
        setCutoffs,
        setDirection
      }}
    >
      {children}
    </AdvancedPartialValueFunctionContext.Provider>
  );
}
