import {dateFrom, dateTo} from './utils/common';
import {render} from './utils/render';
import API from './api/index';
import Store from './api/store';
import Provider from './api/provider';
import BoardComponent from './components/board.js';
import BoardController from './controllers/board-controller';
import FilterController from './controllers/filter-controller';
import SiteMenuComponent, {MenuItem} from './components/site-menu';
import StatisticsComponent from './components/statistics';
import TasksModel from './models/tasks-model';

const AUTHORIZATION = `Basic dslkewjhWE345i3r`;
const END_POINT = `https://11.ecmascript.pages.academy/task-manager`;
const STORE_PREFIX = `taskmanager-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;
const STORE_TYPE = window.localStorage;
const siteMain = document.querySelector(`.main`);
const siteHeader = siteMain.querySelector(`.main__control`);
const api = new API(AUTHORIZATION, END_POINT);
const store = new Store(STORE_NAME, STORE_TYPE);
const apiWithProvider = new Provider(api, store);
const tasksModel = new TasksModel();
const boardComponent = new BoardComponent();
const siteMenuComponent = new SiteMenuComponent();
const boardController = new BoardController(boardComponent, tasksModel, siteMenuComponent, apiWithProvider);
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

apiWithProvider.getTasks()
  .then((tasks) => {
    tasksModel.setTasks(tasks);
    boardController.render();
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
    }).catch(() => {
    });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
