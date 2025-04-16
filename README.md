# ✨ 나만의 할 일 목록 (Enhanced To-Do List)

Vanilla JavaScript와 localStorage만을 활용하여 만든 **기능 강화형 할 일 관리 웹 애플리케이션**입니다.  
HTML5, CSS3, JavaScript의 기초부터 시맨틱 마크업과 반응형 디자인까지 학습하며 만들어가는 프로젝트입니다.

---

## 📌 주요 기술 스택

- **HTML5**: 시맨틱 태그 구조 (`<header>`, `<main>`, `<aside>` 등), `input`, `select` 등 폼 요소 활용  
- **CSS3**: Flexbox, Grid 기반 레이아웃, 트랜지션 효과, 반응형 미디어 쿼리, CSS 변수 사용  
- **JavaScript (Vanilla JS)**: DOM 조작, 이벤트 처리, localStorage CRUD, 상태 기반 UI 처리

---

## 🎯 프로젝트 목표

- **로컬 저장소(localStorage)**를 사용하여 브라우저 내에서 데이터를 저장/관리
- HTML/CSS의 **시맨틱 구조 및 스타일링 기법** 학습
- 사용자 친화적인 **UI/UX와 반응형 웹** 구현
- 실무형 개발 프로세스 기반의 기능 중심 프로젝트 경험

---

## 🛠 구현 기능

- 할 일 목록 **추가 / 수정 / 삭제 / 조회** (CRUD)
- **localStorage를 통한 데이터 영속성**
- 할 일 상태 체크: **진행중 / 완료** 전환
- **우선순위 정렬**, **날짜 정렬**
- **상태 필터링**: 전체 / 진행중 / 완료
- **반응형 디자인**: 모바일 햄버거 메뉴 + 드롭다운 툴바
- 팝업 UI로 일정 입력 (작성/수정)

---

## 📁 프로젝트 구조

```
📁 src/
├── action/            # JS 모듈 (UI, 이벤트, 저장소 로직)
│   ├── index.js
│   ├── ui.js
│   ├── events.js
│   └── storage.js
├── popup/
│   └── todolist.html  # 팝업으로 띄우는 일정 작성/수정 폼
├── styles/
│   ├── style.css       # 메인페이지 스타일
│   ├── mediaquery.css  # 반응형 미디어 쿼리
│   └── todoform.css    # 팝업용 CSS
index.html              # 메인 화면
```

---

## ✅ 사전 준비

- HTML/CSS 기초 (Flexbox 및 Grid 이해)
- Node.js 설치 (단, 이 프로젝트는 Node.js를 직접 사용하진 않음)
- Git, GitHub 계정
- PostgreSQL 설치 및 기본 이해 (다음 단계 확장 시 필요)

---

## 👨‍💻 차트

-- WorkFlow

---

## 📦 모듈 설명 (`src/action/`)

이 프로젝트는 주요 기능을 목적에 따라 다음과 같은 JavaScript 모듈로 분리하여 구성되어 있습니다.

### `index.js`
> 📌 기능 초기화 및 진입점

- 페이지 로드시 할 일 목록 렌더링 (`renderTodos`)
- 버튼 이벤트 연결: 작성하기, 정렬, 필터링
- 수정/삭제 함수를 전역으로 연결 (`window.editTodo`, `window.deleteTodo`)
- 전체 애플리케이션의 **진입점이자 중앙 허브 역할**


### `ui.js`
> 🎨 UI 렌더링 및 시각적 처리 담당

- `renderTodos()`: localStorage 데이터를 DOM에 표시
- `togglePrioritySort()`, `toggleDateSort()`: 정렬 기준 전환
- `toggleMobileToolbar()`: 모바일 툴바 동적 생성 및 표시
- `setFilter(status)`: 전체 / 진행중 / 완료 필터 적용


### `events.js`
> 🧩 주요 사용자 인터랙션 처리

- `openTodoPopup()`: 일정 추가용 팝업 열기
- `editTodo(index)`: 일정 수정용 팝업 열기
- `deleteTodo(index)`: 개별 항목 삭제
- `deleteSelectedTodos()`: 체크된 항목 일괄 삭제


### `storage.js`
> 💾 데이터 저장소 관리

- `getTodos()`: localStorage에서 todo 배열 불러오기
- `saveTodos(todos)`: localStorage에 todo 배열 저장

---


