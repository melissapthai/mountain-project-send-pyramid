'use strict';

import './content.css';

import { renderCharts, ROUTE_TYPE_TO_ELEMENT_ID } from './sendChart.js';
import {
  DATE_RANGE_VALUE_LAST_12_MONTHS,
  DATE_RANGE_ALL_TIME,
  ROUTE_TYPES,
} from './constants.js';
import { preprocessData } from './utils/dataUtils.js';

const localStorageActiveTabKey = 'climbingPyramid.activeTab';

const shouldDisplaySendPyramid = () => {
  return isProfilePage() && !hasPrivateTicks();
};

const isProfilePage = () => {
  // MP profile page url looks like this:
  // https://www.mountainproject.com/user/<user id>/<user name>
  // We only want to display the climbing chart if we're on a profile page.
  // Do not display on a non-profile page, ex: /contributions, /community, /ticks

  // Path parts should be ['user', '<user id>', '<user name>']
  const parts = window.location.pathname.split('/').filter(Boolean);
  return (
    parts.length === 3 &&
    parts[0] === 'user' &&
    /^\d+$/.test(parts[1])
  );
};

const hasPrivateTicks = () => {
  const tickBreakdown = document.querySelector('a[name="tickBreakdown"]');
  const section = tickBreakdown?.closest('.section.clearfix');
  const text = section?.innerText.toLowerCase();

  if (!text) {
    console.error(
      'Mountain Project Send Pyramid extension: Unable to determine if ticks are private.'
    );
    return true;
  }

  const hasPrivateTicks = text.includes('private');

  if (hasPrivateTicks) {
    console.log('Mountain Project Send Pyramid extension: Ticks are private, not displaying send pyramid.');
  }

  return hasPrivateTicks;
};

const getTicksDiv = () => {
  const ticks = document.querySelector('a[name="ticks"]');
  const section = ticks?.closest('.section.clearfix');

  if (!section) {
    console.error(
      'Mountain Project Send Pyramid extension: Unable to render send pyramid!'
    );
  }

  return section;
};

const renderClimbingChartContainer = () => {
  const container = document.createElement('div');
  container.classList.add('section', 'clearfix');

  // Chart title
  const sendChartTitleContainer = document.createElement('div');
  sendChartTitleContainer.setAttribute('id', 'send-chart-title');
  sendChartTitleContainer.classList.add('section-title');

  const sendChartTitleHeader = document.createElement('h2');
  sendChartTitleHeader.textContent = 'Send Pyramid';

  // Loading animation
  const loadingDiv = document.createElement('div');
  loadingDiv.setAttribute('id', 'loading');

  // Chart canvases
  let chartCanvases = [];
  for (let routeType of Object.values(ROUTE_TYPES)) {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('id', ROUTE_TYPE_TO_ELEMENT_ID[routeType].canvas);
    canvas.classList.add('chart-canvas');
    chartCanvases.push(canvas);
  }

  sendChartTitleContainer.appendChild(sendChartTitleHeader);
  container.appendChild(sendChartTitleContainer);
  container.appendChild(loadingDiv);
  for (let canvas of chartCanvases) {
    container.appendChild(canvas);
  }

  return container;
};

const setActiveTab = (routeType) => {
  const elements = document.querySelectorAll('.tab, .chart-canvas');
  for (let el of elements) {
    el.classList.remove('active');
  }

  const selectedTab = document.getElementById(
    ROUTE_TYPE_TO_ELEMENT_ID[routeType].tab
  );
  const canvas = document.getElementById(
    ROUTE_TYPE_TO_ELEMENT_ID[routeType].canvas
  );
  selectedTab.classList.add('active');
  canvas.classList.add('active');

  // Remember selected tab
  localStorage.setItem(localStorageActiveTabKey, routeType);
};

const renderTabs = () => {
  const tabsContainer = document.createElement('div');
  tabsContainer.classList.add('tabs-container');

  for (let routeType of Object.values(ROUTE_TYPES)) {
    const tab = document.createElement('div');
    tab.setAttribute('id', ROUTE_TYPE_TO_ELEMENT_ID[routeType].tab);
    tab.classList.add('tab');
    tab.textContent = routeType;
    tab.addEventListener('click', () => {
      setActiveTab(routeType);
    });
    tabsContainer.appendChild(tab);
  }

  const sendChartTitle = document.getElementById('send-chart-title');
  sendChartTitle.insertAdjacentElement('afterend', tabsContainer);
};

const onDateRangeSelectChange = (ticksCollection, dateRange) => {
  renderCharts(ticksCollection, dateRange);
};

const renderDateRangeSelect = (ticksCollection) => {
  const dateRangeSelect = document.createElement('select');
  dateRangeSelect.setAttribute('id', 'date-range-select');
  dateRangeSelect.addEventListener('change', (e) => {
    onDateRangeSelectChange(ticksCollection, e.target.value);
  });

  const last12MonthsOption = document.createElement('option');
  last12MonthsOption.setAttribute('value', DATE_RANGE_VALUE_LAST_12_MONTHS);
  last12MonthsOption.textContent = 'Last 12 months';

  const allTimeOption = document.createElement('option');
  allTimeOption.setAttribute('value', DATE_RANGE_ALL_TIME);
  allTimeOption.textContent = 'All Time';

  let yearOptions = [];
  if (ticksCollection.minDate && ticksCollection.maxDate) {
    const today = new Date();
    const minYear = ticksCollection.minDate.getFullYear();

    let year = ticksCollection.maxDate.getFullYear();
    for (; year >= minYear; year--) {
      const option = document.createElement('option');
      option.setAttribute('value', year);
      const textContent = year == today.getFullYear() ? 'Current year' : year;
      option.textContent = textContent;
      yearOptions.push(option);
    }
  }

  dateRangeSelect.appendChild(last12MonthsOption);
  dateRangeSelect.appendChild(allTimeOption);
  for (let option of yearOptions) {
    dateRangeSelect.appendChild(option);
  }

  const sendChartTitle = document.getElementById('send-chart-title');
  sendChartTitle.insertAdjacentElement('afterend', dateRangeSelect);
};

const displayLoading = (loader) => {
  loader.classList.add('display');
};

const hideLoading = (loader) => {
  loader.remove();
};

if (shouldDisplaySendPyramid()) {
  const ticksDiv = getTicksDiv();

  if (ticksDiv) {
    const url = window.location.href;
    const ticksCsvUrl = url.concat('/tick-export');
    const climbingChartContainer = renderClimbingChartContainer();
    ticksDiv.insertAdjacentElement('afterend', climbingChartContainer);

    const loader = document.querySelector('#loading');
    displayLoading(loader);

    const response = await fetch(ticksCsvUrl);
    const csvData = await response.text();
    const activeTab =
      localStorage.getItem(localStorageActiveTabKey) || ROUTE_TYPES.sport;

    hideLoading(loader);
    renderTabs();
    setActiveTab(activeTab);

    const ticksCollection = preprocessData(csvData);
    renderDateRangeSelect(ticksCollection);

    const dateRange = document.getElementById('date-range-select').value;
    renderCharts(ticksCollection, dateRange);
  }
}
