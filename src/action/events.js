import { getTodos, saveTodos } from "./storage.js";
import { renderTodos } from "./ui.js";

// 새로운 할 일 추가를 위한 팝업창을 띄우는 함수
export function openTodoPopup() {
  window.open("src/popup/todolist.html", "일정 추가", "width=400,height=550");
}

// 기존 할 일 수정을 위한 팝업창을 띄우는 함수
export function editTodo(index) {
  window.open(
    `src/popup/todolist.html?edit=${index}`,
    "일정 수정",
    "width=400,height=550"
  );
}

// 지정한 인덱스의 할 일을 삭제하는 함수
export function deleteTodo(index) {
  const todos = getTodos();
  todos.splice(index, 1);
  saveTodos(todos);
  renderTodos();
}
