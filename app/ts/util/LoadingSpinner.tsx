import {CircularProgress} from '@material-ui/core';
import React from 'react';

export default function LoadingSpinner({
  children,
  showSpinnerCondition
}: {
  children: any;
  showSpinnerCondition: boolean;
}): JSX.Element {
  return showSpinnerCondition ? <CircularProgress /> : <>{children}</>;
}
