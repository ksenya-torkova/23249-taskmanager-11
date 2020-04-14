import {createLoadMoreButtonTemplate} from './components/load-more.js';
import {createTaskEditTemplate} from './components/task-edit.js';
import {createSiteMenuTemplate} from './components/site-menu.js';
import {createFilterTemplate} from './components/filter.js';
import {createBoardTemplate} from './components/board.js';
import {createTaskTemplate} from './components/task.js';
import {generateFilters} from './mock/filter-mock.js';
import {generateTasksList} from './mock/task-mock.js';

const TASK_COUNT = 20;
const DEFAULT_TASKS_AMOUNT = 8;
const DOWNLOADED_TASKS_AMOUNT = 8;

const siteMain = document.querySelector(`.main`);
const siteHeader = siteMain.querySelector(`.main__control`);
const tasks = generateTasksList(TASK_COUNT);
const filters = generateFilters();
let showingTasksAmount = DEFAULT_TASKS_AMOUNT;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

render(siteHeader, createSiteMenuTemplate());
render(siteMain, createFilterTemplate(filters));
render(siteMain, createBoardTemplate());

const board = siteMain.querySelector(`.board`);
const taskList = board.querySelector(`.board__tasks`);

render(taskList, createTaskEditTemplate(tasks[0]));

tasks.slice(1, showingTasksAmount)
  .forEach((task) => {
    render(taskList, createTaskTemplate(task));
  });

render(board, createLoadMoreButtonTemplate());

const loadMoreButton = board.querySelector(`.load-more`);

loadMoreButton.addEventListener(`click`, () => {
  const previousTasksAmount = showingTasksAmount;
  showingTasksAmount += DOWNLOADED_TASKS_AMOUNT;

  tasks.slice(previousTasksAmount, showingTasksAmount)
    .forEach((task) => {
      render(taskList, createTaskTemplate(task));
    });

  if (showingTasksAmount >= tasks.length) {
    loadMoreButton.remove();
  }
});
