import {waterfall} from 'async';
import _ from 'lodash';
import pgPromise, {IMain} from 'pg-promise';
import {generateUuid} from '../app/js/manualInput/ManualInput/ManualInputService/ManualInputService';

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
    callback: (error: any, inProgressWorkspace: any) => void
  ) {}

  return {
    create: create,
    get: get
  };
}
