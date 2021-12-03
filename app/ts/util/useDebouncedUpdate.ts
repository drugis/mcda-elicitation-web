import _ from 'lodash';
import {useCallback} from 'react';

export function useDebouncedUpdate<T>(updater: (x: T) => void, delay: number) {
  return useCallback(_.debounce(updater, delay), []);
}
