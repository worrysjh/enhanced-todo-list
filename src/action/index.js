// 할 일 목록 불러오기
function getTodos() {
    return JSON.parse(localStorage.getItem("todos") || "[]");
}

// 할 일 목록 저장하기
function saveTodos(todos) {
    localStorage.setItem("todos", JSON.stringify(todos));
}

// 할 일 목록 렌더링
function renderTodos() {
    const list = document.getElementById("todoList");
    list.innerHTML = "";

    const todos = getTodos();

    todos.forEach((todo, index) => {
        // list item 요소
        const li = document.createElement("li");

        // 체크박스 생성
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.status === "완료";

        // 체크박스 변경 이벤트
        checkbox.addEventListener("change", () => {
            todo.status = checkbox.checked ? "완료" : "진행중";
            saveTodos(todos);
            renderTodos(); // 상태 변경 후 다시 렌더링
        });

        // 텍스트 출력 span
        const span = document.createElement("span");
        span.innerText = `${todo.content} | ${todo.dueDate} | ${todo.priority}`;

        if (todo.status === "완료") {
            span.style.textDecoration = "line-through";
        }

        // 수정 버튼
        const editBtn = document.createElement("button");
        editBtn.innerText = "수정";
        editBtn.onclick = () => editTodo(index);

        // 삭제 버튼
        const delBtn = document.createElement("button");
        delBtn.innerText = "삭제";
        delBtn.onclick = () => deleteTodo(index);

        // 조립
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(editBtn);
        li.appendChild(delBtn);

        list.appendChild(li);
    });
}

// 팝업 열기 (작성)
function openTodoPopup() {
    window.open("src/popup/todolist.html", "일정 추가", "width=400,height=400");
}

// 팝업 열기 (수정)
function editTodo(index) {
    window.open(`src/popup/todolist.html?edit=${index}`, "일정 수정", "width=400,height=400");
}

// 할 일 삭제
function deleteTodo(index) {
    const todos = getTodos();
    todos.splice(index, 1);
    saveTodos(todos);
    renderTodos();
}

// 페이지 로드시 렌더링
window.onload = renderTodos;

// 다른 창(localStorage 수정 시) 동기화
window.addEventListener("storage", renderTodos);

// HTML에서 호출할 수 있도록 전역 등록
window.openTodoPopup = openTodoPopup;
window.editTodo = editTodo;
window.deleteTodo = deleteTodo;