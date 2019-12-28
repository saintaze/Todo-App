import { Project } from '../models/project.model';
import { Todo } from '../models/todo.model';
import { Store } from '../services/store';


const template = document.createElement('template');
template.innerHTML = `
  <style>
  </style>
`

class ProjectListComponent extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    
    this._store = new Store();
    this._projects = this._store.getProjects();
    this._activeProject = this._projects[0];
    this._activeProjectIndex = 0;
    this._activeProjectColor = 'aqua';

    const $addProjectBtn = document.querySelector('.project-add-btn');
    const $todoAddBtn = document.querySelector('.todo-add-btn');
    this.$projectInput = document.querySelector('.project-input');
    this.$todoList = document.querySelector('.todo-list');

    this.$projectInput.addEventListener('keyup', this._initProject.bind(this));
    $addProjectBtn.addEventListener('click', this._initProject.bind(this));
    this.addEventListener('deleteProject', this._deleteProject.bind(this));
    this.addEventListener('editProject', this._editProject.bind(this));
    this.addEventListener('setActiveProject', this._setActiveProject.bind(this));
    this.$todoList.addEventListener('updateTodo', this._updateTodo.bind(this));
    this.$todoList.addEventListener('deleteTodo', this._deleteTodo.bind(this));
    this.$todoList.addEventListener('todoCompletedToggle', this._todoCompletedToggle.bind(this));
    $todoAddBtn.addEventListener('click', this._initTodo.bind(this));

    this._setInputCurrentDate()
    this._render()
  }
  
  connectedCallback(){
   
  }

  _todoCompletedToggle(e){
    this._projects[e.detail.projectIndex].todos[e.detail.todoIndex].completed = e.detail.completed;
    this._store.saveProjects(this._projects);
  }

  _updateTodo(e){
   this._projects[e.detail.projectIndex].todos[e.detail.todoIndex] = e.detail.updatedTodo;
   this._store.saveProjects(this._projects);
   this._render();
  }

  _setActiveProject(e){
    this._activeProjectIndex = e.detail
    this._activeProject = this._projects[e.detail];
    this._render()
  }

  _initProject(e){
    if (e.keyCode === 8) return;
    if (this.$projectInput.value === ''){
      document.querySelector('.flash').style.display = 'block'
      return
    };
    if(e.type === 'click' || e.keyCode === 13) {
      document.querySelector('.flash').style.display = 'none';
      const projectName = this.$projectInput.value;
      this.$projectInput.value = ''
      this._projects.push(new Project(projectName));
      this._store.saveProjects(this._projects);
      this._render();
    }
  }

  _renderProject(p, i) {
    const $project = document.createElement('app-project');
    $project.setAttribute('index', i);
    $project.setAttribute('name', p.name);
    $project.setAttribute('count', p.todos.length);
    $project.setAttribute('background-color', this._getActiveBackgroundColor(i))
    this.shadowRoot.appendChild($project);
  }

  _initTodo(e){
    e.preventDefault();
    const {value: todoDescription} = document.querySelector('.todo-description');
    const {value: todoDate} = document.querySelector('.todo-date');
    const {value: todoPriority} = document.querySelector('.todo-priority');
    if (todoDescription.trim() === '' || todoDate.trim() === ''){
      document.querySelector('.flash-fields').style.display = 'block';
      return
    };
    const newTodo = new Todo(todoDescription, new Date(todoDate).toDateString(), todoPriority);
    this._activeProject.todos.push(newTodo);
    this._store.saveProjects(this._projects)
    document.querySelector('.todo-create').reset();
    document.querySelector('.flash-fields').style.display = 'none'
    this._render();
  }

  _renderTodo(t, i){
    const $todo = document.createElement('app-todo');
    $todo.setAttribute('desc', t.description);
    $todo.setAttribute('date', t.dueDate);
    $todo.setAttribute('priority', t.priority);
    $todo.setAttribute('project-index', this._activeProjectIndex);
    $todo.setAttribute('todo-index', i);
    $todo.setAttribute('completed', t.completed);
    $todo.setAttribute('priority', t.priority)
    this.$todoList.appendChild($todo);
  }

  _deleteProject(e){
    this._projects.splice(e.detail, 1);
    this._store.saveProjects(this._projects);
    this._render();
  }

  _editProject(e){
    this._projects[e.detail.index].name = e.detail.newName;
    this._store.saveProjects(this._projects);
    this._render();
  }

  _deleteTodo(e){
    this._activeProject.todos.splice(e.detail, 1);
    this._store.saveProjects(this._projects);
    this._render();
  }

  _resetView(){
    this.shadowRoot.innerHTML = '';
    this.$todoList.innerHTML = ''
  }

  _setInputCurrentDate() {
    const today = new Date().toISOString().split('T')[0];
    document.querySelector(".todo-date").setAttribute('min', today);
  }
  _getActiveBackgroundColor(i){
    if(i === +this._activeProjectIndex){
      return this._activeProjectColor;
    }else{
      return 'aquamarine';
    }
  }

  _render(){
    this._resetView();
    this._projects.forEach((p, i) => {
      this._renderProject(p, i)
      if(i === +this._activeProjectIndex && p.todos.length > 0){
        p.todos.forEach((t, i) => this._renderTodo(t, i))
      }
    });
  }
  
}

customElements.define('app-project-list', ProjectListComponent);
