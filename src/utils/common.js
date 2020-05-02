import moment from 'moment';

const formatTime = (date) => {
  return moment(date).format(`hh:mm`);
};

const formatDate = (date) => {
  return moment(date).format(`DD MMMM`);
};

const checkEscKey = (evt) => {
  return evt.key === `Escape` || evt.key === `Esc`;
};

export {checkEscKey, formatDate, formatTime};
