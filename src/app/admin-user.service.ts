import { Injectable } from '@angular/core';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {

  constructor() {}

  // Fetch all users
  async getUsers(): Promise<User[]> {
	console.log('-fetching--')
    const response = await fetch('https://smooth-comfort-405104.uc.r.appspot.com/document/findAll/users', {
      method:'GET', 
      headers: {
        'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTg5YWFlY2FhNWVjNzQ5NDQxMThhNyIsInVzZXJuYW1lIjoicG91cnZhaGFieWFuYmFyeS5hQG5vcnRoZWFzdGVybi5lZHUiLCJpYXQiOjE3MzI1OTY2NjUsImV4cCI6MTczNDc1NjY2NX0.YB0DSMgueM3PgJmFYNHIbZBkbHICPFPztCblZixSI20'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch users. Status: ${response.status}`);
    }

    const jsonResponse = await response.json();
    return jsonResponse.data;
  }

  // Add a new user
  async addUser(user: Partial<User>): Promise<User> {
    const response = await fetch('https://smooth-comfort-405104.uc.r.appspot.com/document/createorupdate/users', {
      method: 'POST',
      headers: {
        'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTg5YWFlY2FhNWVjNzQ5NDQxMThhNyIsInVzZXJuYW1lIjoicG91cnZhaGFieWFuYmFyeS5hQG5vcnRoZWFzdGVybi5lZHUiLCJpYXQiOjE3MzI1OTY2NjUsImV4cCI6MTczNDc1NjY2NX0.YB0DSMgueM3PgJmFYNHIbZBkbHICPFPztCblZixSI20',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error(`Failed to add user. Status: ${response.status}`);
    }
    const newUser: User = await response.json();
    return newUser;
  }

  // Update a user by ID
  async updateUser(id: number, user: Partial<User>): Promise<User> {
    const response = await fetch(`https://smooth-comfort-405104.uc.r.appspot.com/document/updateOne/users/${id}`, {
      method: 'PUT',
      headers: {
          'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTg5YWFlY2FhNWVjNzQ5NDQxMThhNyIsInVzZXJuYW1lIjoicG91cnZhaGFieWFuYmFyeS5hQG5vcnRoZWFzdGVybi5lZHUiLCJpYXQiOjE3MzI1OTY2NjUsImV4cCI6MTczNDc1NjY2NX0.YB0DSMgueM3PgJmFYNHIbZBkbHICPFPztCblZixSI20',
          'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error(`Failed to update user. Status: ${response.status}`);
    }
    const updatedUser: User = await response.json();
    return updatedUser;
  }

  // Delete a user by ID
  async deleteUser(id: number): Promise<void> {
    const response = await fetch(`https://smooth-comfort-405104.uc.r.appspot.com/document/deleteOne/users/${id}`, {
      method: 'DELETE',
      headers: {'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTg5YWFlY2FhNWVjNzQ5NDQxMThhNyIsInVzZXJuYW1lIjoicG91cnZhaGFieWFuYmFyeS5hQG5vcnRoZWFzdGVybi5lZHUiLCJpYXQiOjE3MzI1OTY2NjUsImV4cCI6MTczNDc1NjY2NX0.YB0DSMgueM3PgJmFYNHIbZBkbHICPFPztCblZixSI20',},
    });
    if (!response.ok) {
      throw new Error(`Failed to delete user. Status: ${response.status}`);
    }
  }
}
