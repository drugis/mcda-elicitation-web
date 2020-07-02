import IAlternative from '@shared/interface/IAlternative';
import IAlternativeCommand from '@shared/interface/IAlternativeCommand';
import IAlternativeQueryResult from '@shared/interface/IAlternativeQueryResult';
import ICellCommand from '@shared/interface/ICellCommand';
import ICriterion from '@shared/interface/ICriterion';
import ICriterionCommand from '@shared/interface/ICriterionCommand';
import ICriterionQueryResult from '@shared/interface/ICriterionQueryResult';
import IValueCellQueryResult from '@shared/interface/IDatabaseInputCell';
import IDataSource from '@shared/interface/IDataSource';
import IDataSourceCommand from '@shared/interface/IDataSourceCommand';
import IDataSourceQueryResult from '@shared/interface/IDataSourceQueryResult';
import {Distribution} from '@shared/interface/IDistribution';
import {Effect} from '@shared/interface/IEffect';
import IError from '@shared/interface/IError';
import IInProgressMessage from '@shared/interface/IInProgressMessage';
import IInProgressWorkspace from '@shared/interface/IInProgressWorkspace';
import IWorkspace from '@shared/interface/IWorkspace';
import IWorkspaceQueryResult from '@shared/interface/IWorkspaceQueryResult';
import IProblem from '@shared/interface/Problem/IProblem';
import {parallel, waterfall} from 'async';
import _ from 'lodash';
import pgPromise, {IMain} from 'pg-promise';
import {
  createProblem as buildProblem,
  mapAlternatives,
  mapCellMessages as mapCellCommands,
  mapCellValues,
  mapCombinedResults,
  mapCriteria,
  mapDataSources,
  mapToCellCommands,
  mapWorkspace
} from './inProgressRepositoryService';

export default function InProgressWorkspaceRepository(db: any) {
  const pgp: IMain = pgPromise();

  function create(
    userId: string,
    newInProgress: IWorkspace,
    callback: (error: any, createdId: string) => void
  ) {
    db.runInTransaction(
      _.partial(createInProgressWorkspaceTransaction, userId, newInProgress),
      callback
    );
  }

  function createInProgressWorkspaceTransaction(
    ownerId: string,
    newInProgress: IWorkspace,
    client: any,
    transactionCallback: (error: any, createdId: string) => void
  ) {
    const dataSources: IDataSource[] = _.flatMap(
      newInProgress.criteria,
      'dataSources'
    );
    waterfall(
      [
        _.partial(
          createInProgressWorkspace,
          client,
          ownerId,
          newInProgress.workspace
        ),
        _.partial(createInProgressCriteria, client, newInProgress.criteria),
        _.partial(createInProgressDataSources, client, dataSources),
        _.partial(
          createInProgressAlternatives,
          client,
          newInProgress.alternatives
        ),
        _.partial(createInProgressEffects, client, newInProgress.effects),
        _.partial(
          createInProgressDistributions,
          client,
          newInProgress.distributions
        )
      ],
      transactionCallback
    );
  }

  function createInProgressEffects(
    client: any,
    effects: Effect[],
    inProgressworkspaceId: number,
    callback: (error: IError, inProgressworkspaceId: number) => void
  ) {
    if (effects.length) {
      const cellCommands = mapToCellCommands(
        effects,
        inProgressworkspaceId,
        'effect'
      );
      upsertCellsInTransaction(
        client,
        cellCommands,
        inProgressworkspaceId,
        callback
      );
    } else {
      callback(null, inProgressworkspaceId);
    }
  }

  function createInProgressDistributions(
    client: any,
    distributions: Distribution[],
    inProgressworkspaceId: number,
    callback: (error: IError, inProgressworkspaceId: number) => void
  ) {
    if (distributions.length) {
      const cellCommands = mapToCellCommands(
        distributions,
        inProgressworkspaceId,
        'distribution'
      );
      upsertCellsInTransaction(
        client,
        cellCommands,
        inProgressworkspaceId,
        callback
      );
    } else {
      callback(null, inProgressworkspaceId);
    }
  }

  function createInProgressWorkspace(
    client: any,
    ownerId: string,
    toCreate: IInProgressWorkspace,
    callback: (error: IError, createdId: string) => void
  ) {
    const query = `INSERT INTO inProgressWorkspace (owner, state, useFavourability, 
        title, therapeuticContext) 
          VALUES ($1, $2, $3, $4, $5) 
        RETURNING id`;
    client.query(
      query,
      [
        ownerId,
        {},
        toCreate.useFavourability,
        toCreate.title,
        toCreate.therapeuticContext
      ],
      function (error: any, result: {rows: any[]}) {
        callback(error, error || result.rows[0].id);
      }
    );
  }

  function createInProgressCriteria(
    client: any,
    toCreate: ICriterion[],
    inProgressworkspaceId: string,
    callback: (error: any | null, inProgressworkspaceId: string) => {}
  ) {
    const toInsert = _.map(toCreate, (criterion: ICriterion, index: number) => {
      return {
        id: criterion.id,
        title: criterion.title,
        description: criterion.description || '',
        isfavourable: criterion.isFavourable,
        orderindex: index,
        inprogressworkspaceid: inProgressworkspaceId
      };
    });
    const columns = new pgp.helpers.ColumnSet(
      [
        'id',
        'orderindex',
        'isfavourable',
        'title',
        'description',
        'inprogressworkspaceid'
      ],
      {table: 'inprogresscriterion'}
    );
    const query = pgp.helpers.insert(toInsert, columns);
    client.query(query, [], (error: any) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, inProgressworkspaceId);
      }
    });
  }

  function createInProgressDataSources(
    client: any,
    toCreate: IDataSource[],
    inProgressworkspaceId: string,
    callback: (error: any | null, inProgressworkspaceId: string) => {}
  ) {
    const toInsert = _.map(toCreate, (item: IDataSource, index: number) => {
      return {
        id: item.id,
        orderindex: index,
        criterionid: item.criterionId,
        inprogressworkspaceid: inProgressworkspaceId,
        unitlabel: item.unitOfMeasurement.label,
        unittype: item.unitOfMeasurement.type,
        unitlowerbound: item.unitOfMeasurement.lowerBound,
        unitupperbound: item.unitOfMeasurement.upperBound,
        reference: item.reference || '',
        strengthofevidence: item.strengthOfEvidence || '',
        uncertainty: item.uncertainty || ''
      };
    });
    const columns = new pgp.helpers.ColumnSet(
      [
        'id',
        'orderindex',
        'criterionid',
        'inprogressworkspaceid',
        'unitlabel',
        'unittype',
        'unitlowerbound',
        'unitupperbound',
        'reference',
        'strengthofevidence',
        'uncertainty'
      ],
      {table: 'inprogressdatasource'}
    );
    const query = pgp.helpers.insert(toInsert, columns);
    client.query(query, [], (error: any) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, inProgressworkspaceId);
      }
    });
  }

  function createInProgressAlternatives(
    client: any,
    toCreate: IAlternative[],
    inProgressworkspaceId: string,
    callback: (error: any | null, inProgressworkspaceId: string) => {}
  ) {
    const toInsert = _.map(
      toCreate,
      (alternative: IAlternative, index: number) => {
        return {
          id: alternative.id,
          orderindex: index,
          inprogressworkspaceid: inProgressworkspaceId,
          title: alternative.title
        };
      }
    );
    const columns = new pgp.helpers.ColumnSet(
      ['id', 'orderindex', 'inprogressworkspaceid', 'title'],
      {table: 'inprogressalternative'}
    );
    const query = pgp.helpers.insert(toInsert, columns);
    client.query(query, [], (error: any) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, inProgressworkspaceId);
      }
    });
  }

  function get(
    inProgressId: number,
    callback: (error: any, result: IInProgressMessage) => void
  ): void {
    db.runInTransaction(
      _.partial(getTransaction, inProgressId),
      (
        error: any,
        results: [
          IInProgressWorkspace,
          ICriterion[],
          IAlternative[],
          IDataSource[],
          [
            Record<string, Record<string, Effect>>,
            Record<string, Record<string, Distribution>>
          ]
        ]
      ) => {
        if (error) {
          callback(error, null);
        } else {
          callback(null, mapCombinedResults(results));
        }
      }
    );
  }

  function getTransaction(
    inProgressId: number,
    client: any,
    transactionCallback: (
      error: any,
      results: [
        IInProgressWorkspace,
        ICriterion[],
        IAlternative[],
        IDataSource[],
        [
          Record<string, Record<string, Effect>>,
          Record<string, Record<string, Distribution>>
        ]
      ]
    ) => void
  ) {
    parallel(
      [
        _.partial(getWorkspace, inProgressId, client),
        _.partial(getCriteria, inProgressId, client),
        _.partial(getAlternatives, inProgressId, client),
        _.partial(getDataSources, inProgressId, client),
        _.partial(getInProgressValues, inProgressId, client)
      ],
      transactionCallback
    );
  }

  function getWorkspace(
    inProgressId: number,
    client: any,
    callback: (error: any, inProgressWorkspace: IInProgressWorkspace) => void
  ): void {
    const query = 'SELECT * FROM inProgressWorkspace WHERE id=$1';
    client.query(
      query,
      [inProgressId],
      (error: any, result: {rows: [IWorkspaceQueryResult]}) => {
        if (error) {
          callback(error, null);
        } else {
          callback(null, mapWorkspace(result.rows[0]));
        }
      }
    );
  }

  function getCriteria(
    inProgressId: number,
    client: any,
    callback: (error: any, criteria: ICriterion[]) => void
  ): void {
    const query =
      'SELECT * FROM inProgressCriterion WHERE inProgressWorkspaceId=$1';
    client.query(
      query,
      [inProgressId],
      (error: any, result: {rows: ICriterionQueryResult[]}) => {
        if (error) {
          callback(error, null);
        } else {
          callback(null, mapCriteria(result.rows));
        }
      }
    );
  }

  function getAlternatives(
    inProgressId: number,
    client: any,
    callback: (error: any, alternatives: IAlternative[]) => void
  ): void {
    const query =
      'SELECT * FROM inProgressAlternative WHERE inProgressWorkspaceId=$1';
    client.query(
      query,
      [inProgressId],
      (error: any, result: {rows: IAlternativeQueryResult[]}) => {
        if (error) {
          callback(error, null);
        } else {
          callback(null, mapAlternatives(result.rows));
        }
      }
    );
  }

  function getDataSources(
    inProgressId: number,
    client: any,
    callback: (error: any, dataSources: IDataSource[]) => void
  ) {
    const query =
      'SELECT * FROM inProgressDataSource WHERE inProgressWorkspaceId=$1';
    client.query(
      query,
      [inProgressId],
      (error: any, result: {rows: IDataSourceQueryResult[]}) => {
        if (error) {
          callback(error, null);
        } else {
          callback(null, mapDataSources(result.rows));
        }
      }
    );
  }

  function getInProgressValues(
    inProgressId: number,
    client: any,
    callback: (
      error: any,
      values: [
        Record<string, Record<string, Effect>>,
        Record<string, Record<string, Distribution>>
      ]
    ) => void
  ): void {
    const query =
      'SELECT * FROM inProgressWorkspaceCell WHERE inProgressWorkspaceId=$1';
    client.query(
      query,
      [inProgressId],
      (error: any, result: {rows: IValueCellQueryResult[]}) => {
        if (error) {
          callback(error, null);
        } else {
          callback(null, mapCellValues(result.rows));
        }
      }
    );
  }

  function updateWorkspace(
    {title, therapeuticContext, useFavourability, id}: IInProgressWorkspace,
    callback: (error: any) => void
  ): void {
    const query = `UPDATE inProgressWorkspace
                   SET (title, therapeuticContext, useFavourability) = ($1,$2,$3) 
                   WHERE id=$4`;
    db.query(
      query,
      [title, therapeuticContext, useFavourability, id],
      callback
    );
  }

  function upsertCriterion(
    {
      id,
      inProgressWorkspaceId,
      orderIndex,
      title,
      description,
      isFavourable
    }: ICriterionCommand,
    callback: (error: any) => void
  ): void {
    const query = `INSERT INTO inProgressCriterion 
                  (id, inProgressWorkspaceId, orderIndex, title , description, isFavourable) 
                  VALUES ($1, $2, $3, $4, $5, $6)
                  ON CONFLICT (id)
                  DO UPDATE
                  SET (orderIndex, title , description, isFavourable) = ($3, $4, $5, $6)`;
    db.query(
      query,
      [id, inProgressWorkspaceId, orderIndex, title, description, isFavourable],
      callback
    );
  }

  function deleteCriterion(
    criterionId: string,
    callback: (error: any) => void
  ): void {
    const query = `DELETE FROM inProgressCriterion WHERE id=$1`;
    db.query(query, [criterionId], callback);
  }

  function upsertDataSource(
    {
      id,
      inProgressWorkspaceId,
      criterionId,
      orderIndex,
      reference,
      strengthOfEvidence,
      uncertainty,
      unitOfMeasurement
    }: IDataSourceCommand,
    callback: (error: any) => void
  ): void {
    const query = `INSERT INTO inProgressDataSource 
                  (id, inProgressWorkspaceId, criterionId, orderIndex, reference, strengthOfEvidence, uncertainty, unitLabel, unitType, unitLowerBound, unitUpperBound) 
                  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                  ON CONFLICT (id)
                  DO UPDATE
                  SET (orderIndex, reference, strengthOfEvidence, uncertainty, unitLabel, unitType, unitLowerBound, unitUpperBound) = ($4, $5, $6, $7, $8, $9, $10, $11)`;
    db.query(
      query,
      [
        id,
        inProgressWorkspaceId,
        criterionId,
        orderIndex,
        reference,
        strengthOfEvidence,
        uncertainty,
        unitOfMeasurement.label,
        unitOfMeasurement.type,
        unitOfMeasurement.lowerBound,
        unitOfMeasurement.upperBound
      ],
      callback
    );
  }

  function deleteDataSource(
    dataSourceId: string,
    callback: (error: any) => void
  ): void {
    const query = `DELETE FROM inProgressDataSource WHERE id=$1`;
    db.query(query, [dataSourceId], callback);
  }

  function upsertAlternative(
    {id, inProgressWorkspaceId, orderIndex, title}: IAlternativeCommand,
    callback: (error: any) => void
  ): void {
    const query = `INSERT INTO inProgressAlternative 
                  (id, inProgressWorkspaceId, orderIndex, title) 
                  VALUES ($1, $2, $3, $4)
                  ON CONFLICT (id)
                  DO UPDATE
                  SET (orderIndex, title) = ($3, $4)`;
    db.query(query, [id, inProgressWorkspaceId, orderIndex, title], callback);
  }

  function deleteAlternative(
    alternativeId: string,
    callback: (error: any) => void
  ): void {
    const query = `DELETE FROM inProgressAlternative WHERE id=$1`;
    db.query(query, [alternativeId], callback);
  }

  function upsertCellsDirectly(
    cellCommands: ICellCommand[],
    callback: (error: IError) => void
  ): void {
    const query = buildUpsertCellsQuery(cellCommands);
    db.query(query, [], callback);
  }

  function upsertCellsInTransaction(
    client: any,
    cellCommands: ICellCommand[],
    inProgressworkspaceId: number,
    callback: (error: IError, inProgressworkspaceId: number) => void
  ) {
    const query = buildUpsertCellsQuery(cellCommands);
    client.query(query, [], (error: IError) => {
      callback(error, error ? null : inProgressworkspaceId);
    });
  }

  function buildUpsertCellsQuery(cellCommands: ICellCommand[]): string {
    const toInsert = mapCellCommands(cellCommands);
    const columns = new pgp.helpers.ColumnSet(
      [
        'inprogressworkspaceid',
        'alternativeid',
        'datasourceid',
        'criterionid',
        'celltype',
        'inputtype',
        'val',
        'lowerbound',
        'upperbound',
        'isnotestimablelowerbound',
        'isnotestimableupperbound',
        'txt',
        'mean',
        'standarderror',
        'alpha',
        'beta'
      ],
      {table: 'inprogressworkspacecell'}
    );
    const query =
      pgp.helpers.insert(toInsert, columns) +
      `ON CONFLICT (alternativeid, datasourceid, criterionid, celltype)
     DO UPDATE SET ` +
      columns.assignColumns({
        from: 'EXCLUDED',
        skip: [
          'inprogressworkspaceid',
          'alternativeid',
          'datasourceid',
          'criterionid',
          'celltype'
        ]
      });
    return query;
  }

  function createWorkspace(
    userId: string,
    inProgressId: number,
    inProgressMessage: IInProgressMessage,
    callback: (error: any, createdId: string) => void
  ) {
    db.runInTransaction(
      _.partial(
        createWorkspaceTransaction,
        userId,
        inProgressId,
        inProgressMessage
      ),
      callback
    );
  }

  function createWorkspaceTransaction(
    userId: string,
    inProgressId: number,
    inProgressMessage: IInProgressMessage,
    client: any,
    transactionCallback: (error: any, createdId: string) => void
  ) {
    const problem = buildProblem(inProgressMessage);
    waterfall(
      [
        _.partial(createProblem, client, userId, problem),
        _.partial(deleteInTransaction, client, inProgressId)
      ],
      transactionCallback
    );
  }

  function createProblem(
    client: any,
    userId: string,
    problem: IProblem,
    callback: (error: any | null, workspaceId: number) => void
  ) {
    const query = `INSERT INTO workspace (owner, title, problem) 
                   VALUES ($1, $2, $3) 
                   RETURNING id`;
    client.query(
      query,
      [userId, problem.title, problem],
      (error: any, result: {rows: any[]}) => {
        callback(error, error || result.rows[0].id);
      }
    );
  }

  function deleteInTransaction(
    client: any,
    inProgressId: number,
    callback: (error: any) => void
  ) {
    del(client, inProgressId, callback);
  }

  function deleteDirectly(
    inProgressId: number,
    callback: (error: any) => void
  ) {
    del(db, inProgressId, callback);
  }

  function del(
    client: any,
    inProgressId: number,
    callback: (error: any) => void
  ) {
    const query = 'DELETE FROM inprogressworkspace WHERE id=$1';
    client.query(query, [inProgressId], callback);
  }

  function query(
    ownerId: number,
    callback: (error: IError | null, result: any[]) => void
  ) {
    const query = 'SELECT id, title FROM inProgressWorkspace WHERE owner = $1';
    db.query(query, [ownerId], (error: IError, result: {rows: any[]}) => {
      callback(error, error ? null : result.rows);
    });
  }

  return {
    create: create,
    get: get,
    deleteInTransaction: deleteInTransaction,
    deleteDirectly: deleteDirectly,
    updateWorkspace: updateWorkspace,
    upsertCriterion: upsertCriterion,
    deleteCriterion: deleteCriterion,
    upsertDataSource: upsertDataSource,
    deleteDataSource: deleteDataSource,
    upsertAlternative: upsertAlternative,
    deleteAlternative: deleteAlternative,
    upsertCellsDirectly: upsertCellsDirectly,
    createWorkspace: createWorkspace,
    query: query
  };
}
