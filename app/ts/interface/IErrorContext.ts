export default interface IErrorContext {
  error: string | undefined;
  setError: (error: string) => void;
}
