import { Project } from "./projects.js";

class Todo {
  constructor(taskObject) {
    this.id = (taskObject && taskObject.id) || crypto.randomUUID();
    this.title = taskObject && taskObject.title;
    this.description = taskObject && taskObject.description;
    this.dueDate = taskObject && taskObject.dueDate;
    this.priority = taskObject && taskObject.priority;
    this.project = taskObject && taskObject.project;
    this.completion = (taskObject && taskObject.completion) || false;
  }

  isDone() {
    this.completion = true;
  }

  findProject() {
    if (this.project) {
      const latestProjects = JSON.parse(localStorage.getItem("project")) || [];
      console.log(latestProjects);
      const project = latestProjects.find((p) => p.name === this.project);

      console.log(project);
      return project ? new Project(project) : undefined;
    }
  }
}

export { Todo };
