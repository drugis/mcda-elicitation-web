export default interface ICriterion {
  id: string;
  title: string;
  description: string;
  isFavourable: boolean;
  unitOfMeasurement: string;
  dataSources: [];
}
