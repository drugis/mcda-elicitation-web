import {parallel, waterfall} from 'async';
import _ from 'lodash';
import pgPromise, {IMain} from 'pg-promise';
import {generateUuid} from '../app/js/manualInput/ManualInput/ManualInputService/ManualInputService';
import IWorkspaceQueryResult from '../app/js/interface/IWorkspaceQueryResult';
import ICriterion from '../app/js/interface/ICriterion';
import ICriterionQueryResult from '../app/js/interface/ICriterionQueryResult';
import IAlternative from '../app/js/interface/IAlternative';
import IAlternativeQueryResult from '../app/js/interface/IAlternativeQueryResult';
import IDataSource from '../app/js/interface/IDataSource';
import IDataSourceQueryResult from '../app/js/interface/IDataSourceQueryResult';
import IUnitOfMeasurement from '../app/js/interface/IUnitOfMeasurement';

export default function InProgressWorkspaceRepository(db: any) {
  const pgp: IMain = pgPromise();

  function create(
    userId: string,
    callback: (error: any, createdId: string) => void
  ) {
    db.runInTransaction(
      _.partial(createInProgressWorkspaceTransaction, userId),
      callback
    );
  }

  function createInProgressWorkspaceTransaction(
    ownerId: string,
    client: any,
    transactionCallback: (error: any, createdId: string) => void
  ) {
    waterfall(
      [
        _.partial(createInProgressWorkspace, client, ownerId),
        _.partial(createInProgressCriteria, client),
        _.partial(createInProgressDataSources, client),
        _.partial(createInProgressAlternatives, client)
      ],
      transactionCallback
    );
  }

  function createInProgressWorkspace(
    client: any,
    ownerId: string,
    callback: (error: any, createdId: string) => {}
  ) {
    const query = `INSERT INTO inProgressWorkspace (owner, state, useFavourability) 
         VALUES ($1, $2, true) 
       RETURNING id`;
    client.query(query, [ownerId, {}], function (
      error: any,
      result: {rows: any[]}
    ) {
      callback(error, error || result.rows[0].id);
    });
  }

  function createInProgressCriteria(
    client: any,
    inProgressworkspaceId: string,
    callback: (
      error: any | null,
      inProgressworkspaceId: string,
      createdCriteriaIds: string[]
    ) => {}
  ) {
    const toCreate = [
      {
        id: generateUuid(),
        orderindex: 0,
        isfavourable: true,
        title: 'crit 1',
        description: '',
        inprogressworkspaceid: inProgressworkspaceId
      },
      {
        id: generateUuid(),
        orderindex: 1,
        isfavourable: false,
        title: 'crit 2',
        description: '',
        inprogressworkspaceid: inProgressworkspaceId
      }
    ];
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
    const query = pgp.helpers.insert(toCreate, columns) + ' RETURNING id';
    client.query(query, [], (error: any, result: any) => {
      if (error) {
        callback(error, null, null);
      } else {
        callback(null, inProgressworkspaceId, _.map(result.rows, 'id'));
      }
    });
  }

  function createInProgressDataSources(
    client: any,
    inProgressworkspaceId: string,
    criterionIds: string[],
    callback: (error: any | null, inProgressworkspaceId: string) => {}
  ) {
    const toCreate = [
      {
        id: generateUuid(),
        orderindex: 0,
        criterionid: criterionIds[0],
        inprogressworkspaceid: inProgressworkspaceId
      },
      {
        id: generateUuid(),
        orderindex: 0,
        criterionid: criterionIds[1],
        inprogressworkspaceid: inProgressworkspaceId
      }
    ];
    const columns = new pgp.helpers.ColumnSet(
      ['id', 'orderindex', 'criterionid', 'inprogressworkspaceid'],
      {table: 'inprogressdatasource'}
    );
    const query = pgp.helpers.insert(toCreate, columns);
    client.query(query, [], (error: any, result: any) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, inProgressworkspaceId);
      }
    });
  }

  function createInProgressAlternatives(
    client: any,
    inProgressworkspaceId: string,
    callback: (error: any | null, inProgressworkspaceId: string) => {}
  ) {
    const toCreate = [
      {
        id: generateUuid(),
        orderindex: 0,
        inprogressworkspaceid: inProgressworkspaceId,
        title: 'alternative 1'
      },
      {
        id: generateUuid(),
        orderindex: 0,
        inprogressworkspaceid: inProgressworkspaceId,
        title: 'alternative 2'
      }
    ];
    const columns = new pgp.helpers.ColumnSet(
      ['id', 'orderindex', 'inprogressworkspaceid', 'title'],
      {table: 'inprogressalternative'}
    );
    const query = pgp.helpers.insert(toCreate, columns);
    client.query(query, [], (error: any, result: any) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, inProgressworkspaceId);
      }
    });
  }
  function get(
    inProgressId: string,
    callback: (error: any, result: any) => void
  ): void {
    db.runInTransaction(
      _.partial(getTransaction, inProgressId),
      (error: any, results: any[]) => {
        if (error) {
          callback(error, null);
        } else {
          combineResults(results);
        }
      }
    );
  }
  function combineResults(bla: any[]) {
    return {};
  }

  function getTransaction(
    inProgressId: string,
    client: any,
    transactionCallback: (error: any, results: any[]) => void
  ) {
    parallel(
      [
        _.partial(getWorkspace, inProgressId, client),
        _.partial(getCriteria, inProgressId, client),
        _.partial(getAlternatives, inProgressId, client),

        _.partial(getDataSources, inProgressId, client)
        // _.partial(getInprogressValues, inProgressId, client)
      ],
      transactionCallback
    );
  }
  function getWorkspace(
    inProgressId: string,
    client: any,
    callback: (error: any, inProgressWorkspace: any) => void
  ): void {
    const query = 'SELECT * FROM inProgressWorkspaces WHERE id=$1';
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

  function mapWorkspace(queryResult: IWorkspaceQueryResult) {
    return {
      id: queryResult.id,
      title: queryResult.title,
      therapeuticContext: queryResult.therapeuticcontext,
      useFavourability: queryResult.usefavourability
    };
  }

  function getCriteria(
    inProgressId: string,
    client: any,
    callback: (error: any, criteria: any) => void
  ): void {
    const query = 'SELECT * FROM inProgressCriteria WHERE id=$1';
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

  function mapCriteria(criteria: ICriterionQueryResult[]): ICriterion[] {
    return _.map(criteria, (queryCriterion) => {
      return {
        id: queryCriterion.id,
        orderIndex: queryCriterion.orderindex,
        title: queryCriterion.title,
        description: queryCriterion.description,
        isFavourable: queryCriterion.isfavourable,
        dataSources: []
      };
    });
  }

  function getAlternatives(
    inProgressId: string,
    client: any,
    callback: (error: any, alternatives: any) => void
  ): void {
    const query = 'SELECT * FROM inProgressAlternatives WHERE id=$1';
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

  function mapAlternatives(
    alternatives: IAlternativeQueryResult[]
  ): IAlternative[] {
    return _.map(alternatives, (queryAlternative) => {
      return {
        id: queryAlternative.id,
        title: queryAlternative.title,
        orderIndex: queryAlternative.orderindex
      };
    });
  }

  function getDataSources(
    inProgressId: string,
    client: any,
    callback: (error: any, dataSources: any) => void
  ) {
    const query = 'SELECT * FROM inProgressDataSources WHERE id=$1';
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

  function mapDataSources(
    dataSources: IDataSourceQueryResult[]
  ): IDataSource[] {
    return _.map(dataSources, (queryDataSource) => {
      return {
        id: queryDataSource.id,
        orderIndex: queryDataSource.orderindex,
        reference: queryDataSource.reference,
        uncertainty: queryDataSource.uncertainty,
        strengthOfEvidence: queryDataSource.strengthofevidence,
        unitOfMeasurement: {
          label: queryDataSource.unitlabel,
          type: queryDataSource.unittype,
          lowerBound: queryDataSource.unitlowerbound,
          upperBound: queryDataSource.unitupperbound
        }
      };
    });
  }

  return {
    create: create,
    get: get
  };
}
