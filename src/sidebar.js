import { Project } from "./projects.js";
import { TaskCard } from "./render.js";

const sidebar = document.getElementById("sidebar");
const logo = document.createElement("span");
const mainFolders = document.createElement("div");
const myProjects = document.createElement("div");

logo.className = "logo";
logo.textContent = "MY TODO LIST";
logo.style.fontFamily = "Signika";
logo.style.fontWeight = "300";
logo.style.fontSize = `var(--step-1)`;

mainFolders.className = "main folders";
const generalTask = document.createElement("button");
generalTask.className = "menu tab active";
const generalIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-list-icon lucide-clipboard-list"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>`;
generalTask.innerHTML = `${generalIcon} All tasks`;
const archivedTask = document.createElement("button");
archivedTask.className = "menu tab";
const archivedIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-archive-restore-icon lucide-archive-restore"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h2"/><path d="M20 8v11a2 2 0 0 1-2 2h-2"/><path d="m9 15 3-3 3 3"/><path d="M12 12v9"/></svg>`;
archivedTask.innerHTML = `${archivedIcon} Archived tasks`;
mainFolders.appendChild(generalTask);
mainFolders.appendChild(archivedTask);

myProjects.className = "projects folders";
const projectsSection = document.createElement("span");
projectsSection.textContent = "MY PROJECTS";
projectsSection.style.fontFamily = "Signika";
projectsSection.style.fontSize = `var(--step-0)`;
projectsSection.style.fontWeight = "600";
projectsSection.style.color = "oklch(42.024% 0.00005 271.152)";
const addNewProjectBtn = document.createElement("button");
addNewProjectBtn.className = "new-project-btn";
const addIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`;
addNewProjectBtn.innerHTML = addIcon;
const titleAndButton = document.createElement("div");
titleAndButton.appendChild(projectsSection);
titleAndButton.appendChild(addNewProjectBtn);
titleAndButton.style.display = "flex";
titleAndButton.style.justifyContent = "space-between";
titleAndButton.style.alignItems = "center";
myProjects.appendChild(titleAndButton);

sidebar.appendChild(logo);
sidebar.appendChild(mainFolders);
sidebar.appendChild(myProjects);

function createNewProject() {
  const newProjectTitleForm = document.createElement("form");
  newProjectTitleForm.setAttribute("action", "");
  newProjectTitleForm.setAttribute("method", "get");
  newProjectTitleForm.setAttribute("class", "new-project-title");
  const label = document.createElement("label");
  const input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("name", "project-name");
  input.setAttribute("id", "project-name");
  input.setAttribute("placeholder", "My new project's name");
  const submitBtn = document.createElement("input");
  submitBtn.setAttribute("type", "submit");
  submitBtn.setAttribute("value", "Add project");
  label.appendChild(input);
  newProjectTitleForm.appendChild(label);
  newProjectTitleForm.appendChild(submitBtn);
  myProjects.appendChild(newProjectTitleForm);

  input.focus();
  return newProjectTitleForm;
}

function submitProjectName(projectName) {
  const newProject = new Project(projectName);
  const projectTab = document.createElement("button");
  projectTab.className = "other tab";
  projectTab.textContent = projectName;
  myProjects.appendChild(projectTab);

  return newProject;
}

function addProjectToTaskForm(projectName) {
  const selectProjectForm = document.querySelector("#project-select");
  const newOption = document.createElement("option");
  newOption.setAttribute("value", projectName);
  newOption.textContent = `${projectName}`;
  selectProjectForm.appendChild(newOption);
}

function showTasksByProject(projectTasks) {
  const mainContent = document.getElementById("content");
  mainContent.replaceChildren();

  projectTasks.map((task) => {
    const taskCard = new TaskCard(task);

    mainContent.appendChild(taskCard.createCard());
  });
}

function renderTasks(tabName) {
  const currentProjects = JSON.parse(localStorage.getItem("project")) || [];
  const taskList = currentProjects.flatMap((p) => p.tasks);
  const selectedTabName = tabName.trim();

  if (selectedTabName === "All tasks") {
    const activeTasks = taskList.filter((task) => {
      return task.completion === false;
    });

    showTasksByProject(activeTasks);
  } else if (selectedTabName === "Archived tasks") {
    const doneTasks = taskList.filter((task) => {
      return task.completion === true;
    });

    showTasksByProject(doneTasks);
  } else {
    const projectTasks = taskList.filter((task) => {
      return task.completion === false && task.project === selectedTabName;
    });

    showTasksByProject(projectTasks);
  }
}

function setActiveTab(clickedTabElement, tabName) {
  // 1. Remove the active class from the previous tab
  document.querySelector(".tab.active")?.classList.remove("active");

  // 2. Add the active class to the clicked tab
  clickedTabElement.classList.add("active");

  // 3. Update your app state and render tasks
  localStorage.setItem("activeTab", tabName.trim());
  renderTasks(tabName);
}

export {
  sidebar,
  createNewProject,
  submitProjectName,
  addProjectToTaskForm,
  showTasksByProject,
  renderTasks,
  setActiveTab,
};
