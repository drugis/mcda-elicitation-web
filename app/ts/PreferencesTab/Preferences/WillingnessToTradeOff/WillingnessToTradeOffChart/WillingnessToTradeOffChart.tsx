import IUnitOfMeasurement from '@shared/interface/IUnitOfMeasurement';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import {ChartConfiguration, generate} from 'c3';
import {format} from 'd3';
import _ from 'lodash';
import React, {useEffect, useState} from 'react';

export default function WillingnessToTradeOffChart({
  firstCriterion,
  secondCriterion
}: {
  firstCriterion: IProblemCriterion;
  secondCriterion: IProblemCriterion;
}) {
  const [xCoordinate, setXCoordinate] = useState(
    firstCriterion.dataSources[0].pvf.range[0]
  );
  const [yCoordinate, setYCoordinate] = useState(
    secondCriterion.dataSources[0].pvf.range[0]
  );

  useEffect(() => {
    const settings: ChartConfiguration = {
      bindto: '#willingness-to-trade-off-chart',
      point: {
        r: getRadius
      },
      data: {
        xs: {
          firstPoint: 'firstPoint_x',
          line: 'line_x',
          secondPoint: 'secondPoint_x'
        },
        columns: [],
        type: 'scatter',
        types: {
          line: 'line'
        },
        names: {
          firstPoint: 'Outcome A',
          line: 'Indifference curve',
          secondPoint: 'Outcome B'
        }
      },
      legend: {item: {onclick: function () {}}},
      axis: {
        x: {
          tick: {
            fit: false,
            format: _.partial(
              formatAxis,
              firstCriterion.dataSources[0].unitOfMeasurement
            )
          },
          min: firstCriterion.dataSources[0].pvf.range[0],
          max: firstCriterion.dataSources[0].pvf.range[0],
          label: getLabel(firstCriterion),
          padding: {
            left: 0,
            right: 0
          }
        },
        y: {
          min: secondCriterion.dataSources[0].pvf.range[0],
          max: secondCriterion.dataSources[0].pvf.range[1],
          default: [
            secondCriterion.dataSources[0].pvf.range[0],
            secondCriterion.dataSources[0].pvf.range[1]
          ],
          tick: {
            format: _.partial(
              formatAxis,
              secondCriterion.dataSources[0].unitOfMeasurement
            )
          },
          label: getLabel(secondCriterion),
          padding: {
            top: 0,
            bottom: 0
          }
        }
      }
    };
    generate(settings);
  });

  function formatAxis(unitOfMeasurement: IUnitOfMeasurement, value: number) {
    const numberFormatter = format('.2f');
    // if (unitOfMeasurement.type === UnitOfMeasurementType.decimal && true) {
    //   // FIXME percentification
    //   return numberFormatter(value * 100);
    // } else {
    return numberFormatter(value);
    // }
  }

  function getRadius(point: any) {
    return point.id === 'line' ? 0 : 8;
  }

  function getLabel(criterion: IProblemCriterion) {
    const unitText = getUnitText(criterion);
    return criterion.title + unitText;
  }

  function getUnitText(criterion: IProblemCriterion) {
    const unit = criterion.dataSources[0].unitOfMeasurement.label;
    return unit === '' ? unit : ` ( + ${unit} + )`;
  }

  return (
    <div
      style={{width: '500px', height: '500px'}}
      id="willingness-to-trade-off-chart:"
    />
  );
}
