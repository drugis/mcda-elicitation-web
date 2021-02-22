import {TPvfDirection} from '@shared/types/PvfTypes';
import {PreferencesContext} from 'app/ts/PreferencesTab/PreferencesContext';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import React, {createContext, useContext, useState} from 'react';
import {IAdvancedPartialValueFunctionContext} from './IAdvancedPartialValueFunctionContext';

export const AdvancedPartialValueFunctionContext = createContext<IAdvancedPartialValueFunctionContext>(
  {} as IAdvancedPartialValueFunctionContext
);

export function AdvancedPartialValueFunctionContextProviderComponent({
  children
}: {
  children: any;
}) {
  const {getCriterion, configuredRanges} = useContext(SubproblemContext);
  const {advancedPvfCriterionId} = useContext(PreferencesContext);
  const advancedPvfCriterion = getCriterion(advancedPvfCriterionId);
  const configuredRange =
    configuredRanges[advancedPvfCriterion.dataSources[0].id];

  const [direction, setDirection] = useState<TPvfDirection>('increasing');
  const [values, setValues] = useState<[number, number, number]>([
    0.25,
    0.5,
    0.75
  ]);
  const [cutOffs, setCutOffs] = useState<[number, number, number]>([
    configuredRange[0] + (configuredRange[1] - configuredRange[0]) * 0.25,
    configuredRange[0] + (configuredRange[1] - configuredRange[0]) * 0.5,
    configuredRange[0] + (configuredRange[1] - configuredRange[0]) * 0.75
  ]);

  return (
    <AdvancedPartialValueFunctionContext.Provider
      value={{
        advancedPvfCriterion,
        cutOffs,
        direction,
        values,
        setCutOffs,
        setDirection,
        setValues
      }}
    >
      {children}
    </AdvancedPartialValueFunctionContext.Provider>
  );
}
