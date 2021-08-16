export default interface IChangeableValue<T = number> {
  originalValue: T;
  currentValue: T;
}
