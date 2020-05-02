import {SortType} from './../const.js';
import {remove, render} from './../utils/render.js';
import TaskListComponent from './../components/task-list.js';
import LoadMoreComponent from './../components/load-more.js';
import NoTaskComponent from './../components/no-tasks.js';
import SortComponent from './../components/sort.js';
import TaskController from './task-controller.js';

const DEFAULT_TASKS_AMOUNT = 8;
const DOWNLOADED_TASKS_AMOUNT = 8;

const renderTasksList = (tasksContainer, tasks, onDataChange, onViewChange) => {
  return tasks.map((task) => {
    const taskController = new TaskController(tasksContainer, onDataChange, onViewChange);

    taskController.render(task);

    return taskController;
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
    this._tasks = [];
    this._showedTaskControllers = [];
    this._noTaskComponent = new NoTaskComponent();
    this._taskListComponent = new TaskListComponent();
    this._sortComponent = new SortComponent();
    this._loadMoreComponent = new LoadMoreComponent();
    this._showingTasksAmount = DEFAULT_TASKS_AMOUNT;
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }

  _onDataChange(oldData, newData) {
    const index = this._tasks.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), newData, this._tasks.slice(index + 1));
    this._showedTaskControllers[index].render(this._tasks[index]);
  }

  _onSortTypeChange(sortType) {
    const sortedTasks = getSortedTasks(this._tasks, sortType);

    this._taskListComponent.getElement().innerHTML = ``;

    const newTasks = renderTasksList(this._taskListComponent.getElement(), sortedTasks, this._onDataChange, this._onViewChange);
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

    this._renderLoadMoreButton();
  }

  _onViewChange() {
    this._showedTaskControllers.forEach((it) => {
      it.setDefaultView();
    });
  }

  _renderLoadMoreButton() {
    if (this._tasks.length === 0) {
      return;
    }

    render(this._container.getElement(), this._loadMoreComponent);

    this._loadMoreComponent.setClickHandler(() => {
      const previousTasksAmount = this._showingTasksAmount;
      this._showingTasksAmount += DOWNLOADED_TASKS_AMOUNT;

      const sortedTasks = getSortedTasks(this._tasks, this._sortComponent.getSortType(), previousTasksAmount, this._showingTasksAmount);
      const newTasks = renderTasksList(this._taskListComponent.getElement(), sortedTasks, this._onDataChange, this._onViewChange);
      this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

      if (this._showingTasksAmount >= this._tasks.length) {
        remove(this._loadMoreComponent);
      }
    });
  }

  render(tasks) {
    this._tasks = tasks;
    const isAllTasksArchived = this._tasks.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      render(this._container.getElement(), this._noTaskComponent);
      return;
    }

    render(this._container.getElement(), this._sortComponent);
    render(this._container.getElement(), this._taskListComponent);

    const newTasks = renderTasksList(this._taskListComponent.getElement(), this._tasks.slice(0, this._showingTasksAmount), this._onDataChange, this._onViewChange);
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

    this._renderLoadMoreButton();
  }
}
