import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Add from '@material-ui/icons/Add';

export default function AddScenarioButton() {
  return (
    <Tooltip title="Create clean scenario">
      <IconButton>
        <Add color="primary" />
      </IconButton>
    </Tooltip>
  );
}
