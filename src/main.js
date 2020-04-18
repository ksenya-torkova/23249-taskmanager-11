import {render} from './utils.js';
// import LoadMoreComponent from './components/load-more.js';
// import TaskEditComponent from './components/task-edit.js';
import SiteMenuComponent from './components/site-menu.js';
import FilterComponent from './components/filter.js';
import BoardComponent from './components/board.js';
import TaskComponent from './components/task.js';
import {generateFilters} from './mock/filter-mock.js';
import {generateTasksList} from './mock/task-mock.js';

const TASK_COUNT = 20;
const DEFAULT_TASKS_AMOUNT = 8;
// const DOWNLOADED_TASKS_AMOUNT = 8;

const siteMain = document.querySelector(`.main`);
const siteHeader = siteMain.querySelector(`.main__control`);
const filters = generateFilters();

render(siteHeader, new SiteMenuComponent().getElement());
render(siteMain, new FilterComponent(filters).getElement());

// const loadMoreButton = board.querySelector(`.load-more`);

// loadMoreButton.addEventListener(`click`, () => {
//   const previousTasksAmount = showingTasksAmount;
//   showingTasksAmount += DOWNLOADED_TASKS_AMOUNT;

//   tasks.slice(previousTasksAmount, showingTasksAmount)
//     .forEach((task) => {
//       render(taskList, createTaskTemplate(task));
//     });

//   if (showingTasksAmount >= tasks.length) {
//     loadMoreButton.remove();
//   }
// });

const renderTask = (taskListContainer, task) => {
  const taskComponent = new TaskComponent(task);
  // const taskEditComponent = new TaskEditComponent(task);

  render(taskListContainer, taskComponent.getElement());
};

const renderBoard = (tasks, boardComponent) => {
  const taskList = boardComponent.getElement().querySelector(`.board__tasks`);
  let showingTasksAmount = DEFAULT_TASKS_AMOUNT;

  tasks.slice(0, showingTasksAmount)
    .forEach((task) => {
      renderTask(taskList, task);
    });
};

const tasks = generateTasksList(TASK_COUNT);
const boardComponent = new BoardComponent();

render(siteMain, boardComponent.getElement());
renderBoard(tasks, boardComponent);
