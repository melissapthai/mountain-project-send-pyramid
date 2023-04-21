'use strict';

import Chart from 'chart.js/auto';

import * as ChartUtils from './utils/chartUtils';
import { preprocessData } from './utils/dataUtils.js';
import {
  CLIMBING_CHART_ID,
  PROTECTION_RATINGS,
  ROUTE_GRADES,
  ROUTE_TYPES,
  SENDS,
  STYLES,
} from './constants.js';

const SEND_TYPE_TO_COLOR = {};
SEND_TYPE_TO_COLOR[SENDS.onsight] = ChartUtils.CHART_COLORS.blue;
SEND_TYPE_TO_COLOR[SENDS.flash] = ChartUtils.CHART_COLORS.yellow;
SEND_TYPE_TO_COLOR[SENDS.redpoint] = ChartUtils.CHART_COLORS.red;

const cleanGrade = (grade) => {
  /**
   * Climbing grades sometimes have protection ratings on them, ex: '5.9 R'
    For our purposes, we don't really care about this.

    This method removes the protection rating from the grade if it's present, 
    and returns the cleaned grade.
   */
  const gradeSplit = grade.split(' ');
  if (gradeSplit.length > 1 && PROTECTION_RATINGS.includes(gradeSplit[1])) {
    return gradeSplit[0];
  }

  return grade;
};

const generateSportDatasets = (data) => {
  const sendMap = {};
  Object.values(SENDS).forEach((sendType) => {
    sendMap[sendType] = new Map();
  });

  // Initialize all send counts to 0
  ROUTE_GRADES.forEach((grade) => {
    Object.keys(sendMap).forEach((sendType) => {
      sendMap[sendType].set(grade, 0);
    });
  });

  // For every row in the data, increment the appropriate send count
  data.forEach((row) => {
    const routeType = row['Route Type'];
    const style = row['Style'];
    const leadStyle = row['Lead Style'];

    if (
      routeType.split(',').includes(ROUTE_TYPES.sport) &&
      style == STYLES.lead &&
      Object.keys(sendMap).includes(leadStyle)
    ) {
      const grade = cleanGrade(row['Rating']);
      sendMap[leadStyle].set(grade, sendMap[leadStyle].get(grade) + 1);
    }
  });

  const datasets = [];

  // Retrieve the counts for each send type and construct corresponding datasets
  Object.keys(sendMap).forEach((sendType) => {
    const dataset = {
      label: sendType,
      data: [...sendMap[sendType].values()],
      borderColor: SEND_TYPE_TO_COLOR[sendType],
      backgroundColor: ChartUtils.transparentize(
        SEND_TYPE_TO_COLOR[sendType],
        0.5
      ),
    };
    datasets.push(dataset);
  });

  return datasets;
};

// TODO: create data for trad and boulder sends too.
const generateSportChartConfig = (data) => {
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

const generateChartConfig = (tc, routeType) => {
  // TODO: fixme
  const labels = null;
  const datasets = null;

  const data = { labels, datasets };

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

// TODO: deprecate this
const cleanData = (data) => {
  // Remove rows that don't contain necessary columns
  data = data.filter(
    (row) => row['Route'] && row['Route Type'] && row['Rating']
  );

  // If a route has been climbed multiple times,
  // remove duplicates by preserving only the 'highest' level climb.
  // Onsight > Flash > Redpoint > (everything else)
  const sendSortOrder = [SENDS.onsight, SENDS.flash, SENDS.redpoint];
  data.sort((a, b) => {
    return (
      a['Route'].localeCompare(b['Route']) ||
      Math.max(sendSortOrder.indexOf(a['Lead Style']), 0) -
        Math.max(sendSortOrder.indexOf(b['Lead Style']), 0)
    );
  });

  if (data.length <= 1) {
    return data;
  }

  const cleanedData = [];

  for (let i = 0; i < data.length - 1; i++) {
    if (data[i]['Route'] !== data[i + 1]['Route']) {
      cleanedData.push(data[i]);
    }
  }
  cleanedData.push(data[data.length - 1]);

  return cleanedData;
};

// const renderChart = (data) => {
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
