import React, {useContext} from 'react';
import {ErrorContext} from './ErrorContext';

export default function Error() {
  const {error} = useContext(ErrorContext);
  //FIXME styling
  return (
    <div id="error">
      <pre>{error}</pre>
    </div>
  );
}
