function getTodos() {
    return JSON.parse(localStorage.getItem("todos") || "[]");
}

function saveTodos(todos) {
    localStorage.setItem("todos", JSON.stringify(todos));
}

window.onload = function(){
    const params = new URLSearchParams(location.search);
    const editIndex = params.get("edit");
    const form = document.getElementById("todoForm");

    if(editIndex !== null){
        document.getElementById("formTitle").innerText = "일정 수정";
        const todos = getTodos();
        const todo = todos[editIndex];

        document.getElementById("content").value = todo.content;
        document.getElementById("dueDate").value = todo.dueDate;
        document.getElementById("priority").value = todo.priority;
        document.getElementById("editIndex").value = editIndex;
    }

    form.onsubmit = function(e) {
        e.preventDefault();
        const todos = getTodos();
        const todo = {
            content: document.getElementById("content").value,
            dueDate: document.getElementById("dueDate").value,
            priority: document.getElementById("priority").value,
            status: "진행중"
        };

        const index = document.getElementById("editIndex").value;
        if(index == ""){
            todos.push(todo);
        } else {
            todos[parseInt(index)] = todo;
        }

        saveTodos(todos);

        if(window.opener){
            window.opener.location.reload();
        }

        window.close();
    };
}