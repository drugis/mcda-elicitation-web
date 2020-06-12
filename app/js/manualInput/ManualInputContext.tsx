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
        uncertainty: 'unc',
        strengthOfEvidence: 'soe'
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
        uncertainty: 'unc',
        strengthOfEvidence: 'soe'
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
  const [useFavourability, setUseFavourability] = useState<boolean>(true);
  const [criteria, setCriteria] = useState<ICriterion[]>(placeholderCriteria);
  const [alternatives, setAlternatives] = useState<IAlternative[]>(
    placeholderAlternatives
  );

  function addCriterion(isFavourable: boolean) {
    const newCriterion = {
      id: generateUuid(),
      title: 'new criterion',
      description: '',
      isFavourable: isFavourable,
      dataSources: [
        {
          id: generateUuid(),
          title: 'new reference',
          uncertainty: '',
          unitOfMeasurement: defaultUnitOfMeasurement,
          strengthOfEvidence: 'soe'
        }
      ]
    };
    setCriteria([...criteria, newCriterion]);
  }

  function setCriterionProperty(
    criterionId: string,
    propertyName: string,
    value: string
  ) {
    let criteriaCopy = _.cloneDeep(criteria);
    let criterion = _.find(criteriaCopy, ['id', criterionId]);
    switch (propertyName) {
      case 'title':
        criterion.title = value;
        break;
      case 'description':
        criterion.description = value;
        break;
      default:
        throw 'unknown criterion property being updated: ' + propertyName;
    }
    setCriteria(criteriaCopy);
  }

  function setCriterion(criterion: ICriterion) {
    const index = _.findIndex(criteria, ['id', criterion.id]);
    let criteriaCopy = _.cloneDeep(criteria);
    criteriaCopy[index] = criterion;
    setCriteria(criteriaCopy);
  }

  function deleteCriterion(criterionId: string) {
    setCriteria(_.reject([...criteria], ['id', criterionId]));
  }

  function addAlternative() {
    const newAlternative = {
      id: generateUuid(),
      title: 'new alternative'
    };
    setAlternatives([...alternatives, newAlternative]);
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

  function addDefaultDataSource(criterionId: string) {
    let criteriaCopy = _.cloneDeep(criteria);
    let criterion = _.find(criteriaCopy, ['id', criterionId]);
    criterion.dataSources.push({
      id: generateUuid(),
      title: 'new reference',
      unitOfMeasurement: defaultUnitOfMeasurement,
      uncertainty: 'unc',
      strengthOfEvidence: 'soe'
    });
    setCriteria(criteriaCopy);
  }

  function deleteDataSource(criterionId: string, dataSourceId: string) {
    let criteriaCopy = _.cloneDeep(criteria);
    let criterion = _.find(criteriaCopy, ['id', criterionId]);
    criterion.dataSources = _.reject(criterion.dataSources, [
      'id',
      dataSourceId
    ]);
    setCriteria(criteriaCopy);
  }

  function setDataSource(criterionId: string, dataSource: IDataSource) {
    let criteriaCopy = _.cloneDeep(criteria);
    let criterion = _.find(criteriaCopy, ['id', criterionId]);
    const index = _.findIndex(criterion.dataSources, ['id', dataSource.id]);
    criterion.dataSources[index] = dataSource;
    setCriteria(criteriaCopy);
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
        addDefaultDataSource: addDefaultDataSource,
        deleteDataSource: deleteDataSource,
        setCriterion: setCriterion,
        setCriterionProperty: setCriterionProperty,
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
