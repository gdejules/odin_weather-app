class Project {
  constructor(project) {
    this.name = typeof project === "string" ? project : project?.name;
    this.tasks =
      typeof project === "object" && project?.tasks ? project.tasks : [];
  }

  addTaskToProject(taskObject) {
    this.tasks.push(taskObject);
  }

  getLastTask() {
    return this.tasks[this.tasks.length - 1];
  }

  markTaskAsDone(id) {
    const task = this.tasks.find((task) => task.id === id);
    if (task) task.completion = true;
  }

  saveProjectToStorage() {
    const latestProjects = JSON.parse(localStorage.getItem("project")) || [];

    const thisProject = {
      name: this.name,
      tasks: this.tasks,
    };

    const projectIndex = latestProjects.findIndex(
      (project) => project.name === this.name,
    );

    if (projectIndex === -1) {
      latestProjects.push(thisProject);
    } else {
      latestProjects[projectIndex] = thisProject;
    }

    localStorage.setItem("project", JSON.stringify(latestProjects));
  }

  updateTaskInProject(taskObject) {
    const updatedTask = this.tasks.find((t) => t.id === taskObject.id);

    if (updatedTask) {
      Object.assign(updatedTask, {
        title: taskObject.title,
        description: taskObject.description,
        dueDate: taskObject.dueDate,
        priority: taskObject.priority,
        project: taskObject.project,
        completion: taskObject.completion,
      });
    }
  }

  deleteTaskFromProject(id) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }
}

export { Project };
