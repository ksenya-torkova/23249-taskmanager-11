import {render} from './utils/render.js';
import SiteMenuComponent from './components/site-menu.js';
import FilterComponent from './components/filter.js';
import BoardComponent from './components/board.js';
import BoardController from './controllers/board-controller.js';
import {generateFilters} from './mock/filter-mock.js';
import {generateTasksList} from './mock/task-mock.js';

const TASK_COUNT = 20;

const siteMain = document.querySelector(`.main`);
const siteHeader = siteMain.querySelector(`.main__control`);
const filters = generateFilters();

render(siteHeader, new SiteMenuComponent());
render(siteMain, new FilterComponent(filters));

const tasks = generateTasksList(TASK_COUNT);
const boardComponent = new BoardComponent();
const boardController = new BoardController(boardComponent);

render(siteMain, boardComponent);
boardController.render(tasks);
