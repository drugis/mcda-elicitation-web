import _ from 'lodash';
import React, {createContext, useState} from 'react';
import IAlternative from '../interface/IAlternative';
import ICriterion from '../interface/ICriterion';
import IDataSource from '../interface/IDataSource';
import {Distribution} from '../interface/IDistribution';
import {Effect} from '../interface/IEffect';
import IManualInputContext from '../interface/IManualInputContext';
import {UnitOfMeasurementType} from '../interface/IUnitOfMeasurement';
import {TableInputMode} from '../type/TableInputMode';
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
        title: 'reference',
        unitOfMeasurement: defaultUnitOfMeasurement,
        uncertainty: 'unc',
        strengthOfEvidence: 'soe'
      }
    ],
    isFavourable: true,
    title: 'criterion 1'
  },
  {
    id: generateUuid(),
    description: 'desc',
    dataSources: [
      {
        id: generateUuid(),
        title: 'reference',
        unitOfMeasurement: defaultUnitOfMeasurement,
        uncertainty: 'unc',
        strengthOfEvidence: 'soe'
      }
    ],
    isFavourable: false,
    title: 'criterion 2'
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
  const [tableInputMode, setTableInputMode] = useState<TableInputMode>(
    'effect'
  );
  const [criteria, setCriteria] = useState<ICriterion[]>(placeholderCriteria);
  const [alternatives, setAlternatives] = useState<IAlternative[]>(
    placeholderAlternatives
  );
  const [effects, setEffects] = useState<
    Record<string, Record<string, Effect>>
  >({});
  const [distributions, setDistributions] = useState<
    Record<string, Record<string, Distribution>>
  >({});

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

  function swapCriteria(criterion1Id: string, criterion2Id: string): void {
    const index1 = _.findIndex(criteria, ['id', criterion1Id]);
    const index2 = _.findIndex(criteria, ['id', criterion2Id]);
    let criteriaCopy = _.cloneDeep(criteria);
    // ES6 swap trick below, don't even worry about it
    [criteriaCopy[index1], criteriaCopy[index2]] = [
      criteriaCopy[index2],
      criteriaCopy[index1]
    ];
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

  function swapDataSources(
    criterionId: string,
    dataSource1Id: string,
    dataSource2Id: string
  ): void {
    let criteriaCopy = _.cloneDeep(criteria);
    const criterion = _.find(criteriaCopy, ['id', criterionId]);
    const dataSource1Index = _.findIndex(criterion.dataSources, [
      'id',
      dataSource1Id
    ]);
    const dataSource2Index = _.findIndex(criterion.dataSources, [
      'id',
      dataSource2Id
    ]);
    [
      criterion.dataSources[dataSource1Index],
      criterion.dataSources[dataSource2Index]
    ] = [
      criterion.dataSources[dataSource2Index],
      criterion.dataSources[dataSource1Index]
    ];
    setCriteria(criteriaCopy);
  }

  function getEffect(
    criterionId: string,
    dataSourceId: string,
    alternativeId: string
  ): Effect {
    if (
      effects &&
      effects[dataSourceId] &&
      effects[dataSourceId][alternativeId]
    ) {
      return effects[dataSourceId][alternativeId];
    } else {
      return {
        alternativeId: alternativeId,
        dataSourceId: dataSourceId,
        criterionId: criterionId,
        type: 'value',
        value: undefined
      };
    }
  }

  function setEffect(
    effect: Effect,
    dataSourceId: string,
    alternativeId: string
  ): void {
    let effectValuesCopy = _.cloneDeep(effects);
    if (!effectValuesCopy[dataSourceId]) {
      effectValuesCopy[dataSourceId] = {};
    }
    effectValuesCopy[dataSourceId][alternativeId] = effect;
    setEffects(effectValuesCopy);
  }
  function getDistribution(
    criterionId: string,
    dataSourceId: string,
    alternativeId: string
  ): Distribution {
    if (
      distributions &&
      distributions[dataSourceId] &&
      distributions[dataSourceId][alternativeId]
    ) {
      return distributions[dataSourceId][alternativeId];
    } else {
      return {
        alternativeId: alternativeId,
        dataSourceId: dataSourceId,
        criterionId: criterionId,
        type: 'normal',
        mean: undefined,
        standardError: undefined
      };
    }
  }

  function setDistribution(
    distribution: Distribution,
    dataSourceId: string,
    alternativeId: string
  ): void {
    let distributionValuesCopy = _.cloneDeep(distributions);
    if (!distributionValuesCopy[dataSourceId]) {
      distributionValuesCopy[dataSourceId] = {};
    }
    distributionValuesCopy[dataSourceId][alternativeId] = distribution;
    setDistributions(distributionValuesCopy);
  }

  return (
    <ManualInputContext.Provider
      value={{
        title: title,
        therapeuticContext: therapeuticContext,
        useFavourability: useFavourability,
        tableInputMode: tableInputMode,
        criteria: criteria,
        alternatives: alternatives,
        effects: effects,
        distributions: distributions,
        setTitle: setTitle,
        setTherapeuticContext: setTherapeuticContext,
        setUseFavourability: setUseFavourability,
        setTableInputMode: setTableInputMode,
        addCriterion: addCriterion,
        addAlternative: addAlternative,
        addDefaultDataSource: addDefaultDataSource,
        deleteDataSource: deleteDataSource,
        setCriterion: setCriterion,
        swapCriteria: swapCriteria,
        setCriterionProperty: setCriterionProperty,
        setAlternative: setAlternative,
        setDataSource: setDataSource,
        swapDataSources: swapDataSources,
        deleteCriterion: deleteCriterion,
        deleteAlternative: deleteAlternative,
        getEffect: getEffect,
        setEffect: setEffect,
        getDistribution: getDistribution,
        setDistribution: setDistribution
      }}
    >
      {props.children}
    </ManualInputContext.Provider>
  );
}
