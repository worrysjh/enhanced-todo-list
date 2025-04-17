import {
  renderTodos,
  togglePrioritySort,
  toggleDateSort,
  setFilter,
} from "./ui.js";
import { editTodo, deleteTodo } from "./events.js";
import { getTodos, saveTodos } from "./storage.js";

document.addEventListener("DOMContentLoaded", () => {
  renderTodos();

  const openBtn = document.getElementById("openBtn");
  const sortBtn = document.getElementById("sortBtn");
  const dateSortBtn = document.getElementById("dateSortBtn");
  const filterSelect = document.getElementById("filterSelect");
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const todoList = document.getElementById("todoList");
  const todoDialog = document.getElementById("todoDialog");
  const cancelBtn = document.getElementById("cancelBtn");
  const form = document.getElementById("todoForm");

  if (openBtn) {
    openBtn.onclick = () => {
      form.reset();
      document.getElementById("editIndex").value = "";
      todoDialog.showModal();
    };
  }

  if (cancelBtn) cancelBtn.onclick = () => todoDialog.close();

  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();

      const hourVal = parseInt(document.getElementById("hour").value, 10);
      const minuteVal = parseInt(document.getElementById("minute").value, 10);
      if (hourVal < 1 || hourVal > 12 || minuteVal < 0 || minuteVal > 59) {
        alert("시간은 1~12 사이, 분은 0~59 사이로 입력해주세요.");
        return;
      }

      const todos = getTodos();
      const todo = {
        content: document.getElementById("content").value,
        dueDate: document.getElementById("dueDate").value,
        hour: hourVal,
        minute: minuteVal,
        ampm: document.getElementById("ampm").value,
        priority: document.getElementById("priority").value,
        status: "진행중",
      };

      const index = document.getElementById("editIndex").value;
      if (index === "") {
        todos.push(todo);
      } else {
        todo.status = todos[parseInt(index, 10)].status || "진행중";
        todos[parseInt(index, 10)] = todo;
      }

      saveTodos(todos);
      todoDialog.close();
      renderTodos();
    };
  }

  if (sortBtn) sortBtn.onclick = togglePrioritySort;
  if (dateSortBtn) dateSortBtn.onclick = toggleDateSort;
  if (filterSelect) filterSelect.onchange = (e) => setFilter(e.target.value);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      if (document.body.classList.contains("dark-mode")) {
        themeToggleBtn.innerText = "☀️ 라이트모드로 전환";
      } else {
        themeToggleBtn.innerText = "🌙 다크모드로 전환";
      }
    });
  }

  if (todoList && !todoList.classList.contains("grid-list")) {
    todoList.classList.add("grid-list");
  }

  window.editTodo = (index) => {
    const todos = getTodos();
    const todo = todos[index];

    if (!todo) return;

    document.getElementById("content").value = todo.content;
    document.getElementById("dueDate").value = todo.dueDate;
    document.getElementById("hour").value = todo.hour;
    document.getElementById("minute").value = todo.minute;
    document.getElementById("ampm").value = todo.ampm;
    document.getElementById("priority").value = todo.priority;
    document.getElementById("editIndex").value = index;

    todoDialog.showModal();
  };

  window.deleteTodo = deleteTodo;
});

window.addEventListener("storage", renderTodos);
