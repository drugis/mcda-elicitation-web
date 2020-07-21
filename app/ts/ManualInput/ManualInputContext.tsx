import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import { Distribution } from '@shared/interface/IDistribution';
import { Effect } from '@shared/interface/IEffect';
import IError from '@shared/interface/IError';
import IInProgressMessage from '@shared/interface/IInProgressMessage';
import IManualInputContext from '@shared/interface/IManualInputContext';
import { UnitOfMeasurementType } from '@shared/interface/IUnitOfMeasurement';
import Axios from 'axios';
import _ from 'lodash';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { generateUuid } from 'shared/util';
import { ErrorContext } from '../Error/ErrorContext';
import { TableInputMode } from '../type/TableInputMode';
import {
  createDistributions,
  createWarnings,
  replaceUndefinedBounds,
  swapItems
} from './ManualInputService/ManualInputService';

const defaultUnitOfMeasurement = {
  label: '',
  type: UnitOfMeasurementType.custom,
  lowerBound: -Infinity,
  upperBound: Infinity
};

export const ManualInputContext = createContext<IManualInputContext>(
  {} as IManualInputContext
);

export function ManualInputContextProviderComponent({
  children,
  message,
  inProgressId
}: {
  children: any;
  message: IInProgressMessage;
  inProgressId: string;
}) {
  const {setError} = useContext(ErrorContext);

  const [title, setTitle] = useState<string>(message.workspace.title);
  const [therapeuticContext, setTherapeuticContext] = useState<string>(
    message.workspace.therapeuticContext
  );
  const [useFavourability, setUseFavourability] = useState<boolean>(
    message.workspace.useFavourability
  );
  const [tableInputMode, setTableInputMode] = useState<TableInputMode>(
    'effect'
  );
  const [criteria, setCriteria] = useState<ICriterion[]>(
    replaceUndefinedBounds(message.criteria)
  );
  const [alternatives, setAlternatives] = useState<IAlternative[]>(
    message.alternatives
  );
  const [effects, setEffects] = useState<
    Record<string, Record<string, Effect>>
  >(message.effects);
  const [distributions, setDistributions] = useState<
    Record<string, Record<string, Distribution>>
  >(message.distributions);
  const [warnings, setWarnings] = useState<string[]>([]);

  useEffect(updateWarnings, [
    title,
    criteria,
    alternatives,
    effects,
    distributions
  ]);

  function addCriterion(isFavourable: boolean) {
    const newCriterion : ICriterion = {
      id: generateUuid(),
      title: 'new criterion',
      description: '',
      isFavourable: isFavourable,
      dataSources: [
        {
          id: generateUuid(),
          reference: '',
          referenceLink: '',
          uncertainty: '',
          unitOfMeasurement: defaultUnitOfMeasurement,
          strengthOfEvidence: ''
        }
      ]
    };
    updateCriterion(newCriterion, criteria.length).then((response: any) => {
      updateDataSource(newCriterion.dataSources[0], 0, newCriterion.id);
    });
    setCriteria([...criteria, newCriterion]);
  }

  async function updateCriterion(criterion: ICriterion, orderIndex: number) {
    return Axios.put(
      `/api/v2/inProgress/${inProgressId}/criteria/${criterion.id}`,
      {
        ..._.omit(criterion, 'dataSources'),
        inProgressWorkspaceId: inProgressId,
        orderIndex: orderIndex
      }
    ).catch((error: IError) => {
      setError(error.message + ', ' + error.response.data);
    });
  }

  function updateDataSource(
    dataSource: IDataSource,
    orderIndex: number,
    criterionId: string
  ): void {
    Axios.put(
      `/api/v2/inProgress/${inProgressId}/criteria/${criterionId}/dataSources/${dataSource.id}`,
      {
        ...dataSource,
        criterionId: criterionId,
        inProgressWorkspaceId: inProgressId,
        orderIndex: orderIndex
      }
    ).catch((error: IError) => {
      setError(error.message + ', ' + error.response.data);
    });
  }

  function setCriterionProperty(
    criterionId: string,
    propertyName: string,
    value: string | boolean
  ) {
    let criteriaCopy = _.cloneDeep(criteria);
    let criterion = _.find(criteriaCopy, ['id', criterionId]);
    switch (propertyName) {
      case 'title':
        criterion.title = value as string;
        break;
      case 'description':
        criterion.description = value as string;
        break;
      case 'isFavourable':
        criterion.isFavourable = value as boolean;
        break;
      default:
        throw 'unknown criterion property being updated: ' + propertyName;
    }
    updateCriterion(criterion, _.findIndex(criteriaCopy, ['id', criterionId]));
    setCriteria(criteriaCopy);
  }

  function swapCriteria(criterion1Id: string, criterion2Id: string): void {
    const newCriteria = swapItems(criterion1Id, criterion2Id, criteria);
    updateCriterion(
      _.find(newCriteria, ['id', criterion1Id]),
      _.findIndex(newCriteria, ['id', criterion1Id])
    );
    updateCriterion(
      _.find(newCriteria, ['id', criterion2Id]),
      _.findIndex(newCriteria, ['id', criterion2Id])
    );
    setCriteria(newCriteria);
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
    deleteCriterionFromDatabase(criterionId);
    setCriteria(_.reject([...criteria], ['id', criterionId]));
  }

  function deleteCriterionFromDatabase(criterionId: string) {
    Axios.delete(
      `/api/v2/inProgress/${inProgressId}/criteria/${criterionId}`
    ).catch((error: IError) => {
      setError(error.message + ', ' + error.response.data);
    });
  }

  function addAlternative() {
    const newAlternative = {
      id: generateUuid(),
      title: 'new alternative'
    };
    updateAlternative(newAlternative, alternatives.length);
    setAlternatives([...alternatives, newAlternative]);
  }

  function updateAlternative(
    alternative: IAlternative,
    orderIndex: number
  ): void {
    Axios.put(
      `/api/v2/inProgress/${inProgressId}/alternatives/${alternative.id}`,
      {
        ...alternative,
        inProgressWorkspaceId: inProgressId,
        orderIndex: orderIndex
      }
    ).catch((error: IError) => {
      setError(error.message + ', ' + error.response.data);
    });
  }

  function setAlternative(alternative: IAlternative) {
    const index = _.findIndex(alternatives, ['id', alternative.id]);
    let alternativesCopy = _.cloneDeep(alternatives);
    alternativesCopy[index] = alternative;
    updateAlternative(alternative, index);
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
    deleteAlternativeFromDatabase(alternativeId);
  }

  function deleteAlternativeFromDatabase(alternativeId: string) {
    Axios.delete(
      `/api/v2/inProgress/${inProgressId}/alternatives/${alternativeId}`
    ).catch((error: IError) => {
      setError(error.message + ', ' + error.response.data);
    });
  }

  function swapAlternatives(
    alternative1Id: string,
    alternative2Id: string
  ): void {
    const newAlternatives = swapItems(
      alternative1Id,
      alternative2Id,
      alternatives
    );
    updateAlternative(
      _.find(newAlternatives, ['id', alternative1Id]),
      _.findIndex(newAlternatives, ['id', alternative1Id])
    );
    updateAlternative(
      _.find(newAlternatives, ['id', alternative2Id]),
      _.findIndex(newAlternatives, ['id', alternative2Id])
    );
    setAlternatives(newAlternatives);
  }

  function addDefaultDataSource(criterionId: string) {
    let criteriaCopy = _.cloneDeep(criteria);
    let criterion = _.find(criteriaCopy, ['id', criterionId]);
    const newDataSource : IDataSource = {
      id: generateUuid(),
      reference: 'new reference',
      referenceLink: '',
      unitOfMeasurement: defaultUnitOfMeasurement,
      uncertainty: 'unc',
      strengthOfEvidence: 'soe'
    };
    criterion.dataSources.push(newDataSource);
    updateDataSource(newDataSource, criterion.dataSources.length, criterionId);
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
    deleteDataSourceFromDatabase(dataSourceId, criterionId);
  }

  function deleteDataSourceFromDatabase(
    dataSourceId: string,
    criterionId: string
  ) {
    Axios.delete(
      `/api/v2/inProgress/${inProgressId}/criteria/${criterionId}/dataSources/${dataSourceId}`
    ).catch((error: IError) => {
      setError(error.message + ', ' + error.response.data);
    });
  }

  function setDataSource(criterionId: string, dataSource: IDataSource) {
    let criteriaCopy = _.cloneDeep(criteria);
    let criterion = _.find(criteriaCopy, ['id', criterionId]);
    const index = _.findIndex(criterion.dataSources, ['id', dataSource.id]);
    criterion.dataSources[index] = dataSource;
    updateDataSource(dataSource, index, criterion.id);
    setCriteria(criteriaCopy);
  }

  function swapDataSources(
    criterionId: string,
    dataSource1Id: string,
    dataSource2Id: string
  ): void {
    let criteriaCopy = _.cloneDeep(criteria);
    const criterion = _.find(criteriaCopy, ['id', criterionId]);
    const newDataSources = swapItems(
      dataSource1Id,
      dataSource2Id,
      criterion.dataSources
    );
    criterion.dataSources = newDataSources;
    updateDataSource(
      _.find(criterion.dataSources, ['id', dataSource1Id]),
      _.findIndex(newDataSources, ['id', dataSource1Id]),
      criterionId
    );
    updateDataSource(
      _.find(criterion.dataSources, ['id', dataSource2Id]),
      _.findIndex(newDataSources, ['id', dataSource2Id]),
      criterionId
    );
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
    updateCell(effect, 'effect');
    setEffects(effectsCopy);
  }

  function updateCell(
    cell: Effect | Distribution,
    cellType: TableInputMode
  ): void {
    Axios.put(`/api/v2/inProgress/${inProgressId}/cells`, {
      ...cell,
      inProgressWorkspaceId: inProgressId,
      cellType: cellType
    }).catch((error: IError) => {
      setError(error.message + ', ' + error.response.data);
    });
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
    updateCell(distribution, 'distribution');
    setDistributions(distributionsCopy);
  }

  function generateDistributions(): void {
    const newDistributions = createDistributions(distributions, effects);
    _.forEach(newDistributions, (row) => {
      _.forEach(row, (distribution: Distribution) => {
        updateCell(distribution, 'distribution');
      });
    });
    setDistributions(newDistributions);
  }

  function updateWarnings(): void {
    setWarnings(
      createWarnings(title, criteria, alternatives, effects, distributions)
    );
  }

  function updateTitle(newTitle: string): void {
    setTitle(newTitle);
    updateWorkspace(newTitle, therapeuticContext, useFavourability);
  }

  function updateTherapeuticContext(newContext: string): void {
    setTherapeuticContext(newContext);
    updateWorkspace(title, newContext, useFavourability);
  }

  function updateUseFavourability(newFavourability: boolean): void {
    setUseFavourability(newFavourability);
    updateWorkspace(title, therapeuticContext, newFavourability);
  }

  function updateWorkspace(
    title: string,
    therapeuticContext: string,
    useFavourability: boolean
  ) {
    const workspace = {
      id: inProgressId,
      title: title,
      therapeuticContext: therapeuticContext,
      useFavourability: useFavourability
    };
    Axios.put(`/api/v2/inProgress/${inProgressId}`, workspace).catch(
      (error: IError) => {
        setError(error.message + ', ' + error.response.data);
      }
    );
  }

  return (
    <ManualInputContext.Provider
      value={{
        id: inProgressId,
        title: title,
        therapeuticContext: therapeuticContext,
        useFavourability: useFavourability,
        tableInputMode: tableInputMode,
        criteria: criteria,
        alternatives: alternatives,
        effects: effects,
        distributions: distributions,
        setTableInputMode: setTableInputMode,
        addCriterion: addCriterion,
        addAlternative: addAlternative,
        addDefaultDataSource: addDefaultDataSource,
        deleteDataSource: deleteDataSource,
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
        warnings: warnings,
        updateTitle: updateTitle,
        updateTherapeuticContext: updateTherapeuticContext,
        updateUseFavourability: updateUseFavourability
      }}
    >
      {children}
    </ManualInputContext.Provider>
  );
}
