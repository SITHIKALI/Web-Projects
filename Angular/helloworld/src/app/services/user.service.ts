import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  country: string;
  status: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly STORAGE_KEY = 'users_data';
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();

  constructor() {
    this.loadUsersFromStorage();
  }

  // Get all users from localStorage
  getUsers(): User[] {
    const users = localStorage.getItem(this.STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  }

  // Save users to localStorage
  private saveUsersToStorage(users: User[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    this.usersSubject.next(users);
  }

  // Load users from localStorage on service initialization
  private loadUsersFromStorage(): void {
    const users = this.getUsers();
    if (users.length === 0) {
      // Initialize with default data if localStorage is empty
      this.initializeDefaultUsers();
    } else {
      this.usersSubject.next(users);
    }
  }

  // Initialize with default users
  private initializeDefaultUsers(): void {
    const defaultUsers: User[] = [
      { id: 1, name: "Douglas Pace", email: "douglas@example.com", age: 30, country: "UK", status: 1 },
      { id: 2, name: "Mcleod Mueller", email: "mcleod@example.com", age: 25, country: "USA", status: 2 },
      { id: 3, name: "Day Meyers", email: "day@example.com", age: 35, country: "HK", status: 3 },
      { id: 4, name: "Aguirre Ellis", email: "aguirre@example.com", age: 28, country: "HZ", status: 1 },
      { id: 5, name: "Cook Tyson", email: "cook@example.com", age: 32, country: "LAN", status: 2 }
    ];
    this.saveUsersToStorage(defaultUsers);
  }

  // Add new user
  addUser(user: Omit<User, 'id'>): void {
    const users = this.getUsers();
    const newUser: User = {
      ...user,
      id: Date.now() // Simple ID generation
    };
    users.push(newUser);
    this.saveUsersToStorage(users);
    console.log('User added to localStorage:', newUser);
  }

  // Update existing user
  updateUser(id: number, updatedUser: Partial<User>): void {
    const users = this.getUsers();
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedUser };
      this.saveUsersToStorage(users);
      console.log('User updated in localStorage:', users[index]);
    }
  }

  // Delete user
  deleteUser(id: number): void {
    const users = this.getUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    this.saveUsersToStorage(filteredUsers);
    console.log('User deleted from localStorage, ID:', id);
  }

  // Find user by ID
  getUserById(id: number): User | undefined {
    const users = this.getUsers();
    return users.find(user => user.id === id);
  }

  // Find user by name
  getUserByName(name: string): User | undefined {
    const users = this.getUsers();
    return users.find(user => user.name === name);
  }

  // Clear all users from localStorage
  clearAllUsers(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.usersSubject.next([]);
    console.log('All users cleared from localStorage');
  }

  // Save current user session
  setCurrentUser(user: User): void {
    localStorage.setItem('current_user', JSON.stringify(user));
    console.log('Current user saved to localStorage:', user);
  }

  // Get current user session
  getCurrentUser(): User | null {
    const currentUser = localStorage.getItem('current_user');
    return currentUser ? JSON.parse(currentUser) : null;
  }

  // Clear current user session
  clearCurrentUser(): void {
    localStorage.removeItem('current_user');
    console.log('Current user session cleared');
  }
}
