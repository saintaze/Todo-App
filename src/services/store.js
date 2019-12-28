import { Project } from '../models/project.model';

export class Store {
  getProjects(){
    const projects = JSON.parse(localStorage.getItem('projects'));
    return projects ? projects : [new Project('New Project')];
  }

  saveProjects(projects){
    localStorage.setItem('projects', JSON.stringify(projects));
  }
} 
