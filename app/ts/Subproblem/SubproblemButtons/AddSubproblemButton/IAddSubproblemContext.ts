export default interface IAddSubproblemContext {
  title: string;
  errors: string[];
  isAlternativeDisabled: (id: string) => boolean;
  setTitle: (title: string) => void;
  updateAlternativeInclusion: (id: string, newValue: boolean) => void;
}
