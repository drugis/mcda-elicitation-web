import React, {useContext} from 'react';
import {EquivalentChangeContext} from '../EquivalentChangeContext/EquivalentChangeContext';
import EquivalentChangeRangeStatement from './EquivalentChangeRangeStatement';
import EquivalentChangeValueStatement from './EquivalentChangeValueStatement';

export default function EquivalentChangeStatement(): JSX.Element {
  const {equivalentChangeType} = useContext(EquivalentChangeContext);

  return equivalentChangeType === 'range' ? (
    <EquivalentChangeRangeStatement />
  ) : (
    <EquivalentChangeValueStatement />
  );
}
