import {useContext} from 'react';
import {SmaaResultsContext} from '../../SmaaResultsContext/SmaaResultsContext';
import CentralWeights from '../CentralWeights/CentralWeights';
import RankAcceptabilities from '../RankAcceptabilities/RankAcceptabilities';
import SmaaWeightsTable from '../SmaaWeightsTable/SmaaWeightsTable';

export default function SmaaResultsDisplay(): JSX.Element {
  const {smaaWeights, ranks, centralWeights} = useContext(SmaaResultsContext);

  return (
    <>
      <SmaaWeightsTable smaaWeights={smaaWeights} />
      <RankAcceptabilities ranks={ranks} />
      <CentralWeights centralWeights={centralWeights} />
    </>
  );
}
