document.addEventListener("DOMContentLoaded", function () {
  const todoInput = document.getElementById("todo-input");
  const addTodoBtn = document.getElementById("add-todo-btn");
  const todoList = document.getElementById("todo-list");
  const prioritySelect = document.getElementById("priority-select");
  const statusSelect = document.getElementById("status-select");
  const dueDateInput = document.getElementById("due-date");
  const filterPriority = document.getElementById("filter-priority");
  const filterStatus = document.getElementById("filter-status");
  const filterDate = document.getElementById("filter-date");

  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const pageInfo = document.getElementById("page-info");

  const emailInput = document.getElementById("email-input");
  const subscribeCheckbox = document.getElementById("subscribe-checkbox");
  const subscribeBtn = document.getElementById("subscribe-btn");

  const todosPerPage = 3;
  let currentPage = 1;
  let todos = [];

  addTodoBtn.addEventListener("click", addTodo);
  filterPriority.addEventListener("change", renderTodos);
  filterStatus.addEventListener("change", renderTodos);
  filterDate.addEventListener("change", renderTodos);
  prevBtn.addEventListener("click", prevPage);
  nextBtn.addEventListener("click", nextPage);

  subscribeBtn.addEventListener("click", function () {
    const email = emailInput.value.trim();

    if (!subscribeCheckbox.checked) {
      alert("Please check the box to subscribe.");
      return;
    }

    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Redirect to a new page (e.g., thank you page)
    window.location.href = "thank-you.html";
  });

  function validateEmail(email) {
    // Simple email validation
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function addTodo() {
    const taskText = todoInput.value.trim();
    const priority = prioritySelect.value;
    const status = statusSelect.value;
    const dueDate = dueDateInput.value;

    if (taskText === "" || dueDate === "") {
      alert("Please enter a task and select a due date.");
      return;
    }

    const todoItem = {
      text: taskText,
      priority: priority,
      status: status,
      dueDate: dueDate,
    };

    todos.push(todoItem);
    todoInput.value = "";
    dueDateInput.value = "";

    renderTodos();
  }

  function renderTodos() {
    todoList.innerHTML = "";

    const filteredTodos = filterTasks();
    const totalPages = Math.ceil(filteredTodos.length / todosPerPage);

    if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    const start = (currentPage - 1) * todosPerPage;
    const end = start + todosPerPage;
    const paginatedTodos = filteredTodos.slice(start, end);

    paginatedTodos.forEach((todoItem, index) => {
      const li = document.createElement("li");
      li.className = "todo-item";
      li.setAttribute("draggable", "true");
      li.setAttribute("data-priority", todoItem.priority);
      li.setAttribute("data-status", todoItem.status);
      li.setAttribute("data-due-date", todoItem.dueDate);

      const taskSpan = document.createElement("span");
      taskSpan.className = "task-text";
      taskSpan.textContent = todoItem.text;

      const labelsDiv = document.createElement("div");
      labelsDiv.className = "task-labels";
      labelsDiv.innerHTML = `
                  <span>Priority: ${todoItem.priority}</span>
                  <span>Status: ${todoItem.status}</span>
                  <span>Due: ${todoItem.dueDate}</span>
              `;

      const actionsDiv = document.createElement("div");
      actionsDiv.className = "todo-actions";

      const editBtn = document.createElement("button");
      editBtn.innerHTML = "✏️";
      editBtn.addEventListener("click", () =>
        editTask(todoItem, li, taskSpan, labelsDiv)
      );

      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = "🗑️";
      deleteBtn.addEventListener("click", () => deleteTask(li));

      const completeBtn = document.createElement("button");
      completeBtn.innerHTML = "✔️";
      completeBtn.addEventListener("click", () => toggleComplete(li));

      actionsDiv.appendChild(completeBtn);
      actionsDiv.appendChild(editBtn);
      actionsDiv.appendChild(deleteBtn);

      li.appendChild(taskSpan);
      li.appendChild(labelsDiv);
      li.appendChild(actionsDiv);

      todoList.appendChild(li);
    });

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
  }

  function filterTasks() {
    const selectedPriority = filterPriority.value;
    const selectedStatus = filterStatus.value;
    const selectedDate = filterDate.value;

    return todos.filter((todoItem) => {
      const itemPriority = todoItem.priority;
      const itemStatus = todoItem.status;
      const itemDueDate = new Date(todoItem.dueDate);

      const today = new Date();
      const startOfWeek = new Date(
        today.setDate(today.getDate() - today.getDay())
      );
      const startOfNextWeek = new Date(startOfWeek);
      startOfNextWeek.setDate(startOfNextWeek.getDate() + 7);
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const startOfNextMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        1
      );
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      const startOfNextYear = new Date(today.getFullYear() + 1, 0, 1);

      let dateMatch = true;

      switch (selectedDate) {
        case "today":
          dateMatch = isSameDay(itemDueDate, new Date());
          break;
        case "this-week":
          dateMatch =
            itemDueDate >= startOfWeek && itemDueDate < startOfNextWeek;
          break;
        case "next-week":
          dateMatch =
            itemDueDate >= startOfNextWeek && itemDueDate < startOfNextMonth;
          break;
        case "this-month":
          dateMatch =
            itemDueDate >= startOfMonth && itemDueDate < startOfNextMonth;
          break;
        case "this-year":
          dateMatch =
            itemDueDate >= startOfYear && itemDueDate < startOfNextYear;
          break;
        default:
          dateMatch = true;
      }

      const priorityMatch =
        selectedPriority === "all" || selectedPriority === itemPriority;
      const statusMatch =
        selectedStatus === "all" || selectedStatus === itemStatus;

      return priorityMatch && statusMatch && dateMatch;
    });
  }

  function prevPage() {
    if (currentPage > 1) {
      currentPage--;
      renderTodos();
    }
  }

  function nextPage() {
    const filteredTodos = filterTasks();
    const totalPages = Math.ceil(filteredTodos.length / todosPerPage);

    if (currentPage < totalPages) {
      currentPage++;
      renderTodos();
    }
  }

  function isSameDay(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  function editTask(todoItem, li, taskSpan, labelsDiv) {
    const newTaskText = prompt("Edit task text:", todoItem.text);
    if (newTaskText === null || newTaskText.trim() === "") return;
    todoItem.text = newTaskText;

    const newPriority = prompt(
      `Edit priority (${todoItem.priority}):`,
      todoItem.priority
    );
    if (newPriority !== null && newPriority.trim() !== "") {
      todoItem.priority = newPriority;
    }

    const newStatus = prompt(
      `Edit status (${todoItem.status}):`,
      todoItem.status
    );
    if (newStatus !== null && newStatus.trim() !== "") {
      todoItem.status = newStatus;
    }

    const newDueDate = prompt(
      `Edit due date (${todoItem.dueDate}):`,
      todoItem.dueDate
    );
    if (newDueDate !== null && newDueDate.trim() !== "") {
      todoItem.dueDate = newDueDate;
    }

    taskSpan.textContent = todoItem.text;
    labelsDiv.innerHTML = `
              <span>Priority: ${todoItem.priority}</span>
              <span>Status: ${todoItem.status}</span>
              <span>Due: ${todoItem.dueDate}</span>
          `;

    renderTodos();
  }

  function deleteTask(li) {
    const taskText = li.querySelector(".task-text").textContent;
    todos = todos.filter((todo) => todo.text !== taskText);
    renderTodos();
  }

  function toggleComplete(li) {
    const taskText = li.querySelector(".task-text").textContent;
    const todoItem = todos.find((todo) => todo.text === taskText);
    if (todoItem) {
      todoItem.status = todoItem.status === "done" ? "active" : "done";
    }
    renderTodos();
  }
});
