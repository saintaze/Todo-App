export class Todo {

  constructor(description, dueDate, priority, completed=false) {
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.completed = completed;
  }

}

