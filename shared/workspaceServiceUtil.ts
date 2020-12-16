import _ from 'lodash';

export function applyOrdering<T extends {id: string}>(
  ordering: string[] | undefined,
  objectsToOrder: T[]
): T[] {
  return _.sortBy(objectsToOrder, (object) => _.indexOf(ordering, object.id));
}
