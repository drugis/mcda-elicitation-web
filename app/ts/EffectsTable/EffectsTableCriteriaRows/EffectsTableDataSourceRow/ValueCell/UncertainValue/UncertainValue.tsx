import React from 'react';

export default function UncertainValue({
  value,
  lowerBound,
  upperBound
}: {
  value: string;
  lowerBound: string;
  upperBound: string;
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
