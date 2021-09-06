import {
  getGammaAlphaError,
  getGammaBetaError
} from '../../../../../../../../CellValidityService/CellValidityService';
import AlphaValueInput from '../AlphaValueInput/AlphaValueInput';
import BetaValueInput from '../BetaValueInput/BetaValueInput';

export default function GammaInput() {
  return (
    <>
      <AlphaValueInput getAlphaError={getGammaAlphaError} />
      <BetaValueInput getBetaError={getGammaBetaError} />
    </>
  );
}
