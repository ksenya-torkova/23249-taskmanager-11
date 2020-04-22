const TIME_FORMAT_DIVIDER = 10;
const HOURS_AMOUNT = 24;

const chooseTimeFormat = (value) => {
  return value < TIME_FORMAT_DIVIDER ? `0${value}` : String(value);
};

const formatTime = (date) => {
  const hours = chooseTimeFormat(date.getHours() % HOURS_AMOUNT);
  const minutes = chooseTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

const checkEscKey = (evt) => {
  return evt.key === `Escape` || evt.key === `Esc`;
};

export {checkEscKey, formatTime};
