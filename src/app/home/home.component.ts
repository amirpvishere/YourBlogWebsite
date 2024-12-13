import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  posts: any[] = [];
  errorMsg: string = '';
  isLoggedIn: boolean = false;

  constructor(private router: Router) {
    this.isLoggedIn = !!localStorage.getItem('email');
    if (this.isLoggedIn) {
      this.fetchPosts();
    }
  }


  async fetchPosts() {
    try{
      const response = await fetch("https://smooth-comfort-405104.uc.r.appspot.com/document/findAll/posts", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json', 
          "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTg5YWFlY2FhNWVjNzQ5NDQxMThhNyIsInVzZXJuYW1lIjoicG91cnZhaGFieWFuYmFyeS5hQG5vcnRoZWFzdGVybi5lZHUiLCJpYXQiOjE3MzI1OTY2NjUsImV4cCI6MTczNDc1NjY2NX0.YB0DSMgueM3PgJmFYNHIbZBkbHICPFPztCblZixSI20",
        },
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const posts = await response.json();
      this.posts = posts.data;
    } catch (error) {
      console.log('Error fetching posts ', error);
      this.errorMsg = 'Failed to load posts.please try again'
    }
  }

  showMore(postId: string){
    this.router.navigate(['/post', postId]);
  }

  navigateToLogin(){
    this.router.navigate(['/login']);
  }
}
