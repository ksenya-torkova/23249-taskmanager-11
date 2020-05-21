import {checkEscKey} from './../utils/common';
import {COLOR, DAYS_OF_WEEK} from './../utils/const';
import {render, RenderPosition, replace, remove} from './../utils/render';
import TaskComponent from './../components/task';
import TaskEditComponent from './../components/task-edit';
import TaskModel from './../models/task-model';

const SHAKE_ANIMATION_TIMEOUT = 600;

const Mode = {
  ADD: `add`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

const emptyTask = {
  description: ``,
  dueDate: null,
  repeatingDays: {
    "mo": false,
    "tu": false,
    "we": false,
    "th": false,
    "fr": false,
    "sa": false,
    "su": false,
  },
  color: COLOR.BLACK,
  isFavorite: false,
  isArchive: false,
};

const parseFormData = (formData) => {
  const date = formData.get(`date`);

  const repeatingDays = DAYS_OF_WEEK.reduce((acc, day) => {
    acc[day] = false;
    return acc;
  }, {});

  return new TaskModel({
    "color": formData.get(`color`),
    "description": formData.get(`text`),
    "due_date": date ? new Date(date) : null,
    "is_archived": false,
    "is_favorite": false,
    "repeating_days": formData.getAll(`repeat`).reduce((acc, it) => {
      acc[it] = true;
      return acc;
    }, repeatingDays),
  });
};

export default class TaskController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._taskComponent = null;
    this._taskEditComponent = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;
  }

  _replaceTaskToEdit() {
    this._onViewChange();
    replace(this._taskEditComponent, this._taskComponent);
    this._mode = Mode.EDIT;
  }

  _replaceEditToTask() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._taskEditComponent.reset();
    replace(this._taskComponent, this._taskEditComponent);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = checkEscKey(evt);

    if (isEscKey) {
      if (this._mode === Mode.ADD) {
        this._onDataChange(this, emptyTask, null);
      }

      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  destroy() {
    remove(this._taskComponent);
    remove(this._taskEditComponent);

    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  render(task, mode) {
    this._mode = mode;
    const oldTaskComponent = this._taskComponent;
    const oldTaskEditComponent = this._taskEditComponent;
    this._taskComponent = new TaskComponent(task);
    this._taskEditComponent = new TaskEditComponent(task);

    this._taskComponent.setArchiveButtonClickHandler(() => {
      const newTask = TaskModel.clone(task);
      newTask.isArchive = !newTask.isArchive;

      this._onDataChange(this, task, newTask);
    });

    this._taskComponent.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._taskComponent.setFavoritesButtonClickHandler(() => {
      const newTask = TaskModel.clone(task);
      newTask.isFavorite = !newTask.isFavorite;

      this._onDataChange(this, task, newTask);
    });

    this._taskEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();

      const formData = this._taskEditComponent.getFormData();
      const data = parseFormData(formData);

      this._taskEditComponent.setButtonsData({
        saveButtonText: `Saving...`,
      });

      this._onDataChange(this, task, data);
    });

    this._taskEditComponent.setDeleteButtonClickHandler(() => {
      this._taskEditComponent.setButtonsData({
        deleteButtonText: `Deleting...`,
      });

      this._onDataChange(this, task, null);
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldTaskEditComponent && oldTaskComponent) {
          replace(this._taskComponent, oldTaskComponent);
          replace(this._taskEditComponent, oldTaskEditComponent);
          this._replaceEditToTask();
        } else {
          render(this._container, this._taskComponent);
        }
        break;

      case Mode.ADD:
        if (oldTaskEditComponent && oldTaskComponent) {
          remove(oldTaskComponent);
          remove(oldTaskEditComponent);
        }

        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._taskEditComponent, RenderPosition.AFTER_BEGIN);
        break;
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToTask();
    }
  }

  shake() {
    this._taskComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._taskEditComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._taskComponent.getElement().style.animation = ``;
      this._taskEditComponent.getElement().style.animation = ``;

      this._taskEditComponent.setButtonsData({
        deleteButtonText: `Delete`,
        saveButtonText: `Save`,
      });

    }, SHAKE_ANIMATION_TIMEOUT);
  }
}

export {emptyTask, Mode};
