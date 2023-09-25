// Initially display all todos
reconcilor([], JSON.parse(fetchTodosSync()));

// Synchronously fetch todos
function fetchTodosSync() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:3000/todos", false); // Pass `false` as the third argument for synchronous mode
  xhr.send();

  if (xhr.status === 200) {
    return xhr.responseText; // Return the response text
  } else {
    throw new Error(`Request failed with status ${xhr.status}`);
  }
}

// Run reconcilor every 5 second
function scheduleReconcilor() {
  let prevTodos = JSON.parse(fetchTodosSync());

  setInterval(() => {
    const newTodos = JSON.parse(fetchTodosSync());
    reconcilor(prevTodos, newTodos);
    prevTodos = newTodos;
  }, 5 * 1000);
}

scheduleReconcilor();

// Reconcilor
function reconcilor(prevTodos, newTodos) {
  const todosToRemove = [];
  const todosToUpdate = [];
  const todosToAdd = [];

  // Todos to remove
  for (let i = 0; i < prevTodos.length; i++) {
    let doesExist = false;
    for (let j = 0; j < newTodos.length; j++) {
      if (prevTodos[i].id == newTodos[j].id) {
        doesExist = true;
        break;
      }
    }
    if (!doesExist) {
      todosToRemove.push(prevTodos[i]);
    }
  }

  // Todos to add and upadate
  for (let i = 0; i < newTodos.length; i++) {
    let doesExist = false;
    for (let j = 0; j < prevTodos.length; j++) {
      if (newTodos[i].id == prevTodos[j].id) {
        doesExist = true;
        if ((newTodos[i].title != prevTodos[j].title) || (newTodos[i].description != prevTodos[j].description)) {
          todosToUpdate.push(newTodos[i]);
        }
        break;
      }
    }
    if (!doesExist) {
      todosToAdd.push(newTodos[i]);
    }
  }

  // Remove todos
  todosToRemove.forEach(todo => removeTodo(todo.id));

  // Add todos
  todosToAdd.forEach(todo => addTodo(todo));

  // Update todos
  todosToUpdate.forEach(todo => updateTodo(todo));
}

// Add todo to todoList
function addTodo(todo) {
  const todoList = document.getElementById("todoList");
  const newTodo = document.createElement("li");
  const todoTitle = document.createElement("span");
  const todoDescription = document.createElement("p");
  const todoDeleteButton = document.createElement("button");

  todoTitle.innerHTML = todo.title;
  todoDescription.innerHTML = todo.description;
  todoDeleteButton.innerHTML = "Delete";
  todoDeleteButton.setAttribute("id", todo.id);
  todoDeleteButton.setAttribute("onclick", `removeTodo(${todo.id})`)
  newTodo.append(todoTitle, todoDescription, todoDeleteButton);

  todoList.append(newTodo);
}

// Remove todo from todoList
function removeTodo(id) {
  const clickedDeleteButton = document.getElementById(id);
  const parentOfClickedDeleteButton = clickedDeleteButton.parentElement;
  parentOfClickedDeleteButton.remove();
}

// Update todo of todoList
function updateTodo(todo) {
  const deleteButtonWithRequestedId = document.getElementById(todo.id);
  const todoToUpdate = deleteButtonWithRequestedId.parentElement;
  const titleOfTodoToUpdate = todoToUpdate.querySelector("span");
  const descriptionOfTodoToUpdate = todoToUpdate.querySelector("p");

  titleOfTodoToUpdate.innerHTML = todo.title;
  descriptionOfTodoToUpdate.innerHTML = todo.description;
}


