import {SortType} from './../utils/const';
import {remove, render} from './../utils/render';
import TaskListComponent from './../components/task-list';
import LoadMoreComponent from './../components/load-more';
import NoTaskComponent from './../components/no-tasks';
import SortComponent from './../components/sort';
import TaskController, {emptyTask, Mode as TaskControllerMode} from './task-controller';

const DEFAULT_TASKS_AMOUNT = 8;
const DOWNLOADED_TASKS_AMOUNT = 8;

const renderTasksList = (tasksContainer, tasks, onDataChange, onViewChange) => {
  return tasks.map((task) => {
    const taskController = new TaskController(tasksContainer, onDataChange, onViewChange);

    taskController.render(task, TaskControllerMode.DEFAULT);

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
  constructor(container, tasksModel, siteMenuComponent, api) {
    this._container = container;
    this._tasksModel = tasksModel;
    this._siteMenuComponent = siteMenuComponent;
    this._shownTaskControllers = [];
    this._noTaskComponent = new NoTaskComponent();
    this._taskListComponent = new TaskListComponent();
    this._sortComponent = new SortComponent();
    this._loadMoreComponent = new LoadMoreComponent();
    this._shownTasksAmount = DEFAULT_TASKS_AMOUNT;
    this._createdTask = null;
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._tasksModel.setFilterChangeHandlers(this._onFilterChange);
    this._onLoadMoreButtonClickHandler = this._onLoadMoreButtonClickHandler.bind(this);
    this._api = api;
  }

  createTask() {
    if (this._createdTask) {
      return;
    }

    this._createdTask = new TaskController(this._taskListComponent.getElement(), this._onDataChange, this._onViewChange);
    this._createdTask.render(emptyTask, TaskControllerMode.ADD);
  }

  hide() {
    this._container.hide();
  }

  _onDataChange(taskController, oldData, newData) {
    if (oldData === emptyTask) {
      this._createdTask = null;

      if (newData === null) {
        taskController.destroy();
        this._updateTasks(this._shownTasksAmount);
        this._siteMenuComponent.resetActiveItem();
      } else {
        this._api.createTask(newData)
          .then((taskModel) => {
            this._tasksModel.addTask(taskModel);
            taskController.render(taskModel, TaskControllerMode.DEFAULT);

            if (this._shownTasksAmount % DEFAULT_TASKS_AMOUNT === 0) {
              const destroyedTask = this._shownTaskControllers.pop();
              destroyedTask.destroy();
            }

            this._shownTaskControllers = [].concat(taskController, this._shownTaskControllers);
            this._shownTasksAmount = this._shownTaskControllers.length;
            this._renderLoadMoreButton();
          })
          .catch(() => {
            taskController.shake();
          });
      }
    } else if (newData === null) {
      this._api.deleteTask(oldData.id)
        .then(() => {
          this._tasksModel.removeTask(oldData.id);
          this._updateTasks(this._shownTasksAmount);
        })
        .catch(() => {
          taskController.shake();
        });
    } else {
      this._api.updateTask(oldData.id, newData)
        .then((taskModel) => {
          const isSuccess = this._tasksModel.updateTask(oldData.id, taskModel);

          if (isSuccess) {
            taskController.render(taskModel, TaskControllerMode.DEFAULT);
            this._updateTasks(this._shownTasksAmount);
          }
        })
        .catch(() => {
          taskController.shake();
        });
    }
  }

  _onFilterChange() {
    this._updateTasks(DEFAULT_TASKS_AMOUNT);
  }

  _onLoadMoreButtonClickHandler() {
    const previousTasksAmount = this._shownTasksAmount;
    const tasks = this._tasksModel.getFiltredTasks();
    this._shownTasksAmount += DOWNLOADED_TASKS_AMOUNT;

    const sortedTasks = getSortedTasks(tasks, this._sortComponent.getSortType(), previousTasksAmount, this._shownTasksAmount);
    const newTasks = renderTasksList(this._taskListComponent.getElement(), sortedTasks, this._onDataChange, this._onViewChange);
    this._shownTaskControllers = this._shownTaskControllers.concat(newTasks);

    if (this._shownTasksAmount >= this._tasksModel.getFiltredTasks().length) {
      remove(this._loadMoreComponent);
    }
  }

  _onSortTypeChange(sortType) {
    const sortedTasks = getSortedTasks(this._tasksModel.getFiltredTasks(), sortType, 0, this._shownTasksAmount);

    this._removeTasks();
    this._renderTasks(sortedTasks);
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

    this._loadMoreComponent.setClickHandler(this._onLoadMoreButtonClickHandler);
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

  show() {
    this._container.show();
  }

  _updateTasks(count) {
    this._removeTasks();
    this._renderTasks(this._tasksModel.getFiltredTasks().slice(0, count));
    this._renderLoadMoreButton();
  }
}
