import { db } from './firebaseConfig';
import { ref, set, push, onValue, remove, update } from 'firebase/database';

interface Story {
    id: string;
    name: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    projectId: string;
    createdDate: string;
    status: 'todo' | 'doing' | 'done';
    ownerId: string;
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
    }

    public async addStory(name: string, description: string, priority: 'low' | 'medium' | 'high'): Promise<void> {
        if (!this.currentProjectId) return;
        try {
            const newStoryRef = push(ref(db, 'stories'));
            await set(newStoryRef, {
                name,
                description,
                priority,
                projectId: this.currentProjectId,
                createdDate: new Date().toISOString(),
                status: 'todo',
                ownerId: '', // Set the actual owner ID
            });
            console.log("Story added!");
            this.getStories();
        } catch (error) {
            console.error("Error adding story: ", error);
            alert("Error adding story: " + (error as Error).message);
        }
    }

    public getStories(): void {
        if (!this.currentProjectId) return;
        const storiesRef = ref(db, 'stories');
        onValue(storiesRef, (snapshot) => {
            const stories: Story[] = [];
            snapshot.forEach((childSnapshot) => {
                const story = childSnapshot.val();
                if (story.projectId === this.currentProjectId) {
                    stories.push({ id: childSnapshot.key!, ...story });
                }
            });
            this.renderStories(stories);
        });
    }

    public async deleteStory(id: string): Promise<void> {
        const confirmDeletion = confirm("Are you sure you want to delete this story?");
        if (confirmDeletion) {
            try {
                await remove(ref(db, `stories/${id}`));
                console.log("Story deleted!");
                this.getStories();
            } catch (error) {
                console.error("Error deleting story: ", error);
                alert("Error deleting story: " + (error as Error).message);
            }
        }
    }

    public async editStory(id: string, updates: Partial<Story>): Promise<void> {
        try {
            await update(ref(db, `stories/${id}`), updates);
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
