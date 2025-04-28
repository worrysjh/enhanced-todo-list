/**
 * localStorage에서 저장된 할 일 목록(todo 배열)을 불러오는 함수
 * - 저장된 값이 없으면 빈 배열을 반환
 * - JSON 문자열을 파싱하여 JavaScript 배열로 변환
 */
export function getTodos() {
  return JSON.parse(localStorage.getItem("todos") || "[]");
}

/**
 * 주어진 할 일 목록(todo 배열)을 localStorage에 저장하는 함수
 * - JavaScript 배열을 JSON 문자열로 변환하여 저장
 * - 앱을 닫았다 열어도 데이터가 유지됨
 */
export function saveTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}
