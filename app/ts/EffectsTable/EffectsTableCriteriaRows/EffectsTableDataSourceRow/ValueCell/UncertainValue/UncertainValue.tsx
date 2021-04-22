import {useStyles} from 'app/ts/McdaApp/McdaApp';
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
  const classes = useStyles();
  return (
    <>
      <div className={classes.textCenter}>{value}</div>
      <div className={classes.uncertain}>
        {lowerBound}, {upperBound}
      </div>
    </>
  );
}
