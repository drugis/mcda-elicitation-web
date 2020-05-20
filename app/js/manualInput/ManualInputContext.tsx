import React, { createContext, useState } from 'react';
import IManualInputContext from '../interface/IManualInputContext';

export const ManualInputContext = createContext<IManualInputContext>({} as IManualInputContext);

export function ManualInputContextProviderComponent(props: {children: any}) {
  

  return (
    <ManualInputContext.Provider
      value={{
     
      }}
    >
      {props.children}
    </ManualInputContext.Provider>
  );
}
