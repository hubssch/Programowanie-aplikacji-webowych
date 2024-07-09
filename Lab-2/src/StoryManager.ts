import { Story, StoryStatus } from './Story';

export class StoryManager {
    private stories: Story[] = [];
    private nextId = 1;

    createStory(name: string, description: string, priority: 'low' | 'medium' | 'high', projectId: number, ownerId: number): Story {
        const story = new Story(this.nextId++, name, description, priority, projectId, new Date(), StoryStatus.TODO, ownerId);
        this.stories.push(story);
        return story;
    }

    getStories(projectId: number): Story[] {
        return this.stories.filter(story => story.projectId === projectId);
    }

    updateStory(id: number, updatedData: Partial<Story>): Story | null {
        const story = this.stories.find(story => story.id === id);
        if (story) {
            Object.assign(story, updatedData);
            return story;
        }
        return null;
    }

    deleteStory(id: number): boolean {
        const index = this.stories.findIndex(story => story.id === id);
        if (index !== -1) {
            this.stories.splice(index, 1);
            return true;
        }
        return false;
    }
}