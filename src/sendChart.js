'use strict';

import Chart from 'chart.js/auto';

import * as ChartUtils from './utils/chartUtils';
import { preprocessData } from './utils/dataUtils.js';
import {
  BOULDER_GRADES,
  CLIMBING_CHART_ID,
  ROUTE_GRADES,
  ROUTE_TYPES,
  SENDS,
} from './constants.js';

const SEND_TYPE_TO_COLOR = {};
SEND_TYPE_TO_COLOR[SENDS.onsight] = ChartUtils.CHART_COLORS.blue;
SEND_TYPE_TO_COLOR[SENDS.flash] = ChartUtils.CHART_COLORS.yellow;
SEND_TYPE_TO_COLOR[SENDS.send] = ChartUtils.CHART_COLORS.green;
SEND_TYPE_TO_COLOR[SENDS.redpoint] = ChartUtils.CHART_COLORS.red;
SEND_TYPE_TO_COLOR[SENDS.pinkpoint] = ChartUtils.CHART_COLORS.pink;

const generateChartConfig = (tc, routeType) => {
  let grades = [];
  let datasets = [];
  let boundaries = {};

  switch (routeType) {
    case ROUTE_TYPES.boulder:
      boundaries = tc.getBoulderGradeBoundaries();
      grades = BOULDER_GRADES.slice(
        boundaries.minIndex,
        boundaries.maxIndex + 1
      );

      for (let sendStyle of Object.values(SENDS)) {
        const data = tc.getNumBoulderTicksForSendStyleAndGrades(
          sendStyle,
          grades
        );
        const dataset = {
          label: sendStyle,
          data,
          borderColor: SEND_TYPE_TO_COLOR[sendStyle],
          backgroundColor: ChartUtils.transparentize(
            SEND_TYPE_TO_COLOR[sendStyle],
            0.5
          ),
        };
        datasets.push(dataset);
      }

      break;
    case ROUTE_TYPES.sport:
      boundaries = tc.getSportGradeBoundaries();
      grades = ROUTE_GRADES.slice(boundaries.minIndex, boundaries.maxIndex + 1);

      for (let sendStyle of Object.values(SENDS)) {
        const data = tc.getNumSportTicksForSendStyleAndGrades(
          sendStyle,
          grades
        );
        const dataset = {
          label: sendStyle,
          data,
          borderColor: SEND_TYPE_TO_COLOR[sendStyle],
          backgroundColor: ChartUtils.transparentize(
            SEND_TYPE_TO_COLOR[sendStyle],
            0.5
          ),
        };
        datasets.push(dataset);
      }

      break;
    case ROUTE_TYPES.trad:
      boundaries = tc.getTradGradeBoundaries();
      grades = ROUTE_GRADES.slice(boundaries.minIndex, boundaries.maxIndex + 1);

      for (let sendStyle of Object.values(SENDS)) {
        const data = tc.getNumTradTicksForSendStyleAndGrades(sendStyle, grades);
        const dataset = {
          label: sendStyle,
          data,
          borderColor: SEND_TYPE_TO_COLOR[sendStyle],
          backgroundColor: ChartUtils.transparentize(
            SEND_TYPE_TO_COLOR[sendStyle],
            0.5
          ),
        };
        datasets.push(dataset);
      }

      break;
    default:
      console.error(
        'Mountain Project - Send Chart extension: Unable to generate chart configuration!'
      );
  }

  const data = { labels: grades, datasets };

  const chartConfig = {
    type: 'bar',
    data,
    options: {
      indexAxis: 'y',
      elements: {
        bar: {
          borderWidth: 2,
        },
      },
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
      plugins: {
        legend: {
          position: 'right',
        },
      },
    },
  };

  return chartConfig;
};
//   const cleanedData = cleanData(data);
//   const sportChartConfig = generateSportChartConfig(cleanedData);

//   return new Chart(
//     document.getElementById(CLIMBING_CHART_ID),
//     sportChartConfig
//   );
// };

const renderChart = (data, routeType) => {
  const ticksCollection = preprocessData(data);
  const chartConfig = generateChartConfig(ticksCollection, routeType);

  return new Chart(document.getElementById(CLIMBING_CHART_ID), chartConfig);
};

export default renderChart;
