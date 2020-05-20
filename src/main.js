import {dateFrom, dateTo} from './utils/common';
import {render} from './utils/render';
import API from './api';
import BoardComponent from './components/board.js';
import BoardController from './controllers/board-controller';
import FilterController from './controllers/filter-controller';
import SiteMenuComponent, {MenuItem} from './components/site-menu';
import StatisticsComponent from './components/statistics';
import TasksModel from './models/tasks-model';

const AUTHORIZATION = `Basic dslkewjhWE345ir`;
const siteMain = document.querySelector(`.main`);
const siteHeader = siteMain.querySelector(`.main__control`);
const api = new API(AUTHORIZATION);
const tasksModel = new TasksModel();
const boardComponent = new BoardComponent();
const siteMenuComponent = new SiteMenuComponent();
const boardController = new BoardController(boardComponent, tasksModel, siteMenuComponent);
const filterController = new FilterController(siteMain, tasksModel);
const statisticsComponent = new StatisticsComponent({tasks: tasksModel, dateFrom, dateTo});

filterController.render();
render(siteMain, boardComponent);
render(siteHeader, siteMenuComponent);
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

api.getTasks()
  .then((tasks) => {
    tasksModel.setTasks(tasks);
    boardController.render();
  });
