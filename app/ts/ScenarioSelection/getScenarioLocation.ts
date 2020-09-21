import _ from 'lodash';

export default function getScenarioLocation(id: string): string {
  const splitLocation = _.split(window.location.toString(), '/scenarios/');
  const tab = _.split(splitLocation[1], '/')[1];
  return `${splitLocation[0]}/scenarios/${id}/${tab}`;
}
