import { ProjectView } from '../views/project.view';
import { Project } from '../models/project.model';
import { q, qA } from '../helpers/query.helper';

export class ProjectController {

  constructor(){
    this.projects = [];
    this.view = new ProjectView();
    this.attachProjectCreateBtnHandler();
  }

  attachProjectCreateBtnHandler () {
    q('.project button').addEventListener('click', ()=>{
      const projectName = q('.project input').value;
      this.projects.push(new Project(projectName));
      this.view.renderProjects(this.projects);
    });
  }
}

