import IHelpInfo from './IHelpInfo';

export default interface IHelpContext {
  getHelpInfo: (id: string) => IHelpInfo;
}
