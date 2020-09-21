import {KeyboardEvent} from 'react';

export default function createEnterHandler(
  callback: () => void,
  isBlocked: () => boolean
): (event: KeyboardEvent<HTMLDivElement>) => void {
  return (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.keyCode === 13 && !isBlocked()) {
      callback();
      event.preventDefault();
      event.stopPropagation();
    }
  };
}
