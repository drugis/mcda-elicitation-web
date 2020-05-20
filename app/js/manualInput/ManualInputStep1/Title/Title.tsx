import React, {useContext} from 'react';
import {ManualInputContext} from '../../ManualInputContext';

export default function Title() {
  const {title, setTitle} = useContext(ManualInputContext);

  function handleTitleChange(event: {target: {value: string}}) {
    setTitle(event.target.value);
  }

  return (
    <div>
      <label>
        Workspace title
        <input
          id="workspace-title"
          type="text"
          value={title}
          onChange={handleTitleChange}
          width="100%"
        />
      </label>
    </div>
  );
}
