import {COLORS, DAYS_OF_WEEK} from './../utils/const.js';
import {formatDate, formatTime, isOverdueDate, isRepeating} from './../utils/common.js';
import AbstractSmartComponent from './abstract-smart-component.js';
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const createDaysTemplate = (days, repeatingDays) => {
  return days
    .map((day, index) => {
      const isChecked = repeatingDays[day];

      return (
        `<input
          class="visually-hidden card__repeat-day-input"
          type="checkbox"
          id="repeat-${day}-${index}"
          name="repeat"
          value="${day}"
          ${isChecked ? `checked` : ``}
        />
        <label class="card__repeat-day" for="repeat-${day}-${index}"
          >${day}</label
        >`
      );
    })
    .join(`\n`);
};

const createColorsTemplate = (colors, currentColor) => {
  return colors
    .map((color, index) => {
      return (
        `<input
          type="radio"
          id="color-${color}-${index}"
          class="card__color-input card__color-input--${color} visually-hidden"
          name="color"
          value="${color}"
          ${currentColor === color ? `checked` : ``}
        />
        <label
          for="color-${color}-${index}"
          class="card__color card__color--${color}"
          >${color}</label
        >`
      );
    })
    .join(`\n`);
};

const createTaskEditTemplate = (task, options = {}) => {
  const {color, description, dueDate} = task;
  const {isDateShowing, isRepeatingTask, activeRepeatingDays} = options;
  const isExpired = dueDate instanceof Date && isOverdueDate(dueDate, new Date());
  const deadlineClass = isExpired ? `card--deadline` : ``;
  const date = (isDateShowing && dueDate) ? formatDate(dueDate) : ``;
  const time = (isDateShowing && dueDate) ? formatTime(dueDate) : ``;
  const deadlineStatus = isDateShowing ? `yes` : `no`;
  const repeatClass = isRepeatingTask ? `card--repeat` : ``;
  const repeatingStatus = isRepeatingTask ? `yes` : `no`;
  const daysMarkup = createDaysTemplate(DAYS_OF_WEEK, activeRepeatingDays);
  const colorsMarkup = createColorsTemplate(COLORS, color);
  const isSaveButtonShown = (isDateShowing && isRepeatingTask) || (isRepeatingTask && !isRepeating(activeRepeatingDays));

  return (
    `<article class="card card--edit card--${color} ${repeatClass} ${deadlineClass}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text">${description}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <button class="card__date-deadline-toggle" type="button">
                  date: <span class="card__date-status">${deadlineStatus}</span>
                </button>

                ${isDateShowing ? `<fieldset class="card__date-deadline">
                  <label class="card__input-deadline-wrap">
                    <input
                      class="card__date"
                      type="text"
                      placeholder=""
                      name="date"
                      value="${date} ${time}"
                    />
                  </label>
                </fieldset>` : `` }

                <button class="card__repeat-toggle" type="button">
                  repeat:<span class="card__repeat-status">${repeatingStatus}</span>
                </button>

                ${isRepeatingTask ? `<fieldset class="card__repeat-days">
                  <div class="card__repeat-days-inner">
                    ${daysMarkup}
                  </div>
                </fieldset>` : ``}
              </div>
            </div>

            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
                ${colorsMarkup}
              </div>
            </div>
          </div>

          <div class="card__status-btns">
            <button class="card__save" type="submit" ${isSaveButtonShown ? `disabled` : ``}>save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>`
  );
};

export default class TaskEdit extends AbstractSmartComponent {
  constructor(task) {
    super();
    this._task = task;
    this._isDateShowing = Boolean(task.dueDate);
    this._isRepeatingTask = Object.values(task.repeatingDays).some(Boolean);
    this._activeRepeatingDays = Object.assign({}, task.repeatDays);
    this._submitHandler = null;
    this._flatpickr = null;
    this._subscribeOnEvents();
    this._applyFlapickr();
  }

  _applyFlapickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    if (this._isDateShowing) {
      const dateElement = this.getElement().querySelector(`.card__date`);

      this._flatpickr = flatpickr(dateElement, {
        altInput: true,
        allowInput: true,
        defaultDate: this._task.dueDate || `today`,
      });
    }
  }

  getTemplate() {
    return createTaskEditTemplate(this._task, {
      isDateShowing: this._isDateShowing,
      isRepeatingTask: this._isRepeatingTask,
      activeRepeatingDays: this._activeRepeatingDays,
    });
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
    this._applyFlapickr();
  }

  reset() {
    const task = this._task;

    this._isDateShowing = Boolean(task.dueDate);
    this._isRepeatingTask = Object.values(task.repeatingDays).some(Boolean);
    this._activeRepeatingDays = Object.assign({}, task.repeatDays);

    this.rerender();
  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`.card__form`).addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.card__date-deadline-toggle`)
      .addEventListener(`click`, () => {
        this._isDateShowing = !this._isDateShowing;

        this.rerender();
      });

    element.querySelector(`.card__repeat-toggle`)
      .addEventListener(`click`, () => {
        this._isRepeatingTask = !this._isRepeatingTask;

        this.rerender();
      });

    const repeatDays = element.querySelector(`.card__repeat-days`);
    if (repeatDays) {
      repeatDays.addEventListener(`change`, (evt) => {
        this._activeRepeatingDays[evt.target.value] = evt.target.checked;

        this.rerender();
      });
    }
  }
}
