import _ from 'lodash';
import React, {createContext, useState} from 'react';
import IAlternative from '../interface/IAlternative';
import ICriterion from '../interface/ICriterion';
import IDataSource from '../interface/IDataSource';
import IManualInputContext from '../interface/IManualInputContext';
import {UnitOfMeasurementType} from '../interface/IUnitOfMeasurement';
import {generateUuid} from './ManualInput/ManualInputService/ManualInputService';

const defaultUnitOfMeasurement = {
  label: '',
  type: UnitOfMeasurementType.custom,
  lowerBound: -Infinity,
  upperBound: Infinity
};

const placeholderCriteria: ICriterion[] = [
  {
    id: generateUuid(),
    description: 'desc',
    dataSources: [
      {
        id: generateUuid(),
        title: 'ds1',
        unitOfMeasurement: defaultUnitOfMeasurement,
        uncertainty: ''
      }
    ],
    isFavourable: true,
    title: 'crit1'
  },
  {
    id: generateUuid(),
    description: 'desc',
    dataSources: [
      {
        id: generateUuid(),
        title: 'ds1',
        unitOfMeasurement: defaultUnitOfMeasurement,
        uncertainty: ''
      }
    ],
    isFavourable: false,
    title: 'crit2'
  }
];

const placeholderAlternatives: IAlternative[] = [
  {id: generateUuid(), title: 'alt1'},
  {id: generateUuid(), title: 'alt2'}
];

export const ManualInputContext = createContext<IManualInputContext>(
  {} as IManualInputContext
);

export function ManualInputContextProviderComponent(props: {children: any}) {
  const [title, setTitle] = useState<string>('');
  const [therapeuticContext, setTherapeuticContext] = useState<string>('');
  const [useFavourability, setUseFavourability] = useState<boolean>(false);
  const [criteria, setCriteria] = useState<ICriterion[]>(placeholderCriteria);
  const [alternatives, setAlternatives] = useState<IAlternative[]>(
    placeholderAlternatives
  );

  function addCriterion(isFavourable: boolean) {
    let criteriaCopy = _.cloneDeep(criteria);
    criteriaCopy.push({
      id: generateUuid(),
      title: 'new criterion',
      description: '',
      isFavourable: isFavourable,
      dataSources: [
        {
          id: generateUuid(),
          title: 'new reference',
          uncertainty: '',
          unitOfMeasurement: defaultUnitOfMeasurement
        }
      ]
    });
    setCriteria(criteriaCopy);
  }

  function setCriterion(criterion: ICriterion) {
    const index = _.findIndex(criteria, ['id', criterion.id]);
    let criteriaCopy = _.cloneDeep(criteria);
    criteriaCopy[index] = criterion;
    setCriteria(criteriaCopy);
  }

  function deleteCriterion(criterionId: string) {
    const criteriaCopy = _.reject(_.cloneDeep(criteria), ['id', criterionId]);
    setCriteria(criteriaCopy);
  }

  function addAlternative(alternative: IAlternative) {
    let alternativesCopy = _.cloneDeep(alternatives);
    alternativesCopy.push(alternative);
    setAlternatives(alternativesCopy);
  }

  function setAlternative(alternative: IAlternative) {
    const index = _.findIndex(alternatives, ['id', alternative.id]);
    let alternativesCopy = _.cloneDeep(alternatives);
    alternativesCopy[index] = alternative;
    setAlternatives(alternativesCopy);
  }

  function deleteAlternative(alternativeId: string) {
    const alternativesCopy = _.reject(_.cloneDeep(alternatives), [
      'id',
      alternativeId
    ]);
    setAlternatives(alternativesCopy);
  }

  function addDataSource(criterion: ICriterion) {
    const index = _.findIndex(criteria, ['id', criterion.id]);
    let criteriaCopy = _.cloneDeep(criteria);
    criterion.dataSources.push({
      id: generateUuid(),
      title: 'new reference',
      unitOfMeasurement: defaultUnitOfMeasurement,
      uncertainty: ''
    });
    criteriaCopy[index] = criterion;
    setCriteria(criteriaCopy);
  }

  function setDataSource(criterion: ICriterion, dataSource: IDataSource) {
    let criterionCopy = _.cloneDeep(criterion);
    const index = _.findIndex(criterionCopy.dataSources, ['id', dataSource.id]);
    criterionCopy.dataSources[index] = dataSource;
    setCriterion(criterionCopy);
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
        addAlternative: addAlternative,
        addDataSource: addDataSource,
        setCriterion: setCriterion,
        setAlternative: setAlternative,
        setDataSource: setDataSource,
        deleteCriterion: deleteCriterion,
        deleteAlternative: deleteAlternative
      }}
    >
      {props.children}
    </ManualInputContext.Provider>
  );
}
