import IAlternative from '@shared/interface/IAlternative';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import _ from 'lodash';
import {useContext} from 'react';
import {LegendContext} from '../../LegendContext';

export default function LegendTooltip(): JSX.Element {
  const {filteredAlternatives} = useContext(CurrentSubproblemContext);
  const {legendByAlternativeId} = useContext(LegendContext);

  function generateLegendTooltip(
    alternatives: IAlternative[],
    legend: Record<string, string>
  ): JSX.Element {
    if (legend) {
      return (
        <>
          <table className="legend-table">
            <tbody>{buildLegendCells(alternatives, legend)}</tbody>
          </table>
          <div>Click to change</div>
        </>
      );
    } else {
      return (
        <div>
          Please click the button to create aliases for the alternatives to use
          in plots
        </div>
      );
    }
  }

  function buildLegendCells(
    alternatives: IAlternative[],
    legend: Record<string, string>
  ): JSX.Element[] {
    return _.map(alternatives, (alternative: IAlternative) => {
      return (
        <tr key={alternative.id}>
          <td>
            <b>{legend[alternative.id]}</b>:
          </td>
          <td>{alternative.title}</td>
        </tr>
      );
    });
  }

  return generateLegendTooltip(filteredAlternatives, legendByAlternativeId);
}
