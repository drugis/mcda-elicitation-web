import React, {createContext} from 'react';
import IAddSubproblemSliderContext from './IAddSubproblemSliderContext';

export const AddSubproblemSliderContext = createContext<IAddSubproblemSliderContext>(
  {} as IAddSubproblemSliderContext
);

// FIXME: Actually do something
export function AddSubproblemSliderContextProviderComponent(props: {
  children: any;
}) {
  return (
    <AddSubproblemSliderContext.Provider value={{}}>
      {props.children}
    </AddSubproblemSliderContext.Provider>
  );
}
