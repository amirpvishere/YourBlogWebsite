import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { Router } from '@angular/router';
// import { AdminUserService } from '../admin-user.service';

export interface User {
	id: string;
	name: string;
	email: string;
	role: string;
  }

@Component({
	selector: 'app-manage-users',
	standalone: true,
	imports: [ SharedModule ],
	templateUrl: './manage-users.component.html',
	styleUrl: './manage-users.component.css'
})

export class ManageUsersComponent {
  users: any[] = [];
  errorMsg: string = '';
  searchTag: string = '';
  isEdited : boolean = false;
  currentUserId: string = '';
  userEmail: string | null = null;
  newUser = { name: '', email: '', role: '' };
  updatedUser = { name: '', email: '', role: '' };


  constructor(private router: Router) {
    this.userEmail = localStorage.getItem('email');
    this.fetchUsers();
  }

  async fetchUsers() {
    try{
      const response = await fetch("https://smooth-comfort-405104.uc.r.appspot.com/document/findAll/users", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json', 
          "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTg5YWFlY2FhNWVjNzQ5NDQxMThhNyIsInVzZXJuYW1lIjoicG91cnZhaGFieWFuYmFyeS5hQG5vcnRoZWFzdGVybi5lZHUiLCJpYXQiOjE3MzI1OTY2NjUsImV4cCI6MTczNDc1NjY2NX0.YB0DSMgueM3PgJmFYNHIbZBkbHICPFPztCblZixSI20",
        },
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
        console.log('Failed to fetch')
      }

      const users = await response.json();
      this.users = users.data;

    } catch (error) {
      console.log('Error fetching users ', error);
      this.errorMsg = 'Failed to load users.please try again'
    }
  }

  async addUser(){
    if (!this.newUser.name || !this.newUser.email) {
      alert('Name and Email are required!');
      return;
    }

    
    const payload = {
      title: this.newUser.name,
      description: this.newUser.email,
      ownerEmail: this.newUser.role,
    }

    try {
      const response = await fetch("https://smooth-comfort-405104.uc.r.appspot.com/document/createorupdate/users/", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json', 
          "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTg5YWFlY2FhNWVjNzQ5NDQxMThhNyIsInVzZXJuYW1lIjoicG91cnZhaGFieWFuYmFyeS5hQG5vcnRoZWFzdGVybi5lZHUiLCJpYXQiOjE3MzI1OTY2NjUsImV4cCI6MTczNDc1NjY2NX0.YB0DSMgueM3PgJmFYNHIbZBkbHICPFPztCblZixSI20",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Eror: ${response.statusText}`);
      }

      alert('User added successfully!');
      this.newUser = { name: '', email: '', role: '' }; 
      this.fetchUsers(); 
    } catch (error) {
      console.error('Error adding User', error);
      alert('Failed to add User. Please try again.');
    }
  }

  async deleteUser(userId: any) {
    if (!confirm('Are you sure you want to delete this User?'))
      return;

    try {
      const response = await fetch(`https://smooth-comfort-405104.uc.r.appspot.com/document/deleteOne/users/${userId}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json', 
          "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTg5YWFlY2FhNWVjNzQ5NDQxMThhNyIsInVzZXJuYW1lIjoicG91cnZhaGFieWFuYmFyeS5hQG5vcnRoZWFzdGVybi5lZHUiLCJpYXQiOjE3MzI1OTY2NjUsImV4cCI6MTczNDc1NjY2NX0.YB0DSMgueM3PgJmFYNHIbZBkbHICPFPztCblZixSI20",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      alert('User deleted SUCCESSFULLY');
      this.fetchUsers();
    } catch (error) {
      console.error('Error deleting User ', error);
      alert('Failed to delete the User. Please try again!')
    }
  } 

  editUser(user: any) {
    this.newUser.name = user.name;
    this.newUser.email = user.email;
    this.newUser.role = user.role;
    this.isEdited = true;
    this.currentUserId = user._id;
    console.log(user);
  }
  
  async updateUser(userId: any) {
    console.log(`${this.currentUserId}, ${userId}`);
      if (!this.newUser.name || !this.newUser.email) {
        alert('Name and Email are required!');
        return;
      }
      
      const payload = {
        name: this.newUser.name,
        email: this.newUser.email,
        role: this.newUser.role,
      }

      console.log(payload)
  
      try {
        const response = await fetch(`https://smooth-comfort-405104.uc.r.appspot.com/document/updateOne/users/${this.currentUserId}`, {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json', 
            "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTg5YWFlY2FhNWVjNzQ5NDQxMThhNyIsInVzZXJuYW1lIjoicG91cnZhaGFieWFuYmFyeS5hQG5vcnRoZWFzdGVybi5lZHUiLCJpYXQiOjE3MzI1OTY2NjUsImV4cCI6MTczNDc1NjY2NX0.YB0DSMgueM3PgJmFYNHIbZBkbHICPFPztCblZixSI20",
          },
          body: JSON.stringify(payload),
        })
  
        if (!response.ok) {
          throw new Error(`Eror: ${response.statusText}`);
        }
  
        alert('User updated successfully!');
        console.log(`${this.currentUserId}`);
        this.updatedUser = { name: '', email: '', role: '' }; 
        this.fetchUsers(); 
        this.isEdited = false;
      } catch (error) {
        console.error('Error adding user', error);
        alert('Failed to add user. Please try again.');
      }
    }

  isEditedMethod() {
    this.isEdited = true;
    return;
  }
}
