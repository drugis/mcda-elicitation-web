export default interface IManualInputContext {
  title: string;
  therapeuticContext: string;
  useFavourability: boolean;
  setTitle: (title: string) => void;
  setTherapeuticContext: (therapeuticContext: string) => void;
  setUseFavourability: (useFavourability: boolean) => void;
}
