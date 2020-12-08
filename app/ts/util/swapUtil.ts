export function getNextId<T extends {id: string}>(
  index: number,
  items: T[]
): string | undefined {
  return index < items.length - 1 ? items[index + 1].id : undefined;
}

export function getPreviousId<T extends {id: string}>(
  index: number,
  items: T[]
): string | undefined {
  return index ? items[index - 1].id : undefined;
}
