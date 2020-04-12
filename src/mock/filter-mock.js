const FILTER_TYPES = [`all`, `overdue`, `today`, `favorites`, `repeating`, `tags`, `archive`];
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
