export default class Task {
  constructor(data) {
    this.color = data[`color`];
    this.description = data[`description`] || ``;
    this.dueDate = data[`due_date`] ? new Date(data[`due_date`]) : null;
    this.id = data[`id`];
    this.isArchive = Boolean(data[`is_archived`]);
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.repeatingDays = data[`repeating_days`];
  }

  toRAW() {
    return {
      "color": this.color,
      "description": this.description,
      "due_date": this.dueDate,
      "id": this.id,
      "is_archived": this.isArchive,
      "is_favorite": this.isFavorite,
      "repeating_days": this.repeatingDays,
    };
  }

  static clone(data) {
    return new Task(data.toRAW());
  }

  static parseTask(data) {
    return new Task(data);
  }

  static parseTasks(data) {
    return data.map(Task.parseTask);
  }
}
