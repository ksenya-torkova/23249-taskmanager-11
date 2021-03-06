import {formatDate, formatTime, isOverdueDate} from './../utils/common';
import AbstractComponent from './abstract-component';
import {encode} from "he";

const createTaskTemplate = (task) => {
  const {color, description: notSanitizedDescription, dueDate, isArchive, isFavorite, repeatingDays} = task;
  const isExpired = dueDate instanceof Date && isOverdueDate(dueDate, new Date());
  const deadlineClass = isExpired ? `card--deadline` : ``;
  const isDateShow = Boolean(dueDate);
  const date = isDateShow ? formatDate(dueDate) : ``;
  const time = isDateShow ? formatTime(dueDate) : ``;
  const repeatClass = Object.values(repeatingDays).some(Boolean) ? `card--repeat` : ``;
  const archiveButtonInactiveClass = isArchive ? `` : `card__btn--disabled`;
  const favoriteButtonInactiveClass = isFavorite ? `` : `card__btn--disabled`;
  const description = encode(notSanitizedDescription);

  return (
    `<article class="card card--${color} ${repeatClass} ${deadlineClass}">
      <div class="card__form">
        <div class="card__inner">
          <div class="card__control">
            <button type="button" class="card__btn card__btn--edit">
              edit
            </button>
            <button type="button" class="card__btn card__btn--archive ${archiveButtonInactiveClass}">
              archive
            </button>
            <button type="button" class="card__btn card__btn--favorites ${favoriteButtonInactiveClass}">
              favorites
            </button>
          </div>

          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <p class="card__text">${description}</p>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <div class="card__date-deadline">
                  <p class="card__input-deadline-wrap">
                    <span class="card__date">${date}</span>
                    <span class="card__time">${time}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>`
  );
};

export default class Task extends AbstractComponent {
  constructor(task) {
    super();
    this._task = task;
  }

  getTemplate() {
    return createTaskTemplate(this._task);
  }

  setArchiveButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--archive`).addEventListener(`click`, handler);
  }

  setEditButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, handler);
  }

  setFavoritesButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--favorites`).addEventListener(`click`, handler);
  }
}
