import {render} from './utils.js';
import SiteMenuComponent from './components/site-menu.js';
import TaskListComponent from './components/task-list.js';
// import TaskEditComponent from './components/task-edit.js';
// import LoadMoreComponent from './components/load-more.js';
import NoTaskComponent from './components/no-tasks.js';
import FilterComponent from './components/filter.js';
import BoardComponent from './components/board.js';
import TaskComponent from './components/task.js';
import SortComponent from './components/sort.js';
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

const renderTask = (tasksContainer, task) => {
  const taskComponent = new TaskComponent(task);
  // const taskEditComponent = new TaskEditComponent(task);

  render(tasksContainer, taskComponent.getElement());
};

const renderBoard = (tasks, boardComponent) => {
  const isAllTasksArchived = tasks.every((task) => task.isArchive);

  if (isAllTasksArchived || tasks.length === 0) {
    render(boardComponent.getElement(), new NoTaskComponent().getElement());
    return;
  }

  const taskListComponent = new TaskListComponent().getElement();

  render(boardComponent.getElement(), new SortComponent().getElement());
  render(boardComponent.getElement(), taskListComponent);

  let showingTasksAmount = DEFAULT_TASKS_AMOUNT;

  tasks.slice(0, showingTasksAmount)
    .forEach((task) => {
      renderTask(taskListComponent, task);
    });
};

const tasks = generateTasksList(TASK_COUNT);
const boardComponent = new BoardComponent();

render(siteMain, boardComponent.getElement());
renderBoard(tasks, boardComponent);
