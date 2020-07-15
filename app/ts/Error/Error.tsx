import React, {useContext} from 'react';
import {ErrorContext} from './ErrorContext';

export default function Error() {
  const {error} = useContext(ErrorContext);

  return (
    <div id="error">
      <pre>{error}</pre>
    </div>
  );
}
