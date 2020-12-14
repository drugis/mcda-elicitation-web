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
