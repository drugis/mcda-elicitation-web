import _ from 'lodash';
import React, {createContext, useState} from 'react';
import ICriterion from '../interface/ICriterion';
import IManualInputContext from '../interface/IManualInputContext';
import IAlternative from './ManualInput/Interfaces/IAlternative';

export const ManualInputContext = createContext<IManualInputContext>(
  {} as IManualInputContext
);

export function ManualInputContextProviderComponent(props: {children: any}) {
  const [title, setTitle] = useState<string>('');
  const [therapeuticContext, setTherapeuticContext] = useState<string>('');
  const [useFavourability, setUseFavourability] = useState<boolean>(false);
  const [criteria, setCriteria] = useState<ICriterion[]>([]);
  const [alternatives, setAlternatives] = useState<IAlternative[]>([]);

  function addCriterion(criterion: ICriterion) {
    let criteriaCopy = _.cloneDeep(criteria);
    criteriaCopy.push(criterion);
    setCriteria(criteriaCopy);
  }

  function addAlternative(alternative: IAlternative) {
    let alternativesCopy = _.cloneDeep(alternatives);
    alternativesCopy.push(alternative);
    setAlternatives(alternativesCopy);
  }

  return (
    <ManualInputContext.Provider
      value={{
        title: title,
        therapeuticContext: therapeuticContext,
        useFavourability: useFavourability,
        criteria: criteria,
        alternatives: alternatives,
        setTitle: setTitle,
        setTherapeuticContext: setTherapeuticContext,
        setUseFavourability: setUseFavourability,
        addCriterion: addCriterion,
        addAlternative: addAlternative
      }}
    >
      {props.children}
    </ManualInputContext.Provider>
  );
}
