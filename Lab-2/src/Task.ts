import Story from './Story.ts'
import User from './UserClass.ts'

export class Task {
    id: number;
    name: string;
    priority: 'low' | 'mid' | 'high';
    story: Story;
    expectedTime: string;
    state: 'todo' | 'doing' | 'done'
    date: Date;
    startDate: Date;
    endDate: Date;
    user: User;

    constructor(id: number, name: string, priority: 'low' | 'mid' | 'high', story: Story, expectedTime: string, state: 'todo' | 'doing' | 'done', date: Date, startDate: Date, endDate: Date, user: User) {
        this.id = id;
        this.name = name;
        this.priority = priority;
        this.story = story;
        this.expectedTime = expectedTime;
        this.state = state;
        this.date = date;
        this.startDate = startDate;
        this.endDate = endDate;
        this.user = user;
    }
}