import {CircularProgress} from '@material-ui/core';

export default function LoadingSpinner({
  children,
  showSpinnerCondition
}: {
  children: any;
  showSpinnerCondition: boolean;
}): JSX.Element {
  return showSpinnerCondition ? <CircularProgress /> : <>{children}</>;
}
