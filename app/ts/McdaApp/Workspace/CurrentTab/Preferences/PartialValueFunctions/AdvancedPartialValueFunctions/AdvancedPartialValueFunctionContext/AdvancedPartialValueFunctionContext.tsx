import {TPvfDirection} from '@shared/types/TPvfDirection';
import {CurrentScenarioContext} from 'app/ts/McdaApp/Workspace/CurrentScenarioContext/CurrentScenarioContext';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import _ from 'lodash';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {IAdvancedPartialValueFunctionContext} from './IAdvancedPartialValueFunctionContext';

export const AdvancedPartialValueFunctionContext = createContext<IAdvancedPartialValueFunctionContext>(
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
  const {advancedPvfCriterionId} = useContext(CurrentScenarioContext);
  const advancedPvfCriterion = getCriterion(advancedPvfCriterionId);
  const configuredRange = getConfiguredRange(advancedPvfCriterion);
  const [direction, setDirection] = useState<TPvfDirection>('increasing');
  const [cutOffs, setCutOffs] = useState<[number, number, number]>([
    configuredRange[0] + (configuredRange[1] - configuredRange[0]) * 0.25,
    configuredRange[0] + (configuredRange[1] - configuredRange[0]) * 0.5,
    configuredRange[0] + (configuredRange[1] - configuredRange[0]) * 0.75
  ]);
  const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(false);

  useEffect(() => {
    if (_.uniq(cutOffs).length < 3) {
      setIsSaveDisabled(true);
    } else {
      setIsSaveDisabled(false);
    }
  }, [cutOffs]);

  return (
    <AdvancedPartialValueFunctionContext.Provider
      value={{
        advancedPvfCriterion,
        cutOffs,
        direction,
        isSaveDisabled,
        setCutOffs,
        setDirection
      }}
    >
      {children}
    </AdvancedPartialValueFunctionContext.Provider>
  );
}
