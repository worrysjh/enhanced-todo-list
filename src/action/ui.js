import { getTodos, saveTodos } from "./storage.js";
import { editTodo, deleteTodo } from "./events.js";

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
  const selectedIndexes = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index));

  if (selectedIndexes.length === 0) return;

  let todos = getTodos();
  todos = todos.filter((_, index) => !selectedIndexes.includes(index));
  saveTodos(todos);
  renderTodos();
}

// 창이 커지면 모바일 툴바 닫기
window.addEventListener("resize", () => {
  const toolbar = document.getElementById("mobile-toolbar");
  if (window.innerWidth > 768 && toolbar.classList.contains("visible")) {
    toolbar.classList.remove("visible");
  }
});

export function toggleMobileToolbar() {
  const toolbar = document.getElementById("mobile-toolbar");

  if (!mobileToolbarInitialized) {
    const createBtn = document.createElement("button");
    createBtn.textContent = "작성하기";
    createBtn.className = "mobile-toolbar-item mobile-toolbar-box";
    createBtn.onclick = () =>
      window.open("src/popup/todolist.html", "일정 추가", "width=400,height=550");

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
      <option value="완료">완료</option>`;
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
        const aHasDate = !!a.dueDate;
        const bHasDate = !!b.dueDate;

        if (!aHasDate && !bHasDate) return 0;
        if (!aHasDate) return sortDescending ? 1 : -1;
        if (!bHasDate) return sortDescending ? -1 : 1;

        const aDate = new Date(`${a.dueDate} ${a.hour || 0}:${a.minute || 0} ${a.ampm || "AM"}`);
        const bDate = new Date(`${b.dueDate} ${b.hour || 0}:${b.minute || 0} ${b.ampm || "AM"}`);
        return sortDescending ? bDate - aDate : aDate - bDate;
      } else {
        const priorityMap = { 높음: 3, 기본: 2, 낮음: 1 };
        const aPriority = priorityMap[a.priority] || 0;
        const bPriority = priorityMap[b.priority] || 0;
        return sortDescending ? bPriority - aPriority : aPriority - bPriority;
      }
    });

  const template = document.getElementById("todo-template");

  todos.forEach((todo) => {
    const clone = template.content.cloneNode(true);

    const checkbox = clone.querySelector(".todo-check");
    checkbox.dataset.index = todo.originalIndex;

    clone.querySelector(".edit-btn").onclick = () => editTodo(todo.originalIndex);
    clone.querySelector(".delete-btn").onclick = () => deleteTodo(todo.originalIndex);

    const title = clone.querySelector(".todo-title");
    const statusLabel = todo.status === "완료" ? "(완료) " : "";
    title.textContent = statusLabel + todo.content;
    title.onclick = () => {
      const allTodos = getTodos();
      const target = allTodos[todo.originalIndex];
      target.status = target.status === "완료" ? "진행중" : "완료";
      saveTodos(allTodos);
      renderTodos();
    };
    if (todo.status === "완료") {
      title.style.textDecoration = "line-through";
    }

    const details = clone.querySelector(".todo-details");
    const timeStr =
      todo.hour && todo.minute !== undefined && todo.ampm
        ? `${todo.hour}:${todo.minute.toString().padStart(2, "0")} ${todo.ampm}`
        : "미정";
    details.textContent = `마감일: ${todo.dueDate || "없음"} | 마감시간: ${timeStr} | 중요도: ${todo.priority}`;

    list.appendChild(clone);
  });

  updateSortIndicators();
}

function updateSortIndicators() {
  const sortBtn = document.getElementById("sortBtn");
  const dateSortBtn = document.getElementById("dateSortBtn");
  const arrow = sortDescending ? " 🔽" : " 🔼";

  if (!sortByDate) {
    sortBtn.textContent = "우선순위 정렬" + arrow;
    dateSortBtn.textContent = "날짜순 정렬";
  } else {
    dateSortBtn.textContent = "날짜순 정렬" + arrow;
    sortBtn.textContent = "우선순위 정렬";
  }
}
