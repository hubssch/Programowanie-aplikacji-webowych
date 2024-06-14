import './style.css'

const Add = document.querySelector("#add")
const Delete = document.querySelector("#delete")

const Input = document.querySelector("#input") as HTMLInputElement


// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `

// `

Add?.addEventListener('click', addInputValueToTasks)
Delete?.addEventListener('click', deleteTaskFromLocalStorage)


const localStorageKey = "tasksKey"

function getTasksFromLocalStorage() {
  const storedTasksJSON = localStorage.getItem(localStorageKey)
  return storedTasksJSON ? JSON.parse(storedTasksJSON) : []
}

function saveTasksToLocalStorage(task: string[]) {
  const tasksJSON = JSON.stringify(task)
  localStorage.setItem(localStorageKey, tasksJSON)
  showLocalStorage()
}



function addInputValueToTasks() {
  const inputValue = Input.value
  if (Input) {
    const Tasks = getTasksFromLocalStorage()
    Tasks.push(inputValue)
    saveTasksToLocalStorage(Tasks)
    Input.value = ""
  }
}

function deleteTaskFromLocalStorage(): void {
  const taskIndex = document.querySelector("#delete-input") as HTMLInputElement;
  const tasks = getTasksFromLocalStorage(); // Pobierz aktualną tablicę z localStorage

  if (taskIndex && taskIndex.value !== "") {
    const index = parseInt(taskIndex.value); // Konwertuj wartość na liczbę
    if (index >= 0 && index < tasks.length) {
      tasks.splice(index, 1); // Usuń wartość na podanym indeksie z tablicy
      saveTasksToLocalStorage(tasks); // Zapisz zaktualizowaną tablicę do localStorage
      console.log(`Usunięto wartość z tablicy zadań na indeksie ${index}.`);
    } else {
      console.error(`Nieprawidłowy indeks: ${index}.`);
    }
  } else {
    console.error("Nie podano indeksu do usunięcia.");
  }
  showLocalStorage()
}

// function editTask() {
//   const tasks = getTasksFromLocalStorage();
// }

function editTask(index: number) {
  const tasks = getTasksFromLocalStorage()
  const newTaskValue = prompt("Wprowadź nową wartość zadania:", tasks[index])

  if (newTaskValue !== null) {
    tasks[index] = newTaskValue
    saveTasksToLocalStorage(tasks)
  }
}


function showLocalStorage() {
  const olElement = document.querySelector("#task-list");

  if (olElement) {
    // Usunięcie wszystkich dzieci z elementu <ol>
    while (olElement.firstChild) {
      olElement.removeChild(olElement.firstChild);
    }
  } else {
    console.error("Nie znaleziono elementu <ol>.");
  }
  const tasks = getTasksFromLocalStorage();
  for (let i = 0; i < tasks.length; i++) {
    const taskList = document.createElement("li")
    const taskEditButton = document.createElement("button")
    taskList.innerText += tasks[i]
    taskEditButton.innerText = "Edit"
    taskEditButton.id = `edit-button-${i}`
    taskEditButton.addEventListener('click', () => editTask(i))
    document.getElementById("task-list")?.appendChild(taskList)
    document.getElementById("task-list")?.appendChild(taskEditButton)
  }
}
showLocalStorage()