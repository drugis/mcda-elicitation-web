import {TPvfDirection} from '@shared/types/TPvfDirection';
import {PreferencesContext} from 'app/ts/PreferencesTab/PreferencesContext';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
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
  const {getCriterion, getConfiguredRange} = useContext(SubproblemContext);
  const {advancedPvfCriterionId} = useContext(PreferencesContext);
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
