import Chart from 'chart.js/auto';

import * as ChartUtils from './chartUtils';
import { CLIMBING_CHART_ID, ROUTE_GRADES, SENDS } from './constants.js';

const VALUES = ROUTE_GRADES.map(() => Math.floor(Math.random() * 11));

const NUMBER_CFG = {
  count: ROUTE_GRADES.length,
  min: Math.min(...VALUES),
  max: Math.max(...VALUES),
};

const SEND_TYPE_TO_COLOR = {};
SEND_TYPE_TO_COLOR[SENDS.onsight] = ChartUtils.CHART_COLORS.blue;
SEND_TYPE_TO_COLOR[SENDS.flash] = ChartUtils.CHART_COLORS.yellow;
SEND_TYPE_TO_COLOR[SENDS.redpoint] = ChartUtils.CHART_COLORS.red;
SEND_TYPE_TO_COLOR[SENDS.pinkpoint] = ChartUtils.CHART_COLORS.pink;

const generateSportDatasets = (data) => {
  const datasets = [];

  for (const key in SEND_TYPE_TO_COLOR) {
    datasets.push({
      label: key,
      data: ChartUtils.numbers(NUMBER_CFG),
      borderColor: SEND_TYPE_TO_COLOR[key],
      backgroundColor: ChartUtils.transparentize(SEND_TYPE_TO_COLOR[key], 0.5),
    });
  }

  return datasets;
};

// TODO: create data for trad and boulder sends too.
const generateSportChartConfig = (data) => {
  console.log(data[0]);
  console.log(data[1]);
  console.log(data[2]);
  const datasets = generateSportDatasets(data);

  const sportChartData = {
    labels: ROUTE_GRADES,
    datasets,
  };

  const sportChartConfig = {
    type: 'bar',
    data: sportChartData,
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

  return sportChartConfig;
};

// TODO: create chart with data as parameter, instead of random numbers.
const createChart = (data) => {
  const sportChartConfig = generateSportChartConfig(data);

  return new Chart(
    document.getElementById(CLIMBING_CHART_ID),
    sportChartConfig
  );
};

export default createChart;
