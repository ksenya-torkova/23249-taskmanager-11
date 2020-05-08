import {render} from './utils/render.js';
import {generateTasksList} from './mock/task-mock.js';
import BoardComponent from './components/board.js';
import BoardController from './controllers/board-controller.js';
import FilterController from './controllers/filter-controller.js';
import SiteMenuComponent, {MenuItem} from './components/site-menu.js';
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
const boardController = new BoardController(boardComponent, tasksModel);
render(siteMain, boardComponent);
boardController.render();

const siteMenuComponent = new SiteMenuComponent();
render(siteHeader, siteMenuComponent);

siteMenuComponent.setOnChangeHandler((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      siteMenuComponent.setActiveItem(MenuItem.NEW_TASK);
      boardController.createTask();
      break;
  }
});
