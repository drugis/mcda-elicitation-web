import React from 'react';

export default function UncertainValue({
  value,
  lowerBound,
  upperBound
}: {
  value: number;
  lowerBound: number;
  upperBound: number;
}) {
  return (
    <>
      <div className="text-centered">{value}</div>
      <div className="uncertain">
        {lowerBound}, {upperBound}
      </div>
    </>
  );
}
