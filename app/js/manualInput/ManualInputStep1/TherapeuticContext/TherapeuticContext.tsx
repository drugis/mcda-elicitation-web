import React, {useContext} from 'react';
import {ManualInputContext} from '../../ManualInputContext';

export default function TherapeuticContext() {
  const {therapeuticContext, setTherapeuticContext} = useContext(
    ManualInputContext
  );

  function handleContextChange(event: {target: {value: string}}) {
    setTherapeuticContext(event.target.value);
  }

  return (
    <div>
      <label>
        Therapeutic context
        <textarea
          id="therapeutic-context"
          value={therapeuticContext}
          rows={5}
          onChange={handleContextChange}
        ></textarea>
      </label>
    </div>
  );
}
