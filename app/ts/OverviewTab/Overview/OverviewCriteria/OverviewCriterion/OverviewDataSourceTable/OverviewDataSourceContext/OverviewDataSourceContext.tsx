import IDataSource from '@shared/interface/IDataSource';
import React, {createContext} from 'react';
import IOverviewDataSourceContext from './IOverviewDataSourceContext';

export const OverviewDataSourceContext = createContext<IOverviewDataSourceContext>(
  {} as IOverviewDataSourceContext
);

export function OverviewDataSourceContextProviderComponent({
  children,
  dataSource,
  nextDataSourceId,
  previousDataSourceId,
  index
}: {
  children: any;
  dataSource: IDataSource;
  nextDataSourceId: string;
  previousDataSourceId: string;
  index: number;
}) {
  return (
    <OverviewDataSourceContext.Provider
      value={{
        dataSource,
        nextDataSourceId,
        previousDataSourceId,
        index
      }}
    >
      {children}
    </OverviewDataSourceContext.Provider>
  );
}
