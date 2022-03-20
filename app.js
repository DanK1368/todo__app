const addTodo = document.querySelector(".form__add");
const todoList = document.querySelector(".todos");
const deleteAllButton = document.querySelector(".todos__delete-all");
const remainingTodos = document.querySelector(".todos__remaining");
const todosFilter = document.querySelector(".todos__filter");
const themeToggler = document.querySelector(".checkbox");
const themeIcon = document.querySelector(".header__icon");
const imgMobile = document.querySelector(".header__bg-img-mobile");
const imgDesktop = document.querySelector(".header__bg-img-desktop");
const stylesheet = document.querySelector(".stylesheet");
const draggables = document.querySelectorAll(".todos__item");

//counting how many todos left
const todoCount = () => {
  const items = todoList.children.length;
  const completedItems = Array.from(todoList.children).filter((todo) =>
    todo.classList.contains("completed")
  ).length;
  const total = items - completedItems;
  remainingTodos.textContent = `${total} items left`;
};
todoCount();

//template for new todo
const todoTemplate = (todo) => {
  const li = document.createElement("li");
  li.draggable = true;
  li.classList.add("todos__item", "todo-style");
  li.innerHTML = `
  <button class="todos__complete btn"></button>
    <p class="todos__text">${todo}</p>
    <button class="todos__delete">
        <img
            class="todos__delete__img"
            src="assets/icon-cross.svg"
            alt="an icon with the symbol x that will allow you to delete the selected todo "
        />
    </button>`;
  initTodoDragging(li);
  todoList.appendChild(li);
};

//generate new todo
addTodo.addEventListener("submit", (e) => {
  e.preventDefault();

  const todo = addTodo.form__add.value.trim();
  if (todo.length) {
    todoTemplate(todo);
    console.log(todo);
    addTodo.reset();
  }
  todoCount();
});

//delete or mark a todo as complete
todoList.addEventListener("click", (e) => {
  //delete a todo
  if (e.target.classList.contains("todos__delete__img")) {
    e.target.parentElement.parentElement.remove();
  }
  //mark/unmark as complete
  if (
    e.target.classList.contains("todos__complete") ||
    e.target.classList.contains("todos__complete__img")
  ) {
    e.target.parentElement.classList.toggle("completed");
  }

  todoCount();
});

//delete all completed todos
deleteAllButton.addEventListener("click", () => {
  Array.from(todoList.children)
    .filter((todo) => todo.classList.contains("completed"))
    .forEach((todo) => todo.remove());

  todoCount();
});

// filter todos function
const filterTodos = (word) => {
  Array.from(todoList.children)
    .filter((todo) => !todo.textContent.toLowerCase().includes(word))
    .forEach((todo) => todo.classList.add("filtered"));

  Array.from(todoList.children)
    .filter((todo) => todo.textContent.toLowerCase().includes(word))
    .forEach((todo) => todo.classList.remove("filtered"));
};

//searching todos
addTodo.addEventListener("keyup", (e) => {
  const word = addTodo.form__add.value.trim().toLowerCase();

  filterTodos(word);
});

//filter between All, Active, completed todos
todosFilter.addEventListener("click", (e) => {
  //display active todos
  if (e.target.classList.contains("todos__active")) {
    Array.from(todoList.children)
      .filter((todo) => todo.classList.contains("completed"))
      .forEach((todo) => todo.classList.add("filtered"));

    Array.from(todoList.children)
      .filter((todo) => !todo.classList.contains("completed"))
      .forEach((todo) => todo.classList.remove("filtered"));
  }
  // display completed todos
  else if (e.target.classList.contains("todos__completed")) {
    Array.from(todoList.children)
      .filter((todo) => !todo.classList.contains("completed"))
      .forEach((todo) => todo.classList.add("filtered"));

    Array.from(todoList.children)
      .filter((todo) => todo.classList.contains("completed"))
      .forEach((todo) => todo.classList.remove("filtered"));
  }
  // display all todos
  else if (e.target.classList.contains("todos__all")) {
    Array.from(todoList.children).forEach((todo) => {
      todo.classList.remove("filtered");
    });
  }
});

//change themes
themeToggler.addEventListener("change", (e) => {
  if (e.target.checked) {
    themeIcon.setAttribute("src", "assets/icon-moon.svg");
    imgMobile.setAttribute("src", "assets/bg-mobile-light.jpg");
    imgDesktop.setAttribute("src", "assets/bg-desktop-light.jpg");
    stylesheet.setAttribute("href", "styles/light_mode/main.css");
  } else {
    themeIcon.setAttribute("src", "assets/icon-sun.svg");
    imgMobile.setAttribute("src", "assets/bg-mobile-dark.jpg");
    imgDesktop.setAttribute("src", "assets/bg-desktop-dark.jpg");
    stylesheet.setAttribute("href", "styles/dark_mode/main.css");
  }
});

//drag and drop feature
function initTodoDragging(item) {
  item.addEventListener("dragstart", () => {
    item.classList.add("dragging");
  });
  item.addEventListener("dragend", () => {
    item.classList.remove("dragging");
  });
}
document.querySelectorAll(".todos__item").forEach(initTodoDragging);

todoList.addEventListener("dragover", (e) => {
  e.preventDefault();
  const afterElement = positionDraggableElement(todoList, e.clientY);
  const draggable = document.querySelector(".dragging");
  if (afterElement == null) {
    todoList.appendChild(draggable);
  } else {
    todoList.insertBefore(draggable, afterElement);
  }
});

function positionDraggableElement(todoList, y) {
  const draggableItems = [
    ...todoList.querySelectorAll(".todos__item:not(.dragging)"),
  ];

  return draggableItems.reduce(
    (closest, item) => {
      const box = item.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: item };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}
