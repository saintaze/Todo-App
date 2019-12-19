import { q } from '../helpers/query.helper';

export class ProjectView {

  renderProject(project){ 
    return `
      <li class="project-item">
        <button class="project-edit">✎</button>
        <span class="project-todos-count">${project.todos.length}</span>
        <span class="project-name">${project.name}</span>
        <button class="project-delete">-</button>
      </li>
    `
  }

  renderProjects(projects){
    const projectList = q('.project-list');
    projectList.innerHTML = '';
    projects.forEach(p => {
      projectList.innerHTML += this.renderProject(p);
    });
  }

}