const COLOR = {
  BLACK: `black`,
  YELLOW: `yellow`,
  BLUE: `blue`,
  GREEN: `green`,
  PINK: `pink`,
};

const COLORS = Object.values(COLOR);

const DAYS_OF_WEEK = [
  `mo`,
  `tu`,
  `we`,
  `th`,
  `fr`,
  `sa`,
  `su`,
];

const FilterType = {
  ALL: `all`,
  ARCHIVE: `archive`,
  FAVORITES: `favorites`,
  OVERDUE: `overdue`,
  REPEATING: `repeating`,
  TODAY: `today`,
};

const SortType = {
  DATE_DOWN: `date-down`,
  DATE_UP: `date-up`,
  DEFAULT: `default`,
};

const Tag = {
  LINK: `A`
};

export {COLORS, DAYS_OF_WEEK, FilterType, SortType, Tag};
