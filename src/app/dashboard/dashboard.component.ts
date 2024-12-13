import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { Router } from '@angular/router';

export interface Post {
	id: string;
	title: string;
	description: string;
	owenerEmail: string;
  createdAt: string;
  updatedAt: string;
  tags: string;
  comments: Comment[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ SharedModule ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent {
  posts: any[] = [];
  paginatedPosts: any[] = [];
  errorMsg: string = '';
  currentPage: number = 1; 
  totalPages: number = 1; 
  itemsPerPage: number = 3;
  searchTag: string = '';
  isEdited : boolean = false;
  currentPostId: string = '';
  userEmail: string | null = null;
  newPost = { title: '', description: '', ownerEmail: '', createdAt: '', tags: '' };
  updatedPost = { title: '', description: '', ownerEmail: '', updatedAt: '', tags: '' }


  constructor(private router: Router) {
    this.userEmail = localStorage.getItem('email');
    this.fetchPosts();
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
      
      this.totalPages = Math.ceil(this.posts.length / this.itemsPerPage);
      this.updatePaginatedPosts();

    } catch (error) {
      this.errorMsg = 'Failed to load posts.please try again'
      this.totalPages = 1;
    }
  }

  updatePaginatedPosts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedPosts = this.posts.slice(startIndex, endIndex);
    }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedPosts();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedPosts();
    }
  }

  filterPostsByTag() {
    if (this.searchTag) {
      const filteredPosts = this.posts.filter((post) =>
        post.tags?.some((tag: string) =>
        tag.toLowerCase().includes(this.searchTag.toLowerCase())
        )
      )
      this.totalPages = Math.ceil(filteredPosts.length / this.itemsPerPage);
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
    } else {
      this.totalPages = Math.ceil(this.posts.length / this.itemsPerPage);
      this.updatePaginatedPosts();
    }
  }

  async addPost(){
    if (!this.newPost.title || !this.newPost.description) {
      alert('Title and description are required!');
      return;
    }

    const now = new Date().toLocaleString('en-CA', {
      timeZone: 'America/Toronto',
      dateStyle: 'short',
      timeStyle: 'medium',
    });
    
    const payload = {
      title: this.newPost.title,
      description: this.newPost.description,
      ownerEmail: localStorage.getItem('email'),
      createdAt: now,
      tags: this.newPost.tags,
    }

    try {
      const response = await fetch("https://smooth-comfort-405104.uc.r.appspot.com/document/createorupdate/posts/", {
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

      alert('Post added successfully!');
      this.newPost = { title: '', description: '', ownerEmail: '', createdAt: '', tags: '' }; 
      this.fetchPosts(); 
    } catch (error) {
      console.error('Error adding post', error);
      alert('Failed to add post. Please try again.');
    }
  }

  async deletePost(postId: any) {
    if (!confirm('Are you sure you want to delete this post?'))
      return;

    try {
      const response = await fetch(`https://smooth-comfort-405104.uc.r.appspot.com/document/deleteOne/posts/${postId}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json', 
          "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTg5YWFlY2FhNWVjNzQ5NDQxMThhNyIsInVzZXJuYW1lIjoicG91cnZhaGFieWFuYmFyeS5hQG5vcnRoZWFzdGVybi5lZHUiLCJpYXQiOjE3MzI1OTY2NjUsImV4cCI6MTczNDc1NjY2NX0.YB0DSMgueM3PgJmFYNHIbZBkbHICPFPztCblZixSI20",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      alert('Post deleted SUCCESSFULLY');
      this.fetchPosts();
    } catch (error) {
      console.error('Error deleting post ', error);
      alert('Failed to delete the post. Please try again!')
    }
  } 

  editPost(post: any) {
    this.newPost.title = post.title;
    this.newPost.description = post.description;
    this.newPost.tags = post.tags;
    this.isEdited = true;
    this.currentPostId = post._id;
  }
  
  async updatePost(postId: any) {
      if (!this.newPost.title || !this.newPost.description) {
        alert('Title and description are required!');
        return;
      }
  
      const now = new Date().toLocaleString('en-CA', {
        timeZone: 'America/Toronto',
        dateStyle: 'short',
        timeStyle: 'medium',
      });
      
      const payload = {
        title: this.newPost.title,
        description: this.newPost.description,
        ownerEmail: localStorage.getItem('email'),
        updatedAt: now,
        tags: this.newPost.tags,
      }
  
      try {
        const response = await fetch(`https://smooth-comfort-405104.uc.r.appspot.com/document/updateOne/posts/${this.currentPostId}`, {
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
  
        alert('Post updated successfully!');
        this.updatedPost = { title: '', description: '', ownerEmail: '', updatedAt: '', tags: '' }; 
        this.fetchPosts(); 
        this.isEdited = false;
      } catch (error) {
        console.error('Error adding post', error);
        alert('Failed to add post. Please try again.');
      }
    }

  isEditedMethod() {
    this.isEdited = true;
    return;
  }

  showMore(postId: string) {
    this.router.navigate(['/post', postId]);
  }

  isAdmin(): boolean {
		const role = localStorage.getItem('role');
		return role?.toLowerCase() === 'admin';
	}
}


  



