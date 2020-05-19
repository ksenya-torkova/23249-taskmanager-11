import {dateFrom, dateTo} from './utils/common';
import {render} from './utils/render';
import {generateTasksList} from './mock/task-mock';
import BoardComponent from './components/board.js';
import BoardController from './controllers/board-controller';
import FilterController from './controllers/filter-controller';
import SiteMenuComponent, {MenuItem} from './components/site-menu';
import StatisticsComponent from './components/statistics';
import TasksModel from './models/tasks-model';

const TASK_COUNT = 20;
const siteMain = document.querySelector(`.main`);
const siteHeader = siteMain.querySelector(`.main__control`);
const tasks = generateTasksList(TASK_COUNT);
const tasksModel = new TasksModel();
const boardComponent = new BoardComponent();
const siteMenuComponent = new SiteMenuComponent();
const boardController = new BoardController(boardComponent, tasksModel, siteMenuComponent);
const filterController = new FilterController(siteMain, tasksModel);
const statisticsComponent = new StatisticsComponent({tasks: tasksModel, dateFrom, dateTo});

tasksModel.setTasks(tasks);
filterController.render();
render(siteMain, boardComponent);
boardController.render();
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
