import React from 'react';

export default function ShowIf({
  condition,
  children
}: {
  condition: boolean;
  children: any;
}): JSX.Element {
  return condition ? children : <></>;
}
