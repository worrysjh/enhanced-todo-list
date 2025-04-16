import { getTodos, saveTodos } from "./storage.js";
import { editTodo, deleteTodo } from "./events.js";

// 정렬, 필터 등 ui 상태 저장 변수
let sortDescending = true;
let sortByDate = false;
let filterStatus = "전체";
let mobileToolbarInitialized = false;

// 우선순위 정렬 버튼 토글
export function togglePrioritySort() {
  sortByDate = false;
  sortDescending = !sortDescending;
  renderTodos();
}

// 날짜 정렬 버튼 토글
export function toggleDateSort() {
  sortByDate = true;
  sortDescending = !sortDescending;
  renderTodos();
}

// 할 일 상태 필터 변경
export function setFilter(status) {
  filterStatus = status;
  renderTodos();
}

// 체크된 항목 일괄 삭제
export function deleteSelectedTodos() {
  const checkboxes = document.querySelectorAll(".todo-check:checked");
  const selectedIndexes = Array.from(checkboxes).map((cb) =>
    parseInt(cb.dataset.index)
  );

  if (selectedIndexes.length === 0) return;

  let todos = getTodos();
  todos = todos.filter((_, index) => !selectedIndexes.includes(index));
  saveTodos(todos);
  renderTodos();
}

// 창이 다시 커졌을 때 mobile-toolbar 숨김 처리
window.addEventListener("resize", () => {
  const toolbar = document.getElementById("mobile-toolbar");
  if (window.innerWidth > 768 && toolbar.classList.contains("visible")) {
    toolbar.classList.remove("visible");
  }
});

// 모바일 툴바 항목의 동적 생성
export function toggleMobileToolbar() {
  const toolbar = document.getElementById("mobile-toolbar");
  if (!mobileToolbarInitialized) {
    const priBtn = document.createElement("button");
    priBtn.textContent = "우선순위 정렬";
    priBtn.className = "mobile-toolbar-item mobile-toolbar-box";
    priBtn.onclick = togglePrioritySort;

    const dateBtn = document.createElement("button");
    dateBtn.textContent = "날짜순 정렬";
    dateBtn.className = "mobile-toolbar-item mobile-toolbar-box";
    dateBtn.onclick = toggleDateSort;

    
    const filter = document.createElement("select");    
    filter.className = "mobile-toolbar-item mobile-toolbar-box";
    filter.innerHTML = `<option value="전체">전체</option><option value="진행중">진행중</option><option value="완료">완료</option>`;
    filter.onchange = (e) => setFilter(e.target.value);

    const del = document.createElement("button");
    del.textContent = "선택 항목 삭제";
    del.className = "mobile-toolbar-item mobile-toolbar-box danger-button";
    del.onclick = deleteSelectedTodos;

    const createBtn = document.createElement("button");
    createBtn.textContent = "작성하기";
    createBtn.className = "mobile-toolbar-item mobile-toolbar-box";
    createBtn.onclick = () =>
      window.open(
        "src/popup/todolist.html",
        "일정 추가",
        "width=400,height=550"
      );

    toolbar.append(createBtn, priBtn, dateBtn, filter, del);
    mobileToolbarInitialized = true;
  }
  toolbar.classList.toggle("visible");
}

// 할 일 목록을 화면에 렌더링
export function renderTodos() {
  const list = document.getElementById("todoList");
  if (!list) return;
  list.innerHTML = "";
  let todos = getTodos();

  // 필터링 여부
  if (filterStatus !== "전체") {
    todos = todos.filter((todo) => todo.status === filterStatus);
  }

  // 정렬
  todos = todos
    .map((todo, originalIndex) => ({ ...todo, originalIndex }))
    .sort((a, b) => {
      if (sortByDate) {
        const aHasDate = !!a.dueDate;
        const bHasDate = !!b.dueDate;

        if (!aHasDate && !bHasDate) return 0;
        if (!aHasDate) return sortDescending ? 1 : -1;
        if (!bHasDate) return sortDescending ? -1 : 1;

        const aDate = new Date(
          `${a.dueDate} ${a.hour || 0}:${a.minute || 0} ${a.ampm || "AM"}`
        );
        const bDate = new Date(
          `${b.dueDate} ${b.hour || 0}:${b.minute || 0} ${b.ampm || "AM"}`
        );
        return sortDescending ? bDate - aDate : aDate - bDate;
      } else {
        // 우선순위 정렬
        const priorityMap = { 높음: 3, 기본: 2, 낮음: 1 };
        const aPriority = priorityMap[a.priority] || 0;
        const bPriority = priorityMap[b.priority] || 0;
        return sortDescending ? bPriority - aPriority : aPriority - bPriority;
      }
    });

  // 정렬된 목록을 DOM 요소로 변환 및 렌더링
  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo-item narrow";

    const top = document.createElement("div");
    top.className = "todo-top";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-check";
    checkbox.dataset.index = todo.originalIndex;

    const btns = document.createElement("div");
    btns.className = "todo-buttons";

    const editBtn = document.createElement("button");
    editBtn.innerText = "✏️";
    editBtn.className = "edit-btn";
    editBtn.onclick = () => editTodo(todo.originalIndex);

    const delBtn = document.createElement("button");
    delBtn.innerText = "🗑️";
    delBtn.className = "delete-btn";
    delBtn.onclick = () => deleteTodo(todo.originalIndex);

    btns.appendChild(editBtn);
    btns.appendChild(delBtn);

    top.appendChild(checkbox);
    top.appendChild(btns);

    // 할 일 클릭시 완료,진행중 상태 토글
    const title = document.createElement("div");
    title.className = "todo-title";
    const statusLabel = todo.status === "완료" ? "(완료) " : "";
    title.innerText = statusLabel + todo.content;

    title.onclick = () => {
      const allTodos = getTodos();
      const target = allTodos[todo.originalIndex];
      target.status = target.status === "완료" ? "진행중" : "완료";
      saveTodos(allTodos);
      renderTodos();
    };

    // 상세 정보 출력(마감날짜,마감시간,우선순위)
    const details = document.createElement("div");
    details.className = "todo-details";
    const timeStr =
      todo.hour && todo.minute !== undefined && todo.ampm
        ? `${todo.hour}:${todo.minute.toString().padStart(2, "0")} ${todo.ampm}`
        : "미정";
    details.innerText = `마감일: ${
      todo.dueDate || "없음"
    } | 마감시간: ${timeStr} | 중요도: ${todo.priority}`;

    // 완료된 항목에 취소선 추가
    if (todo.status === "완료") {
      title.style.textDecoration = "line-through";
    }

    // 요소 조립 및 리스트에 추가
    li.appendChild(top);
    li.appendChild(title);
    li.appendChild(details);
    list.appendChild(li);
  });
}
