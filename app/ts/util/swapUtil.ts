import _ from 'lodash';

export function getNextId<T extends {id: string}>(
  index: number,
  items: T[]
): string | undefined {
  return getNullSafeId(items[index + 1]);
}

export function getPreviousId<T extends {id: string}>(
  index: number,
  items: T[]
): string | undefined {
  return getNullSafeId(items[index - 1]);
}

function getNullSafeId<T extends {id: string}>(item: T): string | undefined {
  return item ? item.id : undefined;
}

export function swapItems<T>(id1: string, id2: string, items: T[]): T[] {
  const index1 = _.findIndex(items, ['id', id1]);
  const index2 = _.findIndex(items, ['id', id2]);
  let itemsCopy = _.cloneDeep(items);
  // ES6 swap trick below, don't even worry about it
  [itemsCopy[index1], itemsCopy[index2]] = [
    itemsCopy[index2],
    itemsCopy[index1]
  ];
  return itemsCopy;
}
