import "./styles.css";
import { Todo } from "./todos.js";
import { Project } from "./projects.js";
import {
  sidebar,
  createNewProject,
  submitProjectName,
  addProjectToTaskForm,
  setActiveTab,
  renderTasks,
} from "./sidebar.js";
import { format, parse, formatISO } from "date-fns";

const general = new Project("General");
const savedProjects = JSON.parse(localStorage.getItem("project")) || [];
if (!savedProjects.some((project) => project.name === general.name)) {
  general.saveProjectToStorage();
}

const mainContent = document.getElementById("content");
const form = document.querySelector(".form-sample");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const dateInput = new Date(document.getElementById("date").value);
  const dueDate = format(dateInput, "PPPP");
  const priority = document.getElementById("priority-select").value;
  const project = document.getElementById("project-select").value;

  const formInput = {
    title,
    description,
    dueDate,
    priority,
    project,
  };

  const newTask = new Todo(formInput);
  const taskProject = newTask.findProject();
  taskProject.addTaskToProject(newTask);
  taskProject.saveProjectToStorage();

  const savedTabName = localStorage.getItem("activeTab")?.trim();

  renderTasks(savedTabName);

  form.reset();
});

window.addEventListener("DOMContentLoaded", () => {
  const currentProjects = JSON.parse(localStorage.getItem("project")) || [];

  currentProjects.forEach((project) => {
    submitProjectName(project.name);
    addProjectToTaskForm(project.name);
  });

  const savedTabName = localStorage.getItem("activeTab")?.trim();
  const activeTabElement =
    [...document.querySelectorAll(".tab")].find(
      (tab) => tab.textContent.trim() === savedTabName,
    ) || document.querySelector(".tab.active");

  setActiveTab(activeTabElement, activeTabElement.textContent.trim());
});

mainContent.addEventListener("click", (e) => {
  e.preventDefault();

  const mark = e.target.closest(".mark");
  if (mark) {
    const taskCard = mark.closest(".task-card");
    if (!taskCard) return;

    const currentProjects = JSON.parse(localStorage.getItem("project")) || [];
    const taskList = currentProjects.flatMap((p) => p.tasks);
    const taskId = taskCard.dataset.id;
    const task = taskList.find((task) => task.id === taskId);
    if (!task) return;

    const taskObject = new Todo(task);
    const taskProject = taskObject.findProject();
    if (!taskProject) return;
    taskProject.markTaskAsDone(taskId);
    const tabElement = document.querySelector(".tab.active");
    const tabName = tabElement.textContent.trim();

    taskProject.saveProjectToStorage();
    renderTasks(tabName);

    return;
  }

  const edit = e.target.closest(".edit");

  if (edit) {
    const modal = document.getElementById("modal");
    const modalTitle = document.querySelector(".modal-title");
    const closeBtn = document.getElementById("close-modal");
    const saveBtn = document.querySelector(".save-btn");

    const taskCard = edit.closest(".task-card");
    if (!taskCard) return;

    const currentProjects = JSON.parse(localStorage.getItem("project")) || [];
    const taskList = currentProjects.flatMap((p) => p.tasks);
    const taskId = taskCard.dataset.id;
    const task = taskList.find((task) => task.id === taskId);
    if (!task) return;
    const taskObject = new Todo(task);

    modalTitle.textContent = `Project: ${taskObject.project}`;

    const titleEdit = document.getElementById("title-edit");
    const descEdit = document.getElementById("desc-edit");
    const dateEdit = document.getElementById("date-edit");

    const priorityEdit = document.getElementById("priority-select-edit");
    const prioOptions = priorityEdit.querySelectorAll("option");
    const selectedPrio = [...prioOptions].find(
      (p) => p.value === taskObject.priority,
    );

    const projectEdit = document.getElementById("project-select-edit");
    const projectList = currentProjects.map((p) => p.name);
    projectEdit.innerHTML = projectList
      .map((p) => `<option value="${p}">${p}</option>`)
      .join("");
    const projectOptions = projectEdit.querySelectorAll("option");
    const selectedProj = [...projectOptions].find(
      (p) => p.value === taskObject.project,
    );

    titleEdit.value = taskObject.title;
    descEdit.value = taskObject.description;

    const regex = /^\d{4}-\d{2}-\d{2}$/;
    const isCorrectFormat = regex.test(taskObject.dueDate);
    dateEdit.value = isCorrectFormat
      ? formatISO(new Date(taskObject.dueDate), { representation: "date" })
      : format(parse(taskObject.dueDate, "PPPP", new Date()), "yyyy-MM-dd");

    selectedPrio.setAttribute("selected", "");
    selectedProj.setAttribute("selected", "");

    modal.classList.add("show");

    saveBtn.addEventListener("click", () => {
      const dateInput = new Date(dateEdit.value);

      const updatedTask = {
        id: taskObject.id,
        title: titleEdit.value,
        description: descEdit.value,
        dueDate: format(dateInput, "PPPP"),
        priority: priorityEdit.value,
        project: projectEdit.value,
        completion: taskObject.completion,
      };

      const updatedTodo = new Todo(updatedTask);
      const originalProjectName = taskObject.project;
      const newProjectName = updatedTask.project;

      // If project changed, need to remove from old and add to new
      if (originalProjectName !== newProjectName) {
        // Remove from original project
        const allProjects = JSON.parse(localStorage.getItem("project")) || [];
        const originalProjectData = allProjects.find(
          (p) => p.name === originalProjectName,
        );
        const originalProject = new Project(originalProjectData);
        originalProject.deleteTaskFromProject(taskObject.id);
        originalProject.saveProjectToStorage();

        // Add to new project
        const newProject = updatedTodo.findProject();
        newProject.addTaskToProject(updatedTodo);
        newProject.saveProjectToStorage();
      } else {
        // Project didn't change, just update in place
        const taskProject = updatedTodo.findProject();
        taskProject.updateTaskInProject(updatedTodo);
        taskProject.saveProjectToStorage();
      }

      const savedTabName = localStorage.getItem("activeTab")?.trim();

      renderTasks(savedTabName);
      taskCard.remove();
    });

    closeBtn.addEventListener("click", () => {
      modal.classList.remove("show");
    });
  }
});

sidebar.addEventListener("click", (e) => {
  const newProjectBtn = e.target.closest(".new-project-btn");
  if (newProjectBtn) {
    const newProjectTitleForm = createNewProject();

    newProjectTitleForm.addEventListener("submit", (submitEvent) => {
      submitEvent.preventDefault();

      const projectName = newProjectTitleForm
        .querySelector("#project-name")
        .value.trim();
      if (!projectName) return;

      const newProject = submitProjectName(projectName);
      newProject.saveProjectToStorage();
      newProjectTitleForm.reset();
      newProjectTitleForm.remove();

      addProjectToTaskForm(projectName);
    });
    return;
  }

  const clickedTab = e.target.closest(".tab");
  if (!clickedTab) {
    return;
  }
  e.preventDefault();

  const tabName = clickedTab.textContent.trim();

  setActiveTab(clickedTab, tabName);
});
