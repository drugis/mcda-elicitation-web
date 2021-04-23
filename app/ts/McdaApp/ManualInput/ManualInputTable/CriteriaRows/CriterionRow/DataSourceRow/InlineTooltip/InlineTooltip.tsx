import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

export default function InlineTooltip({tooltipText}: {tooltipText: string}) {
  return (
    <Tooltip title={tooltipText}>
      <span
        style={{
          width: 'inherit',
          height: 15,
          textAlign: 'center',
          color: 'grey'
        }}
      >
        click to edit
      </span>
    </Tooltip>
  );
}
