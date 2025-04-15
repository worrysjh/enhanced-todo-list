document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("todo-form");
    const input = document.getElementById("todo-input");
    console.log(input);
    const date = document.getElementById("due-date");
    const priority = document.getElementById("priority");
  
    form.addEventListener("submit", (e) => {
        //form의 새로고침으로 인해 localstorage 저장 전 새로고침 방지를 위한
        e.preventDefault();
  
        const newTodo = {
            text: input.value,
            due: date.value,
            priority: priority.value,
            done: false
        };
  
        const todos = JSON.parse(localStorage.getItem("todos")) || [];
        todos.push(newTodo);
        localStorage.setItem("todos", JSON.stringify(todos));
  
        window.close(); // 팝업 닫기
    });
  });