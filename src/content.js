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

  const url = window.location.href;
  const urlSplit = url.split('/');
  return (
    urlSplit.length > 3 &&
    urlSplit.length < 7 &&
    urlSplit[urlSplit.length - 3] == 'user'
  );
};

const hasPrivateTicks = () => {
  // NOTE: This implementation is highly coupled to the DOM set by MP.

  const sections = document.getElementsByClassName('section clearfix');
  if (sections && sections.length > 1) {
    // MP profile pages are split into 4 sections (in this order):
    // To-Do List, Ticks, Tick Breakdown, and Where <User> Climbs.
    // We only care about the Ticks section.

    const ticksSection = sections[1];

    // Ticks section has <a>, <div.sectionTitle>, and <div>
    // If the ticks are public, the third div will have a 'table-responsive' class.
    // If ticks are private, it won't have any classes.
    return (
      ticksSection.children.length == 3 &&
      ticksSection.children[2].classList.length == 0
    );
  }

  return true;
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
