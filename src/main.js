import {createLoadMoreButtonTemplate} from './components/load-more.js';
import {createTaskEditTemplate} from './components/task-edit.js';
import {createSiteMenuTemplate} from './components/site-menu.js';
import {createFilterTemplate} from './components/filter.js';
import {createBoardTemplate} from './components/board.js';
import {createTaskTemplate} from './components/task.js';
import {generateFilters} from './mock/filter-mock.js';

const TASK_COUNT = 3;
const siteMain = document.querySelector(`.main`);
const siteHeader = siteMain.querySelector(`.main__control`);
const filters = generateFilters();


const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

render(siteHeader, createSiteMenuTemplate());
render(siteMain, createFilterTemplate(filters));
render(siteMain, createBoardTemplate());

const board = siteMain.querySelector(`.board`);
const taskList = board.querySelector(`.board__tasks`);

render(taskList, createTaskEditTemplate());

for (let i = 0; i < TASK_COUNT; i++) {
  render(taskList, createTaskTemplate());
}

render(board, createLoadMoreButtonTemplate());
