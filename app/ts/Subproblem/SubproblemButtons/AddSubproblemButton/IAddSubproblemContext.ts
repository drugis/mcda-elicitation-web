export default interface IAddSubproblemContext {
  title: string;
  errors: string[];
  setTitle: (title: string) => void;
}
