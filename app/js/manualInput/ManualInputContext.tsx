import _ from 'lodash';
import React, {createContext, useEffect, useState} from 'react';
import IAlternative from '../interface/IAlternative';
import ICriterion from '../interface/ICriterion';
import IDataSource from '../interface/IDataSource';
import {Distribution} from '../interface/IDistribution';
import {Effect} from '../interface/IEffect';
import IManualInputContext from '../interface/IManualInputContext';
import {UnitOfMeasurementType} from '../interface/IUnitOfMeasurement';
import {TableInputMode} from '../type/TableInputMode';
import {
  createDistributions,
  createWarnings,
  generateUuid,
  swapItems
} from './ManualInput/ManualInputService/ManualInputService';

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
        reference: 'reference',
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
        reference: 'reference',
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
  const [warnings, setWarnings] = useState<string[]>([]);

  useEffect(updateWarnings, [
    title,
    criteria,
    alternatives,
    effects,
    distributions
  ]);

  function addCriterion(isFavourable: boolean) {
    const newCriterion = {
      id: generateUuid(),
      title: 'new criterion',
      description: '',
      isFavourable: isFavourable,
      dataSources: [
        {
          id: generateUuid(),
          reference: 'new reference',
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
    setCriteria(swapItems(criterion1Id, criterion2Id, criteria));
  }

  function swapAlternatives(
    alternative1Id: string,
    alternative2Id: string
  ): void {
    setAlternatives(swapItems(alternative1Id, alternative2Id, alternatives));
  }

  function setCriterion(criterion: ICriterion) {
    const index = _.findIndex(criteria, ['id', criterion.id]);
    let criteriaCopy = _.cloneDeep(criteria);
    criteriaCopy[index] = criterion;
    setCriteria(criteriaCopy);
  }

  function deleteCriterion(criterionId: string) {
    const criterion = _.find(criteria, ['id', criterionId]);
    let effectsCopy = _.cloneDeep(effects);
    let distributionsCopy = _.cloneDeep(distributions);
    _.forEach(criterion.dataSources, (dataSource: IDataSource) => {
      delete effectsCopy[dataSource.id];
      delete distributionsCopy[dataSource.id];
    });
    setEffects(effectsCopy);
    setDistributions(distributionsCopy);
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
    let effectsCopy = _.cloneDeep(effects);
    let distributionsCopy = _.cloneDeep(distributions);
    _.forEach(effects, (row: Record<string, Effect>, dataSourceId: string) => {
      if (effectsCopy[dataSourceId]) {
        delete effectsCopy[dataSourceId][alternativeId];
      }
      if (distributionsCopy[dataSourceId]) {
        delete distributionsCopy[dataSourceId][alternativeId];
      }
    });
    setEffects(effectsCopy);
    setDistributions(distributionsCopy);
    setAlternatives(alternativesCopy);
  }

  function addDefaultDataSource(criterionId: string) {
    let criteriaCopy = _.cloneDeep(criteria);
    let criterion = _.find(criteriaCopy, ['id', criterionId]);
    criterion.dataSources.push({
      id: generateUuid(),
      reference: 'new reference',
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
    let effectsCopy = _.cloneDeep(effects);
    let distributionsCopy = _.cloneDeep(distributions);
    delete effectsCopy[dataSourceId];
    delete distributionsCopy[dataSourceId];
    setEffects(effectsCopy);
    setDistributions(distributionsCopy);
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

  function setEffect(effect: Effect): void {
    let effectsCopy = _.cloneDeep(effects);
    if (!effectsCopy[effect.dataSourceId]) {
      effectsCopy[effect.dataSourceId] = {};
    }
    effectsCopy[effect.dataSourceId][effect.alternativeId] = effect;
    setEffects(effectsCopy);
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

  function setDistribution(distribution: Distribution): void {
    let distributionsCopy = _.cloneDeep(distributions);
    if (!distributionsCopy[distribution.dataSourceId]) {
      distributionsCopy[distribution.dataSourceId] = {};
    }
    distributionsCopy[distribution.dataSourceId][
      distribution.alternativeId
    ] = distribution;
    setDistributions(distributionsCopy);
  }

  function generateDistributions() {
    setDistributions(createDistributions(distributions, effects));
  }

  function updateWarnings(): void {
    setWarnings(createWarnings(title, criteria, alternatives));
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
        swapAlternatives: swapAlternatives,
        setCriterionProperty: setCriterionProperty,
        setAlternative: setAlternative,
        setDataSource: setDataSource,
        swapDataSources: swapDataSources,
        deleteCriterion: deleteCriterion,
        deleteAlternative: deleteAlternative,
        getEffect: getEffect,
        setEffect: setEffect,
        getDistribution: getDistribution,
        setDistribution: setDistribution,
        generateDistributions: generateDistributions,
        isDoneDisabled: warnings.length > 0,
        warnings: warnings
      }}
    >
      {props.children}
    </ManualInputContext.Provider>
  );
}
