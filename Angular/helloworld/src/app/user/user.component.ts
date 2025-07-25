import { Component, OnInit } from '@angular/core';

// Simple User interface
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  country: string;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  users: User[] = [];

  ngOnInit(): void {
    this.loadUsersFromLocalStorage();
  }

  // Simple method to get data from LocalStorage
  loadUsersFromLocalStorage(): void {
    // Get data from localStorage
    const savedUsers = localStorage.getItem('users_data');
    
    if (savedUsers) {
      // If data exists, parse and display it
      this.users = JSON.parse(savedUsers);
      console.log('Users loaded from localStorage:', this.users);
    } else {
      // If no data, create some sample data and save it
      this.createSampleData();
    }
  }

  // Create sample data if localStorage is empty
  createSampleData(): void {
    this.users = [
      { id: 1, name: 'John Doe', email: 'john@example.com', age: 25, country: 'USA' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 30, country: 'UK' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35, country: 'Canada' },
      { id: 4, name: 'Alice Brown', email: 'alice@example.com', age: 28, country: 'Australia' }
    ];

    // Save sample data to localStorage
    this.saveUsersToLocalStorage();
    console.log('Sample data created and saved to localStorage');
  }

  // Simple method to save data to LocalStorage
  saveUsersToLocalStorage(): void {
    localStorage.setItem('users_data', JSON.stringify(this.users));
    console.log('Users saved to localStorage');
  }

  // Simple method to clear all data
  clearData(): void {
    localStorage.removeItem('users_data');
    this.users = [];
    console.log('All data cleared from localStorage');
  }
}
