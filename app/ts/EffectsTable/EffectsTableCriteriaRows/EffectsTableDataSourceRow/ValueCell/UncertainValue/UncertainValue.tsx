import {textCenterStyle, uncertainStyle} from 'app/ts/McdaApp/styles';

export default function UncertainValue({
  value,
  lowerBound,
  upperBound
}: {
  value: number;
  lowerBound: number;
  upperBound: number;
}) {
  return (
    <>
      <div style={textCenterStyle}>{value}</div>
      <div style={uncertainStyle}>
        {lowerBound}, {upperBound}
      </div>
    </>
  );
}
