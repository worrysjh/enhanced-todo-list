import {
  renderTodos,
  togglePrioritySort,
  toggleDateSort,
  setFilter,
} from "./ui.js";
import { openTodoPopup, editTodo, deleteTodo } from "./events.js";

document.addEventListener("DOMContentLoaded", () => {
  renderTodos();

  const openBtn = document.getElementById("openBtn");
  const sortBtn = document.getElementById("sortBtn");
  const dateSortBtn = document.getElementById("dateSortBtn");
  const filterSelect = document.getElementById("filterSelect");

  if (openBtn) openBtn.onclick = openTodoPopup;
  if (sortBtn) sortBtn.onclick = togglePrioritySort;
  if (dateSortBtn) dateSortBtn.onclick = toggleDateSort;
  if (filterSelect) filterSelect.onchange = (e) => setFilter(e.target.value);

  window.editTodo = editTodo;
  window.deleteTodo = deleteTodo;
});

window.addEventListener("storage", renderTodos);
