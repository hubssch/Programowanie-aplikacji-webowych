// User.ts
export class User {
    id: number;
    firstName: string;
    lastName: string;

    constructor(id: number, firstName: string, lastName: string) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}

export class UserManager {
    private currentUser: User | null = null;

    setCurrentUser(user: User) {
        this.currentUser = user;
    }

    getCurrentUser(): User | null {
        return this.currentUser;
    }

    mockLogin() {
        this.currentUser = new User(1, "John", "Doe");
    }
}
