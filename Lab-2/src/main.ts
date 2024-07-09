import './style.css';

const Add = document.querySelector("#add");
const Input = document.querySelector("#input") as HTMLInputElement;

Add?.addEventListener('click', addInputValueToTasks);

const localStorageKey = "tasksKey";

function getTasksFromLocalStorage() {
  const storedTasksJSON = localStorage.getItem(localStorageKey);
  return storedTasksJSON ? JSON.parse(storedTasksJSON) : [];
}

function saveTasksToLocalStorage(task: string[]) {
  const tasksJSON = JSON.stringify(task);
  localStorage.setItem(localStorageKey, tasksJSON);
  showLocalStorage();
}

function addInputValueToTasks() {
  const inputValue = Input.value;
  if (!inputValue) {  // Sprawdza, czy wprowadzona wartość po usunięciu białych znaków jest pusta
    alert("Error: Wartość jest pusta!");  // Wyświetla komunikat błędu
    return;  // Kończy wykonanie funkcji, aby nie dodawać pustego taska
  }

  if (Input) {
    const Tasks = getTasksFromLocalStorage();
    Tasks.push(inputValue);
    saveTasksToLocalStorage(Tasks);
    Input.value = "";
  }
}

function deleteTaskFromLocalStorage(index: number): void {
  const tasks = getTasksFromLocalStorage();

  // Wyświetl dialog potwierdzający z opcją OK i Cancel
  const confirmDeletion = confirm("Czy na pewno chcesz usunąć to zadanie?");

  // Kontynuuj tylko, jeśli użytkownik kliknie OK
  if (confirmDeletion) {
    if (index >= 0 && index < tasks.length) {
      tasks.splice(index, 1); // Usuń wartość na podanym indeksie z tablicy
      saveTasksToLocalStorage(tasks); // Zapisz zaktualizowaną tablicę do localStorage
      console.log(`Usunięto wartość z tablicy zadań na indeksie ${index}.`);
    } else {
      console.error("Nieprawidłowy indeks.");
      alert("Błąd: Podano nieprawidłowy indeks.");  // Opcjonalne: Informacja o błędzie, jeśli indeks jest poza zakresem
    }
  } else {
    console.log("Usunięcie zadania anulowane.");
  }

  showLocalStorage();
}

function editTask(index: number) {
  const tasks = getTasksFromLocalStorage();
  const newTaskValue = prompt("Wprowadź nową wartość zadania:", tasks[index]);

  if (newTaskValue !== null) {
    tasks[index] = newTaskValue;
    saveTasksToLocalStorage(tasks);
  }
}

function showLocalStorage() {
  const olElement = document.querySelector("#task-list");

  if (olElement) {
    while (olElement.firstChild) {
      olElement.removeChild(olElement.firstChild);
    }
  } else {
    console.error("Nie znaleziono elementu <ol>.");
  }
  const tasks = getTasksFromLocalStorage();
  for (let i = 0; i < tasks.length; i++) {
    const taskList = document.createElement("li");
    const taskEditButton = document.createElement("button");
    const taskDeleteButton = document.createElement("button");

    taskList.innerText = tasks[i];
    taskEditButton.innerText = "Edit";
    taskEditButton.id = `edit-button-${i}`;
    taskDeleteButton.innerText = "Delete";
    taskDeleteButton.id = `delete-button-${i}`;

    taskEditButton.addEventListener('click', () => editTask(i));
    taskDeleteButton.addEventListener('click', () => deleteTaskFromLocalStorage(i));

    taskList.appendChild(taskEditButton);
    taskList.appendChild(taskDeleteButton);
    olElement.appendChild(taskList);
  }
}

showLocalStorage();

//jakaś zmiana