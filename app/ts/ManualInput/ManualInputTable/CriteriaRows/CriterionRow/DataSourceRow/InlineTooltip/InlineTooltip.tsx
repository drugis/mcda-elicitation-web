import React from 'react';
import './style.css';

export default function InlineTooltip() {
  return (
    <div
      className="inline-tooltip-container"
      style={{
        width: 'inherit',
        height: 15,
        textAlign: 'center'
      }}
    >
      <span className="inline-tooltip">click to edit</span>
    </div>
  );
}
