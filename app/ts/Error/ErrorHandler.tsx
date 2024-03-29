import {useContext} from 'react';
import ShowIf from '../ShowIf/ShowIf';
import Error from './Error';
import {ErrorContext} from './ErrorContext';

export default function ErrorHandler({children}: any) {
  const {error} = useContext(ErrorContext);
  return (
    <span>
      {children}
      {
        <ShowIf condition={Boolean(error)}>
          <Error />
        </ShowIf>
      }
    </span>
  );
}
