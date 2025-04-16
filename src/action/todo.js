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
      document.getElementById("hour").value = todo.hour;
      document.getElementById("minute").value = todo.minute;
      document.getElementById("ampm").value = todo.ampm;
      document.getElementById("editIndex").value = index;
    }
  }

  form.onsubmit = function (e) {
    e.preventDefault();
    const hourVal = parseInt(document.getElementById("hour").value, 10);
    const minuteVal = parseInt(document.getElementById("minute").value, 10);
    if (hourVal < 1 || hourVal > 12 || minuteVal < 0 || minuteVal > 59) {
      alert("시간은 1~12 사이, 분은 0~59 사이로 입력해주세요.");
      return;
    }

    const todos = getTodos();
    const todo = {
      content: document.getElementById("content").value,
      dueDate: document.getElementById("dueDate").value,
      hour: hourVal,
      minute: minuteVal,
      ampm: document.getElementById("ampm").value,
      priority: document.getElementById("priority").value,
      status: "진행중",
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
