import IEffectsTableContext from '@shared/interface/IEffectsTableContext';
import {UnitOfMeasurementType} from '@shared/interface/IUnitOfMeasurement';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import _ from 'lodash';
import React, {createContext, useContext} from 'react';

export const EffectsTableContext = createContext<IEffectsTableContext>(
  {} as IEffectsTableContext
);

export function EffectsTableContextProviderComponent({
  children
}: {
  children: any;
}) {
  const criteria = useContext(WorkspaceContext);
  const {decimal, percentage} = UnitOfMeasurementType;

  function canBePercentage(dataSourceId: string): boolean {
    const unitType = _(criteria)
      .flatMap('dataSources')
      .find(['id', dataSourceId]).unitOfMeasurement.type;
    return unitType === decimal || unitType === percentage;
  }

  return (
    <EffectsTableContext.Provider
      value={{
        canBePercentage
      }}
    >
      {children}
    </EffectsTableContext.Provider>
  );
}
