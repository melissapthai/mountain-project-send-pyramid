'use strict';

import Chart from 'chart.js/auto';

import * as ChartUtils from './utils/chartUtils.js';
import {
  BOULDER_GRADES,
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
  const boundaries = tc.getGradeBoundaries(routeType);
  const grades =
    routeType == ROUTE_TYPES.boulder
      ? BOULDER_GRADES.slice(boundaries.minIndex, boundaries.maxIndex + 1)
      : ROUTE_GRADES.slice(boundaries.minIndex, boundaries.maxIndex + 1);

  let datasets = [];
  for (let sendStyle of Object.values(SENDS)) {
    const data = tc.getNumTicksForSendStyleAndGrade(
      routeType,
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

const renderChart = (canvasId, routeType, ticksCollection) => {
  const chartConfig = generateChartConfig(ticksCollection, routeType);
  return new Chart(document.getElementById(canvasId), chartConfig);
};

export default renderChart;
