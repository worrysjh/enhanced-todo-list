import { getTodos, saveTodos } from "./storage.js";
import { renderTodos } from "./ui.js";

// 지정한 인덱스의 할 일을 삭제하는 함수
export function deleteTodo(index) {
  const todos = getTodos();
  todos.splice(index, 1);
  saveTodos(todos);
  renderTodos();
}