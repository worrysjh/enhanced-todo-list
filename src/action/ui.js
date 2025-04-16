import { getTodos, saveTodos } from "./storage.js";
import { editTodo, deleteTodo } from "./events.js";

let sortDescending = true;
let sortByDate = false;
let filterStatus = "전체"; // 전체, 완료, 진행중

export function togglePrioritySort() {
  sortByDate = false;
  sortDescending = !sortDescending;
  renderTodos();
}

export function toggleDateSort() {
  sortByDate = true;
  sortDescending = !sortDescending;
  renderTodos();
}

export function setFilter(status) {
  filterStatus = status;
  renderTodos();
}

export function renderTodos() {
  const list = document.getElementById("todoList");
  list.innerHTML = "";
  let todos = getTodos();

  // 필터링 적용
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

        const aDate = new Date(
          `${a.dueDate} ${a.hour || 0}:${a.minute || 0} ${a.ampm || "AM"}`
        );
        const bDate = new Date(
          `${b.dueDate} ${b.hour || 0}:${b.minute || 0} ${b.ampm || "AM"}`
        );
        return sortDescending ? bDate - aDate : aDate - bDate;
      } else {
        const priorityMap = { 높음: 3, 기본: 2, 낮음: 1 };
        const aPriority = priorityMap[a.priority] || 0;
        const bPriority = priorityMap[b.priority] || 0;
        return sortDescending ? bPriority - aPriority : aPriority - bPriority;
      }
    });

  todos.forEach((todo) => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.status === "완료";
    checkbox.addEventListener("change", () => {
      const allTodos = getTodos();
      const target = allTodos[todo.originalIndex];
      target.status = checkbox.checked ? "완료" : "진행중";
      saveTodos(allTodos);
      renderTodos();
    });

    const span = document.createElement("span");
    const timeStr =
      todo.hour && todo.minute !== undefined && todo.ampm
        ? `${todo.hour}:${todo.minute.toString().padStart(2, "0")} ${todo.ampm}`
        : "미정";
    const statusLabel = todo.status === "완료" ? "(완료) " : "";
    span.innerText = `${statusLabel}${todo.content} | ${todo.dueDate} | ${timeStr} | ${todo.priority}`;
    if (todo.status === "완료") {
      span.style.textDecoration = "line-through";
    }

    const editBtn = document.createElement("button");
    editBtn.innerText = "수정";
    editBtn.onclick = () => editTodo(todo.originalIndex);

    const delBtn = document.createElement("button");
    delBtn.innerText = "삭제";
    delBtn.onclick = () => deleteTodo(todo.originalIndex);

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(delBtn);

    list.appendChild(li);
  });
}
