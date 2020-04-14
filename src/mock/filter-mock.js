import {FILTER_TYPES} from './../const.js';

const FILTERS_MAX_AMOUNT = 10;

const generateFilters = () => {
  return FILTER_TYPES.map((it) => {
    return {
      name: it,
      count: Math.floor(Math.random() * FILTERS_MAX_AMOUNT),
    };
  });
};

export {generateFilters};
