import {createElement} from './../utils/render.js';

const HIDING_CLASS = `visually-hidden`;

export default class AbstractComponent {
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error(`невозможно создать экземпляр абстрактного класса`);
    }

    this._element = null;
  }

  getTemplate() {
    throw new Error(`абстрактный метод getTemplate не перегружен`);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  hide() {
    if (this._element) {
      this._element.classList.add(HIDING_CLASS);
    }
  }

  removeElement() {
    this._element = null;
  }

  show() {
    if (this._element) {
      this._element.classList.remove(HIDING_CLASS);
    }
  }
}
