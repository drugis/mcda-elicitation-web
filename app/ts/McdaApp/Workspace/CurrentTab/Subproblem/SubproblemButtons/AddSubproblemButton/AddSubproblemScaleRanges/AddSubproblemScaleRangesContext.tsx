import {createContext} from 'react';
import IAddSubproblemScaleRangesContext from './IAddSubproblemScaleRangesContext';

export const AddSubproblemScaleRangesContext =
  createContext<IAddSubproblemScaleRangesContext>(
    {} as IAddSubproblemScaleRangesContext
  );

export function AddSubproblemScaleRangesContextProviderComponent(props: {
  children: any;
}) {
  return (
    <AddSubproblemScaleRangesContext.Provider value={{}}>
      {props.children}
    </AddSubproblemScaleRangesContext.Provider>
  );
}
