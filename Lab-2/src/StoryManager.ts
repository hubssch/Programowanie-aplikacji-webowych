import { db } from './firebaseConfig';
import { ref, set, push, onValue, remove, update } from 'firebase/database';

interface Story {
    id: string;
    name: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
}

class StoryManager {
    private storyListElement: HTMLElement | null;
    private currentProjectId: string | null;

    constructor() {
        this.storyListElement = document.querySelector("#story-list");
        this.currentProjectId = null;
    }

    public setProjectId(projectId: string): void {
        this.currentProjectId = projectId;
        console.log("Ustawiono bieżące ID projektu na: ", this.currentProjectId); //legancko
    }

    public showProjectId() {
        console.log("Aktualny Projekt" + " " + this.currentProjectId) //null
    }

    public async addStory(name: string, description: string, priority: 'low' | 'medium' | 'high'): Promise<void> {
        console.log("Próba dodania historii do projektu o ID: ", this.currentProjectId); //null
        this.showProjectId()
        if (!this.currentProjectId) {
            alert("Error: Project ID is not set.");
            return;
        }
        try {
            const newStoryRef = push(ref(db, `projects/${this.currentProjectId}/stories`));
            await set(newStoryRef, {
                name,
                description,
                priority,
            });
            this.getStories();
        } catch (error) {
            console.error("Błąd podczas dodawania historii: ", error);
            alert("Błąd podczas dodawania historii: " + (error as Error).message);
        }
    }

    public getStories(): void {
        if (!this.currentProjectId) return;
        const storiesRef = ref(db, `projects/${this.currentProjectId}/stories`);
        onValue(storiesRef, (snapshot) => {
            const stories: Story[] = [];
            snapshot.forEach((childSnapshot) => {
                stories.push({ id: childSnapshot.key!, ...childSnapshot.val() });
            });
            this.renderStories(stories);
        });
    }

    public async deleteStory(id: string): Promise<void> {
        if (!this.currentProjectId) return;
        const confirmDeletion = confirm("Are you sure you want to delete this story?");
        if (confirmDeletion) {
            try {
                await remove(ref(db, `projects/${this.currentProjectId}/stories/${id}`));
                console.log("Story deleted!");
                this.getStories();
            } catch (error) {
                console.error("Error deleting story: ", error);
                alert("Error deleting story: " + (error as Error).message);
            }
        }
    }

    public async editStory(id: string, updates: Partial<Story>): Promise<void> {
        if (!this.currentProjectId) return;
        try {
            await update(ref(db, `projects/${this.currentProjectId}/stories/${id}`), updates);
            console.log("Story updated!");
            this.getStories();
        } catch (error) {
            console.error("Error updating story: ", error);
            alert("Error updating story: " + (error as Error).message);
        }
    }

    private renderStories(stories: Story[]): void {
        if (this.storyListElement) {
            this.storyListElement.innerHTML = '';
            stories.forEach((story) => {
                const storyListItem = document.createElement("li");
                const storyInfo = document.createElement("div");
                const buttonsDiv = document.createElement("div");

                storyInfo.classList.add("story-info");
                buttonsDiv.classList.add("buttons");

                const storyName = document.createElement("div");
                const storyDescription = document.createElement("div");
                const storyPriority = document.createElement("div");
                const storyEditButton = document.createElement("button");
                const storyDeleteButton = document.createElement("button");

                storyName.classList.add("story-name");
                storyDescription.classList.add("story-description");
                storyPriority.classList.add("story-priority");

                storyName.innerText = story.name;
                storyDescription.innerText = story.description;
                storyPriority.innerText = `Priority: ${story.priority}`;
                storyEditButton.innerText = "Edit";
                storyDeleteButton.innerText = "Delete";

                storyInfo.addEventListener('click', () => {
                    // Call the function to show the story details view
                });
                storyEditButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    this.editStory(story.id, { name: story.name, description: story.description, priority: story.priority });
                    console.log("Story edit")
                });
                storyDeleteButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    this.deleteStory(story.id);
                });

                storyInfo.appendChild(storyName);
                storyInfo.appendChild(storyDescription);
                storyInfo.appendChild(storyPriority);
                buttonsDiv.appendChild(storyEditButton);
                buttonsDiv.appendChild(storyDeleteButton);

                storyListItem.appendChild(storyInfo);
                storyListItem.appendChild(buttonsDiv);
                this.storyListElement?.appendChild(storyListItem);
            });
        }
    }
}

export default StoryManager;
