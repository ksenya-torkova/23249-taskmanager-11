import {createElement} from './../utils/render';

const HIDING_CLASS = `visually-hidden`;

export default class AbstractComponent {
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error(`невозможно создать экземпляр абстрактного класса`);
    }

    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  getTemplate() {
    throw new Error(`абстрактный метод getTemplate не перегружен`);
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
