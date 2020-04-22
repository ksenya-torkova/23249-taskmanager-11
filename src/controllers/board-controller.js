import {checkEscKey} from './../utils/common.js';
import {remove, render, replace} from './../utils/render.js';
import TaskListComponent from './../components/task-list.js';
import TaskEditComponent from './../components/task-edit.js';
import LoadMoreComponent from './../components/load-more.js';
import NoTaskComponent from './../components/no-tasks.js';
import TaskComponent from './../components/task.js';
import SortComponent from './../components/sort.js';

const DEFAULT_TASKS_AMOUNT = 8;
const DOWNLOADED_TASKS_AMOUNT = 8;

const renderTask = (tasksContainer, task) => {
  const taskComponent = new TaskComponent(task);
  const taskEditComponent = new TaskEditComponent(task);

  const replaceTaskToEdit = () => {
    replace(taskEditComponent, taskComponent);
  };

  const replaceEditToTask = () => {
    replace(taskComponent, taskEditComponent);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = checkEscKey(evt);

    if (isEscKey) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  taskComponent.setEditButtonClickHandler(() => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  taskEditComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    replaceEditToTask();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(tasksContainer, taskComponent);
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

    const taskListComponent = this._taskListComponent;

    render(this._container.getElement(), this._sortComponent);
    render(this._container.getElement(), taskListComponent);

    let showingTasksAmount = DEFAULT_TASKS_AMOUNT;

    tasks.slice(0, showingTasksAmount)
      .forEach((task) => {
        renderTask(taskListComponent.getElement(), task);
      });

    const loadMoreComponent = this._loadMoreComponent;

    render(this._container.getElement(), loadMoreComponent);

    loadMoreComponent.setClickHandler(() => {
      const previousTasksAmount = showingTasksAmount;
      showingTasksAmount += DOWNLOADED_TASKS_AMOUNT;

      tasks.slice(previousTasksAmount, showingTasksAmount)
        .forEach((task) => {
          renderTask(taskListComponent.getElement(), task);
        });

      if (showingTasksAmount >= tasks.length) {
        remove(loadMoreComponent);
      }
    });
  }
}
