import _ from 'lodash';
import React, {createContext, useState} from 'react';
import ICriterion from '../interface/ICriterion';
import IManualInputContext from '../interface/IManualInputContext';

export const ManualInputContext = createContext<IManualInputContext>(
  {} as IManualInputContext
);

export function ManualInputContextProviderComponent(props: {children: any}) {
  const [title, setTitle] = useState<string>('');
  const [therapeuticContext, setTherapeuticContext] = useState<string>('');
  const [useFavourability, setUseFavourability] = useState<boolean>(false);
  const [criteria, setCriteria] = useState<ICriterion[]>([]);

  function addCriterion(criterion: ICriterion) {
    let criteriaCopy = _.cloneDeep(criteria);
    criteriaCopy.push(criterion);
    setCriteria(criteriaCopy);
  }

  return (
    <ManualInputContext.Provider
      value={{
        title: title,
        therapeuticContext: therapeuticContext,
        useFavourability: useFavourability,
        criteria: criteria,
        setTitle: setTitle,
        setTherapeuticContext: setTherapeuticContext,
        setUseFavourability: setUseFavourability,
        addCriterion: addCriterion
      }}
    >
      {props.children}
    </ManualInputContext.Provider>
  );
}
