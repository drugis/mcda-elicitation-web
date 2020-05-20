import React, {useContext} from 'react';
import {ErrorContext} from './ErrorContext';

export default function Error() {
  const {error} = useContext(ErrorContext);

  return (
    <div>
      <h3>Error</h3>
      <p>Unfortunately an error has occurred:</p>
      <pre>{error}</pre>
      <p>
        Please contact the developers at 'info@drugis.org' with a description of
        your actions up to this point and the error message above.
      </p>
    </div>
  );
}
