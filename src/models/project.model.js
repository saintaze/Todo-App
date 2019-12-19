export class Project {

  constructor(name) {
    this.name = name;
    this.todos = [];
  }

  addTodo(todo) {
    this.todo.push(todo);
  }

  editTodo(index, newTodo) {
    // todoId = this.todos.findIndex(todo => todo.id === id)
    // this.todos[todoId] = newTodo;
    const todoIndex = this.todos.findIndex((todo, i) => i === index)
    this.todos[todoIndex] = newTodo;
  }

  deleteTodo(index) {
    // todoId = this.todos.findIndex(todo => todo.id === id);
    const todoIndex = this.todos.findIndex((todo, i) => i === index)
    this.todos.splice(todoIndex, 1)
  }

  deleteAllTodos() {
    // with if else ask confirmation
    this.todos = [];
  }

  editName(newName) {
    this.name = newName
  }

}