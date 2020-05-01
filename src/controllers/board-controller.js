import {SortType} from './../const.js';
import {remove, render} from './../utils/render.js';
import TaskListComponent from './../components/task-list.js';
import LoadMoreComponent from './../components/load-more.js';
import NoTaskComponent from './../components/no-tasks.js';
import SortComponent from './../components/sort.js';

const DEFAULT_TASKS_AMOUNT = 8;
const DOWNLOADED_TASKS_AMOUNT = 8;

const renderTasksList = (tasksContainer, tasks) => {
  tasks.forEach((task) => {
    renderTask(tasksContainer, task);
  });
};

const getSortedTasks = (tasks, sortType, from = 0, to = DEFAULT_TASKS_AMOUNT) => {
  let sortedTasks = [];
  const showingTasks = tasks.slice();

  switch (sortType) {
    case SortType.DATE_UP:
      sortedTasks = showingTasks.sort((a, b) => a.dueDate - b.dueDate);
      break;
    case SortType.DATE_DOWN:
      sortedTasks = showingTasks.sort((a, b) => b.dueDate - a.dueDate);
      break;
    case SortType.DEFAULT:
      sortedTasks = showingTasks;
      break;
  }

  return sortedTasks.slice(from, to);
};

export default class BoardController {
  constructor(container) {
    this._container = container;
    this._noTaskComponent = new NoTaskComponent();
    this._taskListComponent = new TaskListComponent();
    this._sortComponent = new SortComponent();
    this._loadMoreComponent = new LoadMoreComponent();
  }

  render(tasks) {
    const isAllTasksArchived = tasks.every((task) => task.isArchive);

    if (isAllTasksArchived || tasks.length === 0) {
      render(this._container.getElement(), this._noTaskComponent);
      return;
    }

    const renderLoadMoreButton = () => {
      render(this._container.getElement(), this._loadMoreComponent);

      this._loadMoreComponent.setClickHandler(() => {
        const previousTasksAmount = showingTasksAmount;
        showingTasksAmount += DOWNLOADED_TASKS_AMOUNT;

        const sortedTasks = getSortedTasks(tasks, this._sortComponent.getSortType(), previousTasksAmount, showingTasksAmount);

        renderTasksList(this._taskListComponent.getElement(), sortedTasks);

        if (showingTasksAmount >= tasks.length) {
          remove(this._loadMoreComponent);
        }
      });
    };

    render(this._container.getElement(), this._sortComponent);
    render(this._container.getElement(), this._taskListComponent);

    let showingTasksAmount = DEFAULT_TASKS_AMOUNT;

    renderTasksList(this._taskListComponent.getElement(), tasks.slice(0, showingTasksAmount));

    renderLoadMoreButton();

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      showingTasksAmount = DEFAULT_TASKS_AMOUNT;

      const sortedTasks = getSortedTasks(tasks, sortType);

      this._taskListComponent.getElement().innerHTML = ``;

      renderTasksList(this._taskListComponent.getElement(), sortedTasks);

      renderLoadMoreButton();
    });
  }
}
