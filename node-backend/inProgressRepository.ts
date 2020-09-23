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
import {OurError} from '@shared/interface/IError';
import IInProgressMessage from '@shared/interface/IInProgressMessage';
import IWorkspace from '@shared/interface/IWorkspace';
import IWorkspaceProperties from '@shared/interface/IWorkspaceProperties';
import IWorkspaceQueryResult from '@shared/interface/IWorkspaceQueryResult';
import IProblem from '@shared/interface/Problem/IProblem';
import {parallel, waterfall} from 'async';
import _ from 'lodash';
import {PoolClient, QueryResult} from 'pg';
import pgPromise, {IMain} from 'pg-promise';
import {
  buildProblem,
  mapAlternatives,
  mapCellCommands,
  mapCellValues,
  mapCombinedResults,
  mapCriteria,
  mapDataSources,
  mapToAlternativeQueryResult,
  mapToCellCommands,
  mapToCriteriaQueryResult,
  mapToDataSourceQueryResult,
  mapWorkspace
} from './inProgressRepositoryService';
import IDB, {ClientOrDB} from './interface/IDB';

export default function InProgressWorkspaceRepository(db: IDB) {
  const pgp: IMain = pgPromise();

  function create(
    userId: string,
    newInProgress: IWorkspace,
    callback: (error: any, createdId: string) => void
  ): void {
    db.runInTransaction(
      _.partial(createInProgressWorkspaceTransaction, userId, newInProgress),
      callback
    );
  }

  function createInProgressWorkspaceTransaction(
    ownerId: string,
    newInProgress: IWorkspace,
    client: PoolClient,
    transactionCallback: (error: any, createdId: string) => void
  ): void {
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
          newInProgress.properties
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
    client: PoolClient,
    effects: Effect[],
    inProgressworkspaceId: number,
    callback: (error: OurError, inProgressworkspaceId: number) => void
  ): void {
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
    client: PoolClient,
    distributions: Distribution[],
    inProgressworkspaceId: number,
    callback: (error: OurError, inProgressworkspaceId: number) => void
  ): void {
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
    client: PoolClient,
    ownerId: string,
    toCreate: IWorkspaceProperties,
    callback: (error: OurError, createdId: string) => void
  ): void {
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
      (error: any, result: QueryResult<{id: string}>): void => {
        callback(error, error || result.rows[0].id);
      }
    );
  }

  function createInProgressCriteria(
    client: PoolClient,
    toCreate: ICriterion[],
    inProgressId: string,
    callback: (error: any | null, inProgressworkspaceId: string) => {}
  ): void {
    const toInsert = mapToCriteriaQueryResult(toCreate, inProgressId);
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
    client.query(query, [], (error: any): void => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, inProgressId);
      }
    });
  }

  function createInProgressDataSources(
    client: PoolClient,
    dataSources: IDataSource[],
    inProgressId: string,
    callback: (error: any | null, inProgressworkspaceId: string) => {}
  ): void {
    const toInsert = mapToDataSourceQueryResult(dataSources, inProgressId);
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
        'referencelink',
        'strengthofevidence',
        'uncertainty'
      ],
      {table: 'inprogressdatasource'}
    );
    const query = pgp.helpers.insert(toInsert, columns);
    client.query(query, [], (error: any): void => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, inProgressId);
      }
    });
  }

  function createInProgressAlternatives(
    client: PoolClient,
    alternatives: IAlternative[],
    inProgressId: string,
    callback: (error: any | null, inProgressId: string) => {}
  ): void {
    const toInsert = mapToAlternativeQueryResult(alternatives, inProgressId);
    const columns = new pgp.helpers.ColumnSet(
      ['id', 'orderindex', 'inprogressworkspaceid', 'title'],
      {table: 'inprogressalternative'}
    );
    const query = pgp.helpers.insert(toInsert, columns);
    client.query(query, [], (error: any): void => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, inProgressId);
      }
    });
  }

  function get(
    inProgressId: string,
    callback: (error: any, result: IInProgressMessage) => void
  ): void {
    db.runInTransaction(
      _.partial(getTransaction, inProgressId),
      (
        error: any,
        results: [
          IWorkspaceProperties,
          ICriterion[],
          IAlternative[],
          IDataSource[],
          [
            Record<string, Record<string, Effect>>,
            Record<string, Record<string, Distribution>>
          ]
        ]
      ): void => {
        if (error) {
          callback(error, null);
        } else {
          callback(null, mapCombinedResults(results));
        }
      }
    );
  }

  function getTransaction(
    inProgressId: string,
    client: PoolClient,
    transactionCallback: (
      error: any,
      results: [
        IWorkspaceProperties,
        ICriterion[],
        IAlternative[],
        IDataSource[],
        [
          Record<string, Record<string, Effect>>,
          Record<string, Record<string, Distribution>>
        ]
      ]
    ) => void
  ): void {
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
    inProgressId: string,
    client: PoolClient,
    callback: (error: any, inProgressWorkspace: IWorkspaceProperties) => void
  ): void {
    const query = 'SELECT * FROM inProgressWorkspace WHERE id=$1';
    client.query(
      query,
      [inProgressId],
      (error: any, result: QueryResult<IWorkspaceQueryResult>): void => {
        if (error) {
          callback(error, null);
        } else {
          callback(null, mapWorkspace(result.rows[0]));
        }
      }
    );
  }

  function getCriteria(
    inProgressId: string,
    client: PoolClient,
    callback: (error: any, criteria: ICriterion[]) => void
  ): void {
    const query =
      'SELECT * FROM inProgressCriterion WHERE inProgressWorkspaceId=$1';
    client.query(
      query,
      [inProgressId],
      (error: any, result: QueryResult<ICriterionQueryResult>): void => {
        if (error) {
          callback(error, null);
        } else {
          callback(null, mapCriteria(result.rows));
        }
      }
    );
  }

  function getAlternatives(
    inProgressId: string,
    client: PoolClient,
    callback: (error: any, alternatives: IAlternative[]) => void
  ): void {
    const query =
      'SELECT * FROM inProgressAlternative WHERE inProgressWorkspaceId=$1';
    client.query(
      query,
      [inProgressId],
      (error: any, result: QueryResult<IAlternativeQueryResult>): void => {
        if (error) {
          callback(error, null);
        } else {
          callback(null, mapAlternatives(result.rows));
        }
      }
    );
  }

  function getDataSources(
    inProgressId: string,
    client: PoolClient,
    callback: (error: any, dataSources: IDataSource[]) => void
  ): void {
    const query =
      'SELECT * FROM inProgressDataSource WHERE inProgressWorkspaceId=$1';
    client.query(
      query,
      [inProgressId],
      (error: any, result: QueryResult<IDataSourceQueryResult>): void => {
        if (error) {
          callback(error, null);
        } else {
          callback(null, mapDataSources(result.rows));
        }
      }
    );
  }

  function getInProgressValues(
    inProgressId: string,
    client: PoolClient,
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
      (error: any, result: QueryResult<IValueCellQueryResult>): void => {
        if (error) {
          callback(error, null);
        } else {
          callback(null, mapCellValues(result.rows));
        }
      }
    );
  }

  function updateWorkspace(
    {title, therapeuticContext, useFavourability, id}: IWorkspaceProperties,
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
      unitOfMeasurement,
      referenceLink
    }: IDataSourceCommand,
    callback: (error: any) => void
  ): void {
    const query = `INSERT INTO inProgressDataSource 
                  (id, inProgressWorkspaceId, criterionId, orderIndex, reference, strengthOfEvidence, uncertainty, unitLabel, unitType, unitLowerBound, unitUpperBound, referenceLink) 
                  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                  ON CONFLICT (id)
                  DO UPDATE
                  SET (orderIndex, reference, strengthOfEvidence, uncertainty, unitLabel, unitType, unitLowerBound, unitUpperBound, referenceLink) = ($4, $5, $6, $7, $8, $9, $10, $11, $12)`;
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
        unitOfMeasurement.upperBound,
        referenceLink
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
    callback: (error: OurError) => void
  ): void {
    const query = buildUpsertCellsQuery(cellCommands);
    db.query(query, [], callback);
  }

  function upsertCellsInTransaction(
    client: PoolClient,
    cellCommands: ICellCommand[],
    inProgressworkspaceId: number,
    callback: (error: OurError, inProgressworkspaceId: number) => void
  ): void {
    const query = buildUpsertCellsQuery(cellCommands);
    client.query(query, [], (error: OurError): void => {
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
    inProgressId: string,
    inProgressMessage: IInProgressMessage,
    callback: (error: any, createdId: string) => void
  ): void {
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
    inProgressId: string,
    inProgressMessage: IInProgressMessage,
    client: PoolClient,
    transactionCallback: (error: any, createdId: string) => void
  ): void {
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
    client: PoolClient,
    userId: string,
    problem: IProblem,
    callback: (error: any | null, workspaceId: number) => void
  ): void {
    const query = `INSERT INTO workspace (owner, title, problem) 
                   VALUES ($1, $2, $3) 
                   RETURNING id`;
    client.query(
      query,
      [userId, problem.title, problem],
      (error: any, result: QueryResult<{id: string}>): void => {
        callback(error, error || result.rows[0].id);
      }
    );
  }

  function deleteInTransaction(
    client: PoolClient,
    inProgressId: string,
    callback: (error: any) => void
  ): void {
    del(client, inProgressId, callback);
  }

  function deleteDirectly(
    inProgressId: string,
    callback: (error: any) => void
  ): void {
    del(db, inProgressId, callback);
  }

  function del(
    clientOrDB: ClientOrDB,
    inProgressId: string,
    callback: (error: any) => void
  ): void {
    const query = 'DELETE FROM inprogressworkspace WHERE id=$1';
    clientOrDB.query(query, [inProgressId], callback);
  }

  function query(
    ownerId: number,
    callback: (error: OurError, result: IWorkspaceProperties[]) => void
  ): void {
    const query = 'SELECT id, title FROM inProgressWorkspace WHERE owner = $1';
    db.query(
      query,
      [ownerId],
      (error: OurError, result: QueryResult<IWorkspaceProperties>): void => {
        callback(error, error ? null : result.rows);
      }
    );
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
