import { Todo } from '../models/todo.model';

const template = document.createElement('template');
template.innerHTML = `
  <style>

  :host {
    margin-bottom: -1.2rem !important;
    display: block;
  }

    *:focus {
      outline: none;
    }

    li {
      list-style-type: none;
      margin-top: 1rem;
      margin-bottom: 1rem;
    }

    .todo-description-input,
    .todo-date-input,
    .todo-priority-select,
    .todo-update-btn {
      display: none;
    }

    :host([mode="edit"]) .todo-description-input, 
    :host([mode="edit"]) .todo-date-input,
    :host([mode="edit"]) .todo-priority-select, 
    :host([mode="edit"]) .todo-update-btn {
      display: inline-block;
    }

    :host([mode="edit"]) .edit-wrapper {
      display: inline-flex;
    }

    :host([mode="edit"]) .todo-description, 
    :host([mode="edit"]) .todo-date, 
    :host([mode="edit"]) .todo-priority,
    :host([mode="edit"]) .todo-edit-btn,
    :host([mode="edit"]) .show-wrapper{
      display: none;
    }

    .show-wrapper, .edit-wrapper {
      display: inline-block;
    }

    .todo-description-input,
    .todo-date-input,
    .todo-priority-select{
      padding: 0.4rem 0.9rem;
      padding-top: 0.7rem;
      border-radius: 3px;
      font-size: 1.3rem;
      font-family: 'Courier Prime', monospace;
      border: 2px inset ghostwhite;
    }

    .todo-date-input{
      padding-top: 0.48rem;
      padding-bottom: 0.2rem;
      margin-left: 6px;
      margin-right: 6px;
    }

    .todo-edit-btn,
    .todo-update-btn,
    .todo-delete-btn{
      font-size: 1.1rem;
      width: 2.3rem;
      height: 2.3rem;
      border-radius: 50%;
      color: white;
      background: linear-gradient( to top left, DimGray, #222 );
      font-weight: bold;
      font-family: 'Courier New', Courier, monospace;
      border: 2px solid #555;
      border-bottom: 2px solid DimGray;
      border-right: 2px solid DimGray;
      cursor: pointer;
      padding-left: 0.6rem;
      padding-top: 0.3rem;
      transition: all 125ms cubic-bezier(0, 1.47, 0, 2.2);
    }

    .todo-completed {
      width: 1.5rem;
      height: 1.5rem;
    }

    .priority-alert{
      border-radius: 57%;
      display: inline-flex;
      padding: 0;
      width: 2rem;
      height: 2rem;
      align-items: center;
      justify-content: center;
      position: relative;
      top: .1px;
      line-height: 0.1;
    }

    .todo-edit-btn {
      padding-left: 0.48rem;
      padding-top: 0.3rem;
    }

    .todo-date, .todo-description {
      padding: 0;
    }

    .high {
      border: 3px solid #ff4444;
    }

    .medium {
      border: 3px solid #ffc643;
    }

    .low {  
      border: 3px solid yellow;
    }

    .todo-date {
      color: darkviolet;
    }

    .todo-description {
      font-family: 'Courier Prime';
    }
    .show-wrapper {
      padding: .3rem 0.9rem;
      border-radius: 1.2px;
      width: 85%;
      display: inline-flex;
      justify-content: space-between;
      font-family: 'Courier Prime';
    } 

    .todo-description-input {
      flex-grow: 1;
    }

    .edit-wrapper {
      width: 87.6%;
      display: none;
      margin-bottom: 0.5em;
    }

    .todo-delete-btn {
      transform: translateY(-2px);
    }
  </style>

  <li>
    <button class="todo-edit-btn">✎</button>
    <button class="todo-update-btn">+</button>

    <div class="show-wrapper">
      <span class="todo-description"></span>
      <div class="info">
        <span class="todo-date"></span>
        <span class="todo-priority priority-alert"></span>
      </div>
    </div>

    <div class="edit-wrapper">
      <input type="text" class="todo-description-input" maxlength="48">
      <input type="date" class="todo-date-input">
      <input type="number" class="todo-priority-select" value="3" min="1", max="3">
    </div>

    <input type="checkbox" class="todo-completed">
    <button class="todo-delete-btn">-</button>
  </li>
`

class TodoComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const $todoDeleteBtn = this.shadowRoot.querySelector('.todo-delete-btn');
    const $todoEditBtn = this.shadowRoot.querySelector('.todo-edit-btn');
    this.$todoDateInput = this.shadowRoot.querySelector('.todo-date-input');
    this.$todoPrioritySelect = this.shadowRoot.querySelector('.todo-priority-select');
    this.$todoDescriptionInput = this.shadowRoot.querySelector('.todo-description-input');
    this.$todoUpdateBtn = this.shadowRoot.querySelector('.todo-update-btn');
    this.$todoCompleted = this.shadowRoot.querySelector('.todo-completed');

    this.$todoCompleted.addEventListener('change', this._handleTodoCompleted.bind(this));
    this.$todoUpdateBtn.addEventListener('click', this._handleTodoUpdate.bind(this));
    $todoEditBtn.addEventListener('click', this._handleTodoEdit.bind(this));
    $todoDeleteBtn.addEventListener('click', this._handleTodoDelete.bind(this));

    this._setInputCurrentDate()
  }

  connectedCallback(){
    this.projectIndex = this.getAttribute('project-index');
    this.todoIndex = this.getAttribute('todo-index');
    this.description = this.getAttribute('desc');
    const date = this.getAttribute('date');
    this.date = this._convertDateToISOString(date)
    this.priority = this.getAttribute('priority');
    this.completed = this.getAttribute('completed') === 'true';
    this.priority = this.getAttribute('priority');

    const $todoDescription = this.shadowRoot.querySelector('.todo-description');
    const $todoDate = this.shadowRoot.querySelector('.todo-date');
    const $todoPriority = this.shadowRoot.querySelector('.todo-priority');
    
    $todoDescription.textContent = this.description;
    $todoDate.textContent = new Date(this.date).toLocaleDateString().replace(/\//g, '-');
    $todoPriority.textContent = this.priority;
    this.$todoCompleted.checked = this.completed;
    this._setPriorityAlert(this.priority)
  }

  _handleTodoCompleted(e){
    const eventPayload = {
      projectIndex: this.projectIndex, 
      todoIndex: this.todoIndex,
      completed: e.target.checked
    }
    const event = this._createNewEvent('todoCompletedToggle', eventPayload);
    this.dispatchEvent(event) 
  }

  _handleTodoUpdate(){
    const todoUpdatedDescription = this.$todoDescriptionInput.value;
    const todoUpdatedDate = this.$todoDateInput.value;
    const todoUpdatedPriority = this.$todoPrioritySelect.value;
    if (Math.floor(todoUpdatedPriority) < 1 || Math.floor(todoUpdatedPriority) > 3) return;
    const todoUpdatedCompleted = this.$todoCompleted.checked;
    const updatedTodo = new Todo(todoUpdatedDescription, todoUpdatedDate, todoUpdatedPriority, todoUpdatedCompleted);
    const eventPayload = {
      projectIndex: this.projectIndex,
      todoIndex: this.todoIndex,
      updatedTodo: updatedTodo
    }
    const event = this._createNewEvent('updateTodo', eventPayload);
    this.dispatchEvent(event);
    this.removeAttribute('mode');
  }
 
  _handleTodoDelete(){
    const event = this._createNewEvent('deleteTodo', this.todoIndex)
    this.dispatchEvent(event);
  }

  _handleTodoEdit(){
    this.setAttribute('mode', 'edit');
    this.$todoDateInput.value = this.date;
    this.$todoPrioritySelect.value = this.priority;
    this.$todoDescriptionInput.value = this.description;
    this.$todoDescriptionInput.focus();

    
  }

  _createNewEvent(eventName, payload) {
    const eventOptions = { bubbles: true, composed: true, detail: payload }
    return new CustomEvent(eventName, eventOptions);
  }

  _setInputCurrentDate() {
    const today = new Date().toISOString().split('T')[0];
    this.shadowRoot.querySelector(".todo-date-input").setAttribute('min', today);
  }

  _convertDateToISOString(date){
    return new Date(date).toISOString().split('T')[0]
  }

  _setPriorityAlert(level){
    const $todoPriority = this.shadowRoot.querySelector('.todo-priority');
    if(+level === 3){
      $todoPriority.classList.add('low');
      $todoPriority.classList.remove('medium');
      $todoPriority.classList.remove('high');
    }else if (+level === 2){
      $todoPriority.classList.add('medium');
      $todoPriority.classList.remove('high');
      $todoPriority.classList.remove('low');
    }else{
      $todoPriority.classList.add('high');
      $todoPriority.classList.remove('medium');
      $todoPriority.classList.remove('low');
    }
  }
}


customElements.define('app-todo', TodoComponent)
