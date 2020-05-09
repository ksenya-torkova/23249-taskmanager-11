import {render} from './utils/render.js';
import {generateTasksList} from './mock/task-mock.js';
import BoardComponent from './components/board.js';
import BoardController from './controllers/board-controller.js';
import FilterController from './controllers/filter-controller.js';
import SiteMenuComponent, {MenuItem} from './components/site-menu.js';
import StatisticsComponent from "./components/statistics.js";
import TasksModel from './models/tasks-model.js';

const TASK_COUNT = 20;
const siteMain = document.querySelector(`.main`);
const siteHeader = siteMain.querySelector(`.main__control`);

const tasks = generateTasksList(TASK_COUNT);
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const filterController = new FilterController(siteMain, tasksModel);
filterController.render();

const boardComponent = new BoardComponent();
const siteMenuComponent = new SiteMenuComponent();
const boardController = new BoardController(boardComponent, tasksModel, siteMenuComponent);

render(siteMain, boardComponent);
boardController.render();
render(siteHeader, siteMenuComponent);

const dateTo = new Date();

const dateFrom = (() => {
  const d = new Date(dateTo);
  d.setDate(d.getDate() - 7);
  return d;
})();

const statisticsComponent = new StatisticsComponent({tasks: tasksModel, dateFrom, dateTo});

render(siteMain, statisticsComponent);
statisticsComponent.hide();

siteMenuComponent.setOnChangeHandler((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      siteMenuComponent.setActiveItem(MenuItem.NEW_TASK);
      statisticsComponent.hide();
      boardController.show();
      boardController.createTask();
      boardController._onViewChange();
      break;
    case MenuItem.STATISTICS:
      boardController.hide();
      statisticsComponent.show();
      break;
    case MenuItem.TASKS:
      statisticsComponent.hide();
      boardController.show();
      break;
  }
});
