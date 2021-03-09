import keycode from 'keycode';
import {KeyboardEvent} from 'react';

export default function createEnterHandler(
  callback: () => void,
  isBlocked: () => boolean
): (event: KeyboardEvent<HTMLDivElement>) => void {
  return (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.keyCode === keycode('enter') && !isBlocked()) {
      callback();
      event.preventDefault();
      event.stopPropagation();
    }
  };
}
