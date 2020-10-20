import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {checkSubproblemTitleErrors} from '../../SubproblemUtil';
import IAddSubproblemContext from './IAddSubproblemContext';

export const AddSubproblemContext = createContext<IAddSubproblemContext>(
  {} as IAddSubproblemContext
);

export function AddSubproblemContextProviderComponent(props: {children: any}) {
  const {currentSubproblem, subproblems} = useContext(WorkspaceContext);
  const [title, setTitle] = useState<string>('');
  const [errors, setErrors] = useState<string[]>(
    checkSubproblemTitleErrors(title, subproblems, currentSubproblem.id)
  );

  useEffect(() => {
    setErrors(
      checkSubproblemTitleErrors(title, subproblems, currentSubproblem.id)
    );
  }, [title]);

  useEffect(() => {
    // take selections from currentSubproblem
  }, []);

  return (
    <AddSubproblemContext.Provider value={{errors}}>
      {props.children}
    </AddSubproblemContext.Provider>
  );
}
