import {COLORS, DAYS_OF_WEEK} from './../const.js';

const REAPITING_DAYS = {
  mo: false,
  tu: false,
  we: false,
  th: false,
  fr: false,
  sa: false,
  su: false,
};

const TASK_DESCRIPTIONS = [
  `Изучить теорию`,
  `Сделать домашку`,
  `Пройти интенсив на соточку`
];

const WEEK_DAYS_AMOUNT = 7;

const getRandomInteger = (max, min = 0) => {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

const getRandomArrayItem = (arr) => {
  const randomIndex = getRandomInteger(arr.length - 1);

  return arr[randomIndex];
};

const getRandomDate = () => {
  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomInteger(WEEK_DAYS_AMOUNT);

  targetDate.setDate(targetDate.getDate() + diffValue);

  return targetDate;
};

const generateRepeatingDays = () => {
  return Object.assign({}, REAPITING_DAYS, {[getRandomArrayItem(DAYS_OF_WEEK)]: Math.random() > 0.5});
};

const generateTask = () => {
  const dueDate = Math.random() > 0.5 ? null : getRandomDate();

  return {
    color: getRandomArrayItem(COLORS),
    description: getRandomArrayItem(TASK_DESCRIPTIONS),
    dueDate,
    isArchive: Math.random() > 0.5,
    id: String(new Date() + Math.random()),
    isFavorite: Math.random() > 0.5,
    repeatingDays: dueDate ? REAPITING_DAYS : generateRepeatingDays(),
  };
};

const generateTasksList = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateTask);
};

export {generateTasksList};
