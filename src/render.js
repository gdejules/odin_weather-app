import { Todo } from "./todos.js";
import { renderTasks } from "./sidebar.js";

class TaskCard {
  constructor(taskObject) {
    this.id = taskObject.id;
    this.titleText = taskObject.title;
    this.descText = taskObject.description;
    this.dueDate = taskObject.dueDate;
    this.priority = taskObject.priority;
    this.project = taskObject.project;
    this.completion = taskObject.completion;
  }

  createModal() {
    const dialog = document.createElement("dialog");
    dialog.id = "dialog";
    const editForm = document.createElement("form");

    const titleLabel = document.createElement("label");
    titleLabel.setAttribute("for", "title-edit");
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.setAttribute("name", "title-edit");
    titleInput.id = "title-edit";
    titleInput.value = this.titleText;
    titleLabel.appendChild(titleInput);

    const descLabel = document.createElement("label");
    descLabel.setAttribute("for", "desc-edit");
    const descInput = document.createElement("input");
    descInput.type = "text";
    descInput.setAttribute("name", "desc-edit");
    descInput.id = "desc-edit";
    descInput.value = this.descText;
    descLabel.appendChild(descInput);

    const closeBtn = document.createElement("button");
    closeBtn.className = "close-button";
    closeBtn.type = "submit";
    closeBtn.ariaLabel = "close";
    closeBtn.formMethod = "dialog";
    closeBtn.formNoValidate = "";
    closeBtn.textContent = "Close";

    editForm.appendChild(titleLabel);
    editForm.appendChild(descLabel);
    dialog.appendChild(editForm);
    dialog.appendChild(closeBtn);

    return dialog;
  }

  deleteTask(e) {
    const del = e.target.closest(".delete");

    if (del) {
      const taskCard = del.closest(".task-card");
      if (!taskCard) return;

      const currentProjects = JSON.parse(localStorage.getItem("project")) || [];
      const taskList = currentProjects.flatMap((p) => p.tasks);
      const taskId = taskCard.dataset.id;
      const task = taskList.find((task) => task.id === taskId);
      if (!task) return;

      const taskObject = new Todo(task);
      const taskProject = taskObject.findProject();
      if (!taskProject) return;
      taskProject.deleteTaskFromProject(taskId);
      const tabElement = document.querySelector(".tab.active");
      const tabName = tabElement.textContent.trim();

      taskProject.saveProjectToStorage();
      renderTasks(tabName);

      return;
    }
  }

  createCard() {
    const card = document.createElement("div");
    card.className = "task-card";
    if (this.completion) card.classList.add("archived");
    card.setAttribute("data-id", `${this.id}`); // create card id
    const circleMark = document.createElement("button");
    circleMark.className = "circle mark";
    const checkMark = document.createElement("button");
    checkMark.className = "check mark";
    const titleText = document.createElement("p");
    titleText.className = "task-title";
    const descText = document.createElement("p");
    descText.className = "description";
    const tags = document.createElement("div");
    tags.style.display = "flex";
    tags.style.gap = `var(--space-s)`;
    tags.className = "tags";
    const dueDate = document.createElement("p");
    dueDate.className = "date";
    const priority = document.createElement("p");
    priority.className = "priority tag";
    const project = document.createElement("p");
    project.className = "project tag";
    tags.appendChild(dueDate);
    tags.appendChild(priority);
    tags.appendChild(project);

    const svgCircle = `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="slategray"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="svg-default lucide lucide-circle-icon lucide-circle"
      >
        <circle cx="12" cy="12" r="10" />
      </svg>`;
    const svgCheck = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="lightgreen" stroke="green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-hover lucide lucide-circle-check-icon lucide-circle-check"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`;
    circleMark.innerHTML = svgCircle;
    circleMark.type = "button";
    circleMark.setAttribute("aria-label", "Complete task");
    checkMark.innerHTML = svgCheck;
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "mark container";
    buttonContainer.appendChild(checkMark);
    buttonContainer.appendChild(circleMark);

    const editBtn = document.createElement("button");
    editBtn.className = "edit";
    const svgPen = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen-icon lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>`;
    editBtn.innerHTML = svgPen;
    const editText = document.createElement("span");
    editText.textContent = "Edit";
    editBtn.appendChild(editText);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete";
    const svgDelete = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`;
    deleteBtn.innerHTML = svgDelete;
    const deleteText = document.createElement("span");
    deleteText.textContent = "Delete";
    deleteBtn.appendChild(deleteText);
    deleteBtn.addEventListener("click", this.deleteTask);

    const buttonWrapper = document.createElement("div");
    buttonWrapper.className = "edit-delete";
    buttonWrapper.appendChild(editBtn);
    buttonWrapper.appendChild(deleteBtn);

    titleText.textContent = this.titleText;
    descText.textContent = this.descText;
    dueDate.textContent = this.dueDate;
    priority.textContent = `Priority: ${this.priority}`;
    if (this.priority === "High") {
      priority.style.backgroundColor = "lightsalmon";
      priority.style.color = "crimson";
    } else if (this.priority === "Medium") {
      priority.style.backgroundColor = "lightyellow";
      priority.style.color = "coral";
    } else {
      priority.style.backgroundColor = "lightblue";
      priority.style.color = "navy";
    }
    project.textContent = `Project: ${this.project}`;
    card.appendChild(buttonContainer);
    card.appendChild(titleText);
    card.appendChild(descText);
    card.appendChild(tags);
    card.appendChild(buttonWrapper);

    return card;
  }
}

export { TaskCard };
