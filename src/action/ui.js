import { getTodos, saveTodos } from "./storage.js";
import { editTodo, deleteTodo } from "./events.js";

let sortDescending = true;

export function togglePrioritySort() {
    sortDescending = !sortDescending;
    renderTodos();
}

export function renderTodos() {
    const list = document.getElementById("todoList");
    list.innerHTML = "";
    let todos = getTodos();

    // 우선순위 기준 정렬
    const priorityMap = { "높음": 3, "기본": 2, "낮음": 1 };
    todos = todos
        .map((todo, originalIndex) => ({ ...todo, originalIndex })) // 인덱스 보존
        .sort((a, b) => {
            const aPriority = priorityMap[a.priority] || 0;
            const bPriority = priorityMap[b.priority] || 0;
            return sortDescending ? bPriority - aPriority : aPriority - bPriority;
        });

    todos.forEach((todo) => {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.status === "완료";
        checkbox.addEventListener("change", () => {
            const allTodos = getTodos();
            const target = allTodos[todo.originalIndex];
            target.status = checkbox.checked ? "완료" : "진행중";
            saveTodos(allTodos);
            renderTodos();
        });

        const span = document.createElement("span");
        span.innerText = `${todo.content} | ${todo.dueDate} | ${todo.priority}`;
        if (todo.status === "완료") {
            span.style.textDecoration = "line-through";
        }

        const editBtn = document.createElement("button");
        editBtn.innerText = "수정";
        editBtn.onclick = () => editTodo(todo.originalIndex);

        const delBtn = document.createElement("button");
        delBtn.innerText = "삭제";
        delBtn.onclick = () => deleteTodo(todo.originalIndex);

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(editBtn);
        li.appendChild(delBtn);

        list.appendChild(li);
    });
}
