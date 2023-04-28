'use strict';

import './content.css';

import renderChart from './sendChart.js';
import { ROUTE_TYPES } from './constants.js';
import { preprocessData } from './utils/dataUtils.js';

const localStorageActiveTabKey = 'climbingPyramid.activeTab';
const ROUTE_TYPE_TO_ELEMENT_ID = {};
ROUTE_TYPE_TO_ELEMENT_ID[ROUTE_TYPES.boulder] = {
  tab: 'boulderTab',
  canvas: 'boulderCanvas',
};
ROUTE_TYPE_TO_ELEMENT_ID[ROUTE_TYPES.sport] = {
  tab: 'sportTab',
  canvas: 'sportCanvas',
};
ROUTE_TYPE_TO_ELEMENT_ID[ROUTE_TYPES.trad] = {
  tab: 'tradTab',
  canvas: 'tradCanvas',
};

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
  console.error(
    'Mountain Project Send Pyramid extension: Unable to render send pyramid!'
  );
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

const onDateRangeSelectChange = (e) => {
  console.log(e.target.value);
};

const renderDateRangeSelect = (ticksCollection) => {
  const dateRangeSelect = document.createElement('select');
  dateRangeSelect.addEventListener('change', onDateRangeSelectChange);

  const last12MonthsOption = document.createElement('option');
  last12MonthsOption.setAttribute('value', '12');
  last12MonthsOption.textContent = 'Last 12 months';

  const allTimeOption = document.createElement('option');
  allTimeOption.setAttribute('value', '0');
  allTimeOption.textContent = 'All Time';

  const currentYearOption = document.createElement('option');
  currentYearOption.setAttribute('value', '2023');
  currentYearOption.textContent = 'Current year';

  const lastYearOption = document.createElement('option');
  lastYearOption.setAttribute('value', '2022');
  lastYearOption.textContent = 'Last year';

  const _2021Option = document.createElement('option');
  _2021Option.setAttribute('value', '2021');
  _2021Option.textContent = '2021';

  const _2020Option = document.createElement('option');
  _2020Option.setAttribute('value', '2020');
  _2020Option.textContent = '2020';

  const _2019Option = document.createElement('option');
  _2019Option.setAttribute('value', '2019');
  _2019Option.textContent = '2019';

  const _2018Option = document.createElement('option');
  _2018Option.setAttribute('value', '2018');
  _2018Option.textContent = '2018';

  const _2017Option = document.createElement('option');
  _2017Option.setAttribute('value', '2017');
  _2017Option.textContent = '2017';

  dateRangeSelect.appendChild(last12MonthsOption);
  dateRangeSelect.appendChild(allTimeOption);
  dateRangeSelect.appendChild(currentYearOption);
  dateRangeSelect.appendChild(lastYearOption);
  dateRangeSelect.appendChild(_2021Option);
  dateRangeSelect.appendChild(_2020Option);
  dateRangeSelect.appendChild(_2019Option);
  dateRangeSelect.appendChild(_2018Option);
  dateRangeSelect.appendChild(_2017Option);

  const sendChartTitle = document.getElementById('send-chart-title');
  sendChartTitle.insertAdjacentElement('afterend', dateRangeSelect);
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

    for (let routeType of Object.values(ROUTE_TYPES)) {
      renderChart(
        ROUTE_TYPE_TO_ELEMENT_ID[routeType].canvas,
        routeType,
        ticksCollection
      );
    }
  }
}
