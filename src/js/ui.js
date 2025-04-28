import { getTodos, saveTodos } from "./storage.js";
import { deleteTodo } from "./events.js";

let sortDescending = true;
let sortByDate = false;
let filterStatus = "전체";
let mobileToolbarInitialized = false;

export function togglePrioritySort() {
  sortByDate = false;
  sortDescending = !sortDescending;
  renderTodos();
  updateSortIndicators();
}

export function toggleDateSort() {
  sortByDate = true;
  sortDescending = !sortDescending;
  renderTodos();
  updateSortIndicators();
}

export function setFilter(status) {
  filterStatus = status;
  renderTodos();
}

export function deleteSelectedTodos() {
  const checkboxes = document.querySelectorAll(".todo-check:checked");
  const selectedIndexes = Array.from(checkboxes).map((cb) =>
    parseInt(cb.dataset.index)
  );
  if (selectedIndexes.length === 0) return;

  let todos = getTodos();
  todos = todos.filter((_, index) => !selectedIndexes.includes(index));
  saveTodos(todos);
  renderTodos();
}

export function toggleMobileToolbar() {
  const toolbar = document.getElementById("mobileToolbar");
  if (!mobileToolbarInitialized) {
    const createBtn = document.createElement("button");
    createBtn.textContent = "작성하기";
    createBtn.className = "mobile-toolbar-item mobile-toolbar-box";
    createBtn.onclick = () => document.getElementById("todoDialog").showModal();

    const priBtn = document.createElement("button");
    priBtn.textContent = "우선순위 정렬";
    priBtn.className = "mobile-toolbar-item mobile-toolbar-box";
    priBtn.onclick = togglePrioritySort;

    const dateBtn = document.createElement("button");
    dateBtn.textContent = "날짜순 정렬";
    dateBtn.className = "mobile-toolbar-item mobile-toolbar-box";
    dateBtn.onclick = toggleDateSort;

    const filter = document.createElement("select");
    filter.className = "mobile-toolbar-item mobile-toolbar-box";
    filter.innerHTML = `
      <option value="전체">전체</option>
      <option value="진행중">진행중</option>
      <option value="완료">완료</option>
    `;
    filter.onchange = (e) => setFilter(e.target.value);

    const del = document.createElement("button");
    del.textContent = "선택 항목 삭제";
    del.className = "mobile-toolbar-item mobile-toolbar-box danger-button";
    del.onclick = deleteSelectedTodos;

    toolbar.append(createBtn, priBtn, dateBtn, filter, del);
    mobileToolbarInitialized = true;
  }

  toolbar.classList.toggle("visible");
}

window.addEventListener("resize", () => {
  const toolbar = document.getElementById("mobileToolbar");
  if (window.innerWidth > 610 && toolbar.classList.contains("visible")) {
    toolbar.classList.remove("visible");
  }
});

export function renderTodos() {
  const list = document.getElementById("todoList");
  if (!list) return;
  list.innerHTML = "";

  let todos = getTodos();
  if (filterStatus !== "전체") {
    todos = todos.filter((todo) => todo.status === filterStatus);
  }

  todos = todos
    .map((todo, originalIndex) => ({ ...todo, originalIndex }))
    .sort((a, b) => {
      if (sortByDate) {
        const aDate = a.dueDate
          ? new Date(
              `${a.dueDate} ${a.hour || 0}:${a.minute || 0} ${a.ampm || "AM"}`
            )
          : null;
        const bDate = b.dueDate
          ? new Date(
              `${b.dueDate} ${b.hour || 0}:${b.minute || 0} ${b.ampm || "AM"}`
            )
          : null;
        if (!aDate && !bDate) return 0;
        if (!aDate) return sortDescending ? 1 : -1;
        if (!bDate) return sortDescending ? -1 : 1;
        return sortDescending ? bDate - aDate : aDate - bDate;
      } else {
        const priorityMap = { 높음: 3, 기본: 2, 낮음: 1 };
        const aPriority = priorityMap[a.priority] || 0;
        const bPriority = priorityMap[b.priority] || 0;
        return sortDescending ? bPriority - aPriority : aPriority - bPriority;
      }
    });

  const template = document.getElementById("todoTemplate");
  todos.forEach((todo) => {
    const clone = template.content.cloneNode(true);
    const checkbox = clone.querySelector(".todo-check");
    checkbox.dataset.index = todo.originalIndex;

    const editBtn = clone.querySelector(".edit-btn");
    editBtn.dataset.index = todo.originalIndex;
    editBtn.onclick = () => {
      const todos = getTodos();
      const target = todos[todo.originalIndex];
      if (!target) return;

      document.getElementById("editIndex").value = todo.originalIndex;
      document.getElementById("content").value = target.content;
      document.getElementById("dueDate").value = target.dueDate || "";
      document.getElementById("hour").value = target.hour || "";
      document.getElementById("minute").value =
        typeof target.minute === "number" ? target.minute : "";
      document.getElementById("ampm").value = target.ampm || "AM";
      document.getElementById("priority").value = target.priority || "기본";

      document.getElementById("todoDialog").showModal();
    };

    const deleteBtn = clone.querySelector(".delete-btn");
    deleteBtn.onclick = () => deleteTodo(todo.originalIndex);

    const title = clone.querySelector(".todo-title");
    const statusLabel = todo.status === "완료" ? "(완료) " : "";
    title.textContent = statusLabel + todo.content;
    title.classList.toggle("completed", todo.status === "완료");
    title.dataset.tooltip =
      todo.status === "완료" ? "진행중으로 변경" : "완료하기";

    title.onclick = () => {
      const allTodos = getTodos();
      const target = allTodos[todo.originalIndex];
      target.status = target.status === "완료" ? "진행중" : "완료";
      saveTodos(allTodos);
      renderTodos();
    };

    const details = clone.querySelector(".todo-details");
    const timeStr =
      todo.hour && todo.minute !== undefined && todo.ampm
        ? `${todo.hour}:${todo.minute.toString().padStart(2, "0")} ${todo.ampm}`
        : "미정";
    details.textContent = `마감일: ${
      todo.dueDate || "없음"
    } | 마감시간: ${timeStr} | 중요도: ${todo.priority}`;

    list.appendChild(clone);
  });

  updateSortIndicators();
}

function updateSortIndicators() {
  const sortBtn = document.getElementById("sortBtn");
  const dateSortBtn = document.getElementById("dateSortBtn");

  const arrowImg = document.createElement("img");
  arrowImg.className = "sort-icon";
  arrowImg.src = sortDescending
    ? "src/common/icons/downArrow.png"
    : "src/common/icons/upArrow.png";
  arrowImg.alt = sortDescending ? "내림차순" : "오름차순";
  

  const mobileSortBtn = document.querySelector(
    "#mobileToolbar button:nth-child(2)"
  );
  const mobileDateBtn = document.querySelector(
    "#mobileToolbar button:nth-child(3)"
  );

  if (!sortByDate) {
    if (sortBtn) {
      sortBtn.innerText = "우선순위 정렬";
      sortBtn.appendChild(arrowImg.cloneNode());
    }
    if (dateSortBtn) dateSortBtn.innerText = "날짜순 정렬";
    if (mobileSortBtn) {
      mobileSortBtn.innerText = "우선순위 정렬";
      mobileSortBtn.appendChild(arrowImg.cloneNode());
    }
    if (mobileDateBtn) mobileDateBtn.innerText = "날짜순 정렬";
  } else {
    if (sortBtn) sortBtn.innerText = "우선순위 정렬";
    if (dateSortBtn) {
      dateSortBtn.innerText = "날짜순 정렬";
      dateSortBtn.appendChild(arrowImg.cloneNode());
    }
    if (mobileSortBtn) mobileSortBtn.innerText = "우선순위 정렬";
    if (mobileDateBtn) {
      mobileDateBtn.innerText = "날짜순 정렬";
      mobileDateBtn.appendChild(arrowImg.cloneNode());
    }
  }
}
