import ICriterion from '@shared/interface/ICriterion';
import React, {createContext} from 'react';
import IOverviewCriterionContext from './IOverviewCriterionContext';

export const OverviewCriterionContext = createContext<IOverviewCriterionContext>(
  {} as IOverviewCriterionContext
);

export function OverviewCriterionContextProviderComponent({
  children,
  criterion,
  nextCriterionId,
  previousCriterionId
}: {
  children: any;
  criterion: ICriterion;
  nextCriterionId: string;
  previousCriterionId: string;
}) {
  return (
    <OverviewCriterionContext.Provider
      value={{
        criterion,
        nextCriterionId,
        previousCriterionId,
        dataSources: criterion.dataSources
      }}
    >
      {children}
    </OverviewCriterionContext.Provider>
  );
}
