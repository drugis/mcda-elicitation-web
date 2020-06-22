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
    client: any,
    ownerId: string,
    transactionCallback: (error: any, createdId: string) => void
  ) {
    waterfall(
      [
        _.partial(createInProgressWorkspace, client, ownerId),
        _.partial(createInProgressCriteria, client)
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
         VALUES ($1, "{}", true) 
       RETURNING id`;
    client.query(query, [ownerId], function (
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
        orderIndex: 0,
        isFavourable: true,
        title: 'crit 1',
        description: ''
      },
      {
        id: generateUuid(),
        orderIndex: 1,
        isFavourable: false,
        title: 'crit 2',
        description: ''
      }
    ];
    const columns = new pgp.helpers.ColumnSet([
      'id',
      'orderIndex',
      'isFavourable',
      'title',
      'description'
    ]);
    const query = pgp.helpers.insert(toCreate, columns) + ' RETURNING id';
    client.query(query, [], (error: any, result: any) => {
      if (error) {
        callback(error, null, null);
      } else {
        callback(null, inProgressworkspaceId, _.map(result.rows, 'id'));
      }
    });
  }

  return {
    create: create
  };
}
