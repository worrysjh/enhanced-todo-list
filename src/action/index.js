import {
  renderTodos,
  togglePrioritySort,
  toggleDateSort,
  setFilter,
} from "./ui.js";
import { openTodoPopup, editTodo, deleteTodo } from "./events.js";

// 문서가 모두 로드된 후 실행될 초기화 코드
document.addEventListener("DOMContentLoaded", () => {
  renderTodos();

  // 버튼 및 필터 요소 가져오기
  const openBtn = document.getElementById("openBtn");
  const sortBtn = document.getElementById("sortBtn");
  const dateSortBtn = document.getElementById("dateSortBtn");
  const filterSelect = document.getElementById("filterSelect");

  // 버튼별 클릭시 각 기능 연결
  if (openBtn) openBtn.onclick = openTodoPopup;
  if (sortBtn) sortBtn.onclick = togglePrioritySort;
  if (dateSortBtn) dateSortBtn.onclick = toggleDateSort;
  if (filterSelect) filterSelect.onchange = (e) => setFilter(e.target.value);

  // 팝업에서 접근하기위해 수정,삭제 함수의 전역 등록
  window.editTodo = editTodo;
  window.deleteTodo = deleteTodo;
});

// 다른 탭에서 localStorage가 변동될 경우 자동으로 목록 렌더링
window.addEventListener("storage", renderTodos);
