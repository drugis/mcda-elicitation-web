import _ from 'lodash';
import {useState} from 'react';

type TSortProperty = 'title' | 'creationDate';
type TSortDirection = 'asc' | 'desc';

export default function useSorting<T>(
  items: T[],
  updateItems: (sortedItems: T[]) => void
): [
  orderBy: TSortProperty,
  orderDirection: TSortDirection,
  orderByProperty: (propertyToOrder: TSortProperty, event: any) => void
] {
  const [orderBy, setOrderBy] = useState<TSortProperty>('title');
  const [orderDirection, setOrderDirection] = useState<TSortDirection>('asc');

  function orderByProperty(propertyToOrder: TSortProperty, event: any): void {
    const newWorkspaces = _.sortBy(items, [propertyToOrder]);
    if (orderBy === propertyToOrder) {
      orderBySameProperty(newWorkspaces);
    } else {
      orderByOtherProperty(propertyToOrder, newWorkspaces);
    }
  }

  function orderBySameProperty(newWorkspaces: T[]): void {
    if (orderDirection === 'desc') {
      setOrderDirection('asc');
      updateItems(newWorkspaces);
    } else {
      setOrderDirection('desc');
      updateItems(newWorkspaces.reverse());
    }
  }

  function orderByOtherProperty(
    propertyToOrder: TSortProperty,
    newWorkspaces: T[]
  ): void {
    setOrderBy(propertyToOrder);
    updateItems(newWorkspaces);
    setOrderDirection('asc');
  }

  return [orderBy, orderDirection, orderByProperty];
}
