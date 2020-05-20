import AbstractComponent from './abstract-component';

const FILTER_ID_PREFIX = `filter__`;

const createFilterMarkup = (filter, checked) => {
  const {name, count} = filter;
  const isDisabled = count === 0 ? `disabled` : ``;
  const isChecked = checked ? `checked` : ``;

  return (
    `<input
      type="radio"
      id="filter__${name}"
      class="filter__input visually-hidden"
      name="filter"
      ${isDisabled}
      ${isChecked}
    />
    <label for="filter__${name}" class="filter__label">
      ${name}
      <span class="filter__${name}-count">${count}</span>
    </label>`
  );
};

const createFilterTemplate = (filters) => {
  const filtersMarkup = filters
  .map(
      (it) => {
        return createFilterMarkup(it, it.checked);
      }
  ).join(`\n`);

  return (
    `<section class="main__filter filter container">
      ${filtersMarkup}
    </section>`
  );
};

const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = getFilterNameById(evt.target.id);

      handler(filterName);
    });
  }
}
