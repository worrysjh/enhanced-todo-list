import { getTodos, saveTodos } from "./storage.js";
import { renderTodos } from "./ui.js";

export function openTodoPopup() {
    window.open("src/popup/todolist.html", "일정 추가", "width=400,height=400");
}

export function editTodo(index) {
    window.open(`src/popup/todolist.html?edit=${index}`, "일정 수정", "width=400,height=400");
}

export function deleteTodo(index) {
    const todos = getTodos();
    todos.splice(index, 1);
    saveTodos(todos);
    renderTodos();
}