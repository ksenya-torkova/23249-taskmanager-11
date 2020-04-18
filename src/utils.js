const TIME_FORMAT_DIVIDER = 10;
const DATE_FORMAT_DIVIDER = 11;
const HOURS_AMOUNT = 12;

const RenderPosition = {
  AFTER_BEGIN: `afterbegin`,
  AFTER_END: `afterend`,
  BEFORE_BEGIN: `beforebegin`,
  BEFORE_END: `beforeend`
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const render = (container, element, place = RenderPosition.BEFORE_END) => {
  switch (place) {
    case RenderPosition.AFTER_BEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFORE_END:
      container.append(element);
      break;
  }
};

const chooseTimeFormat = (value) => {
  return value < TIME_FORMAT_DIVIDER ? `0${value}` : String(value);
};

const formatTime = (date) => {
  const hours = chooseTimeFormat(date.getHours() % HOURS_AMOUNT);
  const minutes = chooseTimeFormat(date.getMinutes());
  const interval = date.getHours() > DATE_FORMAT_DIVIDER ? `pm` : `am`;

  return `${hours}:${minutes} ${interval}`;
};

export {formatTime, createElement, render};
