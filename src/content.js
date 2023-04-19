'use strict';

import './content.css';
import Papa from 'papaparse';

import createChart from './createChart';
import { CLIMBING_CHART_ID } from './constants.js';

const isProfilePage = () => {
  // MP profile page url looks like this:
  // https://www.mountainproject.com/user/<user id>/<user name>
  // We only want to display the climbing chart if we're on a profile page.
  // Do not display on a non-profile page, ex: /contributions, /community, /ticks

  const url = window.location.href;
  const urlSplit = url.split('/');
  return (
    urlSplit.length > 3 &&
    urlSplit.length < 7 &&
    urlSplit[urlSplit.length - 3] == 'user'
  );
};

const getTicksDiv = () => {
  const sections = document.getElementsByClassName('section clearfix');
  if (sections && sections.length == 4) {
    // MP profile pages are split into 4 sections (in this order):
    // To-Do List, Ticks, Tick Breakdown, and Where <User> Climbs.
    // We only care about the Ticks section.
    return sections[1];
  }
  console.warn(
    'Mountain Project - Climbing Pyramid extension: Unable to find ticks!'
  );
};

const createClimbingChartDiv = () => {
  const container = document.createElement('div');
  container.classList.add('section', 'clearfix');

  const climbingPyramidTitleDiv = document.createElement('div');
  climbingPyramidTitleDiv.classList.add('section-title');

  const climbingPyramidTitleHeader = document.createElement('h2');
  climbingPyramidTitleHeader.textContent = 'Send Chart';

  const loadingDiv = document.createElement('div');
  loadingDiv.setAttribute('id', 'loading');

  const canvas = document.createElement('canvas');
  canvas.setAttribute('id', CLIMBING_CHART_ID);

  climbingPyramidTitleDiv.appendChild(climbingPyramidTitleHeader);
  container.appendChild(climbingPyramidTitleDiv);
  container.appendChild(loadingDiv);
  container.appendChild(canvas);

  return container;
};

const displayLoading = (loader) => {
  loader.classList.add('display');
};

const hideLoading = (loader) => {
  loader.remove();
};

if (isProfilePage()) {
  const ticksDiv = getTicksDiv();

  if (ticksDiv) {
    const url = window.location.href;
    const ticksCsvUrl = url.concat('/tick-export');
    const climbingChartDiv = createClimbingChartDiv();
    ticksDiv.insertAdjacentElement('afterend', climbingChartDiv);

    const loader = document.querySelector('#loading');
    displayLoading(loader);

    fetch(ticksCsvUrl)
      .then((response) => response.text())
      .then((csvData) => {
        hideLoading(loader);
        const parsedData = Papa.parse(csvData, { header: true });

        createChart(parsedData.data);
      });
  }
}
