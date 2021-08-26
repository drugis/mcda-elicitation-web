import React from 'react';

export default function ShowIf({
  condition,
  children
}: {
  condition: Boolean;
  children: any;
}): JSX.Element {
  return condition ? children : <></>;
}
