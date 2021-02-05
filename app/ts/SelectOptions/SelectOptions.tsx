import _ from 'lodash';
import React from 'react';

export default function SelectOptions<T extends {id: string; title: string}>({
  items
}: {
  items: T[];
}): JSX.Element {
  return (
    <>
      {_.map(
        items,
        (item: T): JSX.Element => (
          <option value={item.id} key={item.id}>
            {item.title}
          </option>
        )
      )}
    </>
  );
}
