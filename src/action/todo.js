import { getTodos, saveTodos } from "./storage.js";

window.onload = function () {
    const params = new URLSearchParams(location.search);
    const editIndex = params.get("edit");
    const form = document.getElementById("todoForm");

    if (editIndex !== null) {
        const todos = getTodos();
        const index = parseInt(editIndex, 10);
        const todo = todos[index];

        if (todo) {
            document.getElementById("formTitle").innerText = "일정 수정";
            document.getElementById("content").value = todo.content;
            document.getElementById("dueDate").value = todo.dueDate;
            document.getElementById("priority").value = todo.priority;
            document.getElementById("editIndex").value = index;
        }
    }

    form.onsubmit = function (e) {
        e.preventDefault();
        const todos = getTodos();
        const todo = {
            content: document.getElementById("content").value,
            dueDate: document.getElementById("dueDate").value,
            priority: document.getElementById("priority").value,
            status: "진행중"
        };

        const index = document.getElementById("editIndex").value;
        if (index === "") {
            todos.push(todo);
        } else {
            todo.status = todos[parseInt(index, 10)].status || "진행중";
            todos[parseInt(index, 10)] = todo;
        }

        saveTodos(todos);

        try {
            if (window.opener && window.opener.location) {
                window.opener.location.reload();
            }
        } catch (e) {
            console.warn("opener 접근 실패", e);
        }

        window.close();
    };
};