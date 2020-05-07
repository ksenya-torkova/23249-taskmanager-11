import {SortType} from './../utils/const.js';
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
  constructor(container, tasksModel) {
    this._container = container;
    this._tasksModel = tasksModel;
    this._shownTaskControllers = [];
    this._noTaskComponent = new NoTaskComponent();
    this._taskListComponent = new TaskListComponent();
    this._sortComponent = new SortComponent();
    this._loadMoreComponent = new LoadMoreComponent();
    this._shownTasksAmount = DEFAULT_TASKS_AMOUNT;
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._tasksModel.setFilterChangeHandlers(this._onFilterChange);
  }

  _onDataChange(taskController, oldData, newData) {
    const isSuccess = this._tasksModel.updateTask(oldData.id, newData);

    if (isSuccess) {
      taskController.render(newData);
    }
  }

  _onFilterChange() {
    this._updateTasks(DEFAULT_TASKS_AMOUNT);
  }

  _onSortTypeChange(sortType) {
    const sortedTasks = getSortedTasks(this._tasksModel.getFiltredTasks(), sortType, 0, this._shownTasksAmount);

    this._taskListComponent.getElement().innerHTML = ``;

    const newTasks = renderTasksList(this._taskListComponent.getElement(), sortedTasks, this._onDataChange, this._onViewChange);
    this._shownTaskControllers = this._shownTaskControllers.concat(newTasks);
    this._renderLoadMoreButton();
  }

  _onViewChange() {
    this._shownTaskControllers.forEach((it) => {
      it.setDefaultView();
    });
  }

  _removeTasks() {
    this._shownTaskControllers.forEach((taskController) => taskController.destroy());
    this._shownTaskControllers = [];
  }

  _renderLoadMoreButton() {
    remove(this._loadMoreComponent);

    if (this._shownTasksAmount >= this._tasksModel.getFiltredTasks().length) {
      return;
    }

    render(this._container.getElement(), this._loadMoreComponent);

    this._loadMoreComponent.setClickHandler(() => {
      const previousTasksAmount = this._shownTasksAmount;
      const tasks = this._tasksModel.getFiltredTasks();
      this._shownTasksAmount += DOWNLOADED_TASKS_AMOUNT;

      const sortedTasks = getSortedTasks(tasks, this._sortComponent.getSortType(), previousTasksAmount, this._shownTasksAmount);
      const newTasks = renderTasksList(this._taskListComponent.getElement(), sortedTasks, this._onDataChange, this._onViewChange);
      this._shownTaskControllers = this._shownTaskControllers.concat(newTasks);

      if (this._shownTasksAmount >= this._tasksModel.getFiltredTasks().length) {
        remove(this._loadMoreComponent);
      }
    });
  }

  render() {
    const tasks = this._tasksModel.getFiltredTasks();
    const isAllTasksArchived = tasks.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      render(this._container.getElement(), this._noTaskComponent);
      return;
    }

    render(this._container.getElement(), this._sortComponent);
    render(this._container.getElement(), this._taskListComponent);

    this._renderTasks(tasks.slice(0, this._shownTasksAmount));
    this._renderLoadMoreButton();
  }

  _renderTasks(tasks) {
    const newTasks = renderTasksList(this._taskListComponent.getElement(), tasks, this._onDataChange, this._onViewChange);

    this._shownTaskControllers = this._shownTaskControllers.concat(newTasks);
    this._shownTasksAmount = this._shownTaskControllers.length;
  }

  _updateTasks(count) {
    this._removeTasks();
    this._renderTasks(this._tasksModel.getFiltredTasks().slice(0, count));
    this._renderLoadMoreButton();
  }
}
