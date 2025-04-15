import { renderTodos, togglePrioritySort } from "./ui.js";
import { openTodoPopup, editTodo, deleteTodo } from "./events.js";

document.addEventListener("DOMContentLoaded", () => {
    renderTodos();

    const openBtn = document.getElementById("openBtn");
    const sortBtn = document.getElementById("sortBtn");

    if (openBtn) openBtn.onclick = openTodoPopup;
    if (sortBtn) sortBtn.onclick = togglePrioritySort;

    window.editTodo = editTodo;
    window.deleteTodo = deleteTodo;
});

window.addEventListener("storage", renderTodos);