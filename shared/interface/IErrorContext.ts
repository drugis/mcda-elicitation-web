import {OurError} from './IError';

export default interface IErrorContext {
  error: string | undefined;
  setError: (error: OurError) => void;
  setErrorMessage: (message: string) => void;
}
