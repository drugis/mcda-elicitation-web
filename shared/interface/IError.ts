export type OurError = IError | null;

export default interface IError {
  type?: string;
  message: string;
  status?: number;
  statusCode?: number;
  err?: {
    message: string;
  };
  response?: {
    data: string;
  };
}
