import IAlternative from '@shared/interface/IAlternative';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import React, {createContext, useContext} from 'react';
import IRelativeValueProfileContext from './IRelativeValueProfileContext';

export const RelativeValueProfileContext =
  createContext<IRelativeValueProfileContext>(
    {} as IRelativeValueProfileContext
  );

export function RelativeValueProfileContextProviderComponent({
  children
}: {
  children: any;
}): JSX.Element {
  const {filteredAlternatives} = useContext(CurrentSubproblemContext);

  const [relativeValues, setRelativeValues] = React.useState(undefined);
  const [reference, setReference] = React.useState<IAlternative>(
    filteredAlternatives[0]
  );
  const [comparator, setComparator] = React.useState<IAlternative>(
    filteredAlternatives[1]
  );

  return (
    <RelativeValueProfileContext.Provider
      value={{
        reference,
        comparator,
        setReference,
        setComparator
      }}
    >
      {children}
    </RelativeValueProfileContext.Provider>
  );
}
