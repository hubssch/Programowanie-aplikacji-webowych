import { db } from './firebaseConfig';
import { ref, set, push, onValue, remove, update } from 'firebase/database';

interface Task {
    id: string;
    name: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    storyId: string;
    estimatedTime: number;
    status: 'todo' | 'doing' | 'done';
    createdDate: string;
    startDate?: string;
    endDate?: string;
    ownerId?: string;
}

class TaskManager {
    private taskListElement: HTMLElement | null;
    private currentStoryId: string | null;

    constructor() {
        this.taskListElement = document.querySelector("#task-list");
        this.currentStoryId = null;
    }

    public setStoryId(storyId: string): void {
        this.currentStoryId = storyId;
    }

    public async addTask(name: string, description: string, priority: 'low' | 'medium' | 'high', estimatedTime: number): Promise<void> {
        if (!this.currentStoryId) return;
        try {
            const newTaskRef = push(ref(db, `projects/${this.currentStoryId}/tasks`));
            await set(newTaskRef, {
                name,
                description,
                priority,
                storyId: this.currentStoryId,
                estimatedTime,
                status: 'todo',
                createdDate: new Date().toISOString(),
            });
            console.log("Task added!");
            this.getTasks();
        } catch (error) {
            console.error("Error adding task: ", error);
            alert("Error adding task: " + (error as Error).message);
        }
    }

    public getTasks(): void {
        if (!this.currentStoryId) return;
        const tasksRef = ref(db, `projects/${this.currentStoryId}/tasks`);
        onValue(tasksRef, (snapshot) => {
            const tasks: Task[] = [];
            snapshot.forEach((childSnapshot) => {
                tasks.push({ id: childSnapshot.key!, ...childSnapshot.val() });
            });
            this.renderTasks(tasks);
        });
    }

    public async deleteTask(id: string): Promise<void> {
        const confirmDeletion = confirm("Are you sure you want to delete this task?");
        if (confirmDeletion) {
            try {
                await remove(ref(db, `projects/${this.currentStoryId}/tasks/${id}`));
                console.log("Task deleted!");
                this.getTasks();
            } catch (error) {
                console.error("Error deleting task: ", error);
                alert("Error deleting task: " + (error as Error).message);
            }
        }
    }

    public async editTask(id: string, name: string, description: string, priority: 'low' | 'medium' | 'high', estimatedTime: number, status: 'todo' | 'doing' | 'done'): Promise<void> {
        const newName = prompt("Enter new task name:", name);
        const newDescription = prompt("Enter new task description:", description);
        const newPriority = prompt("Enter new task priority (low, medium, high):", priority);
        const newEstimatedTime = prompt("Enter new task estimated time (hours):", estimatedTime.toString());
        const newStatus = prompt("Enter new task status (todo, doing, done):", status);
        const updates: Partial<Task> = {};

        if (newName !== null && newDescription !== null && newPriority !== null && newEstimatedTime !== null && newStatus !== null && newName.trim() !== '' && newDescription.trim() !== '' && newPriority.trim() !== '' && newEstimatedTime.trim() !== '' && newStatus.trim() !== '') {
            updates.name = newName.trim();
            updates.description = newDescription.trim();
            updates.priority = newPriority.trim() as 'low' | 'medium' | 'high';
            updates.estimatedTime = parseInt(newEstimatedTime.trim());
            updates.status = newStatus.trim() as 'todo' | 'doing' | 'done';

            // Add additional fields based on status
            if (updates.status === 'doing') {
                updates.startDate = new Date().toISOString();
                updates.ownerId = prompt("Enter owner ID:");
            } else if (updates.status === 'done') {
                updates.endDate = new Date().toISOString();
                updates.ownerId = prompt("Enter owner ID:");
            }

            try {
                await update(ref(db, `projects/${this.currentStoryId}/tasks/${id}`), updates);
                console.log("Task updated!");
                this.getTasks();
            } catch (error) {
                console.error("Error updating task: ", error);
                alert("Error updating task: " + (error as Error).message);
            }
        }
    }

    private renderTasks(tasks: Task[]): void {
        if (this.taskListElement) {
            this.taskListElement.innerHTML = '';
            tasks.forEach((task) => {
                const taskListItem = document.createElement("li");
                const taskInfo = document.createElement("div");
                const buttonsDiv = document.createElement("div");

                taskInfo.classList.add("task-info");
                buttonsDiv.classList.add("buttons");

                const taskName = document.createElement("div");
                const taskDescription = document.createElement("div");
                const taskPriority = document.createElement("div");
                const taskEstimatedTime = document.createElement("div")
                const taskStatus = document.createElement("div");
                const taskEditButton = document.createElement("button");
                const taskDeleteButton = document.createElement("button");

                taskName.classList.add("task-name");
                taskDescription.classList.add("task-description");
                taskPriority.classList.add("task-priority");
                taskEstimatedTime.classList.add("task-estimated-time")
                taskStatus.classList.add("task-status");

                taskName.innerText = task.name;
                taskDescription.innerText = task.description;
                taskPriority.innerText = `Priority: ${task.priority}`;
                taskEstimatedTime.innerText = `Estimated Time: ${task.estimatedTime}`
                taskStatus.innerText = `Status: ${task.status}`;
                taskEditButton.innerText = "Edit";
                taskDeleteButton.innerText = "Delete";

                taskInfo.addEventListener('click', () => {
                    // Handle task detail view here
                });
                taskEditButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    this.editTask(task.id, task.name, task.description, task.priority, task.estimatedTime, task.status);
                });
                taskDeleteButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    this.deleteTask(task.id);
                });

                taskInfo.appendChild(taskName);
                taskInfo.appendChild(taskDescription);
                taskInfo.appendChild(taskPriority);
                taskInfo.appendChild(taskStatus);
                taskInfo.appendChild(taskEstimatedTime)
                buttonsDiv.appendChild(taskEditButton);
                buttonsDiv.appendChild(taskDeleteButton);

                taskListItem.appendChild(taskInfo);
                taskListItem.appendChild(buttonsDiv);
                this.taskListElement?.appendChild(taskListItem);
            });
        }
    }
}

export default TaskManager;
