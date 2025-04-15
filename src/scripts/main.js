console.log("main.js 연결");

function openPopup() {
    window.open("src/views/popup.html", "할 일 작성", "width=400, height=400");
    //임시로 가로 세로 400지정
}

function renderTodos() {
    console.log("리스트 렌더링 중");
    const list = document.getElementById("todo-list");
    const todos = JSON.parse(localStorage.getItem("todos"))||[];
    list.innerHTML="";

    todos.forEach((todo, index) =>{
        const li = document.createElement("li");
        
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.done || false;
        checkbox.addEventListener("change", () => {
            todos[index].done = checkbox.checked;
            localStorage.setItem("todos", JSON.stringify(todos));
            renderTodos();
        });

        const text = document.createElement("span");
        text.textContent = `${todo.text} | ${todo.due || "날짜 없음"} | 우선순위: ${todo.priority}`;
        if (todo.done) text.style.textDecoration = "line-through";
    
        const delBtn = document.createElement("button");
        delBtn.textContent = "삭제";
        delBtn.addEventListener("click", () => {
            todos.splice(index, 1);
            localStorage.setItem("todos", JSON.stringify(todos));
            renderTodos();
        });
    
        li.appendChild(checkbox);
        li.appendChild(text);
        li.appendChild(delBtn);
        list.appendChild(li);
    })
}

window.addEventListener("DOMContentLoaded", () => {
    renderTodos();
    window.addEventListener("focus", renderTodos); // 팝업 닫히고 포커스 돌아오면 새로고침
});