const template = document.createElement('template');
template.innerHTML = `
<style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    *:focus {
      outline: none;
    }

    :host {
      display: block;
      margin: 0.9rem 0;
      cursor: pointer;
    }

    .project-name:hover {
      background-color: aqua !important;
      transition: all .3s;
    }

    li {
      list-style: none;
      display: flex;
      align-items: center;
    }


    .project-edit-input,
    .project-update-btn {
      display: none;
    }

   :host([mode="edit"]) .project-edit-input,
   :host([mode="edit"]) .project-update-btn
    {
      display: inline-block;
    }

   :host([mode="edit"]) .project-edit-btn,
   :host([mode="edit"]) .project-name {
     display: none;
   }

  .project-add-btn, 
  .project-delete-btn, 
  .project-edit-btn, 
  .project-update-btn{
    font-size: 1.2rem;
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
    transition: all 125ms cubic-bezier(0, 1.47, 0, 2.2);
  }

  .project-delete-btn{
    margin-left: .6rem;
  }

  .project-todo-count {
    background-color: #ff69b4db;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    font-size: 1.3rem;
    opacity: 0.9;
    margin: 0 0.6rem;
    cursor: default;
    color: black;
  }

  .project-name {
    background-color: white;
    font-family: 'Kalam', cursive;
    border: 2px outset lightskyblue;
    border-radius: .3rem;
    padding: .2rem 1.4rem;
    transition: all 100ms ease-in-out;
    width: 77%;
  }
  .project-edit-input {
    padding: 0.3rem 1.5rem;
    border-radius: 3px;
    font-family: kalam, Courier, monospace;
    font-size: 1.6rem;
  } 

  .project-edit-btn {
    padding-top: 0.15rem;
  }
  </style>

  <li class="project">
    <button class="project-edit-btn">✎</button>
    <button class="project-update-btn">+</button>
    <span class="project-todo-count"></span>
    <input class="project-edit-input" maxlength="30"></input> 
    <span class="project-name"></span>
    <button class="project-delete-btn">-</button>
  </li>
`

class ProjectComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this._todos = [];
  }

  connectedCallback(){
    this.index = this.getAttribute('index');
    this.name = this.getAttribute('name');
    this.count = this.getAttribute('count');
    this.backgroundColor = this.getAttribute('background-color');

    this.$projectName = this.shadowRoot.querySelector('.project-name');
    this.$projectEditInput = this.shadowRoot.querySelector('.project-edit-input');
    const $projectTodoCount = this.shadowRoot.querySelector('.project-todo-count');
    const $projectDeleteBtn = this.shadowRoot.querySelector('.project-delete-btn');
    const $projectEditBtn = this.shadowRoot.querySelector('.project-edit-btn');
    const $projectUpdateBtn = this.shadowRoot.querySelector('.project-update-btn');
    
    this.$projectEditInput.addEventListener('keyup', this._handleUpdateProject.bind(this));
    $projectUpdateBtn.addEventListener('click', this._handleUpdateProject.bind(this))
    $projectDeleteBtn.addEventListener('click', this._handleDeleteProject.bind(this))
    $projectEditBtn.addEventListener('click', this._handleEditProject.bind(this));
    this.$projectName.addEventListener('click', this._handleActiveProject.bind(this))

    $projectTodoCount.textContent = this.count;
    this.$projectName.textContent = this.name;
    this.$projectName.style.backgroundColor = this.backgroundColor;
  }

  static get observedAttributes() {
    return ['background-color'];
  }

  attributeChangedCallback(attr, oldVal, newVal) {
    if(attr === 'background-color'){
      this.shadowRoot.querySelector('.project-name').style.backgroundColor = newVal;
    }
  }

  _handleActiveProject(){
    const event = this._createNewEvent('setActiveProject', this.index)
    this.dispatchEvent(event);
  }

  _handleDeleteProject(){
    const event = this._createNewEvent('deleteProject', this.index)
    this.dispatchEvent(event);
  }

  _handleEditProject(e){
    this.setAttribute('mode', 'edit');
    this.$projectEditInput.value = this.name;
    this.$projectEditInput.focus()
  }

  _handleUpdateProject(e){
    if (e.keyCode === 13 || e.type === 'click') {
      const event = this._createNewEvent('editProject', { newName: this.$projectEditInput.value, index: this.index})
      this.dispatchEvent(event); 
      this.removeAttribute('mode');
    }
  }

  _createNewEvent(eventName, payload){
    const eventOptions = { bubbles: true, composed: true, detail: payload }
    return new CustomEvent(eventName, eventOptions);
  }
}


customElements.define('app-project', ProjectComponent)
