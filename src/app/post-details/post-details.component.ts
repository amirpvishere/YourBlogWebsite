import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [ SharedModule ],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css'
})

export class PostDetailsComponent {
  post: any = null;
  errorMsg: string = '';
  replyingTo: string | null = null;
  newCommentContent: string = ';'
  hasLiked: boolean = false; 
  likeCount: number = 0; 

  constructor(private route:ActivatedRoute, private router: Router){
    const postId = this.route.snapshot.paramMap.get('id');
    this.fetchPostDetails(postId);
  }

  async fetchPostDetails(postId: string | null) {
    if (!postId) {
      this.errorMsg = 'Invalid Post ID';
      return;
    }

    try {
      const response = await fetch(`https://smooth-comfort-405104.uc.r.appspot.com/document/findOne/posts/${postId}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json', 
          "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTg5YWFlY2FhNWVjNzQ5NDQxMThhNyIsInVzZXJuYW1lIjoicG91cnZhaGFieWFuYmFyeS5hQG5vcnRoZWFzdGVybi5lZHUiLCJpYXQiOjE3MzI1OTY2NjUsImV4cCI6MTczNDc1NjY2NX0.YB0DSMgueM3PgJmFYNHIbZBkbHICPFPztCblZixSI20",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      this.post = { ...data.data, comments: this.formatComments(data.data.comments || []) };


    } catch (error) {
      console.error('Error fetching post details: ', error);
      this.errorMsg = 'Failed to fetch post details. Please try again!'
    }
  }

  formatComments(comments: any[]): any[] {
    const commentMap = new Map();
    comments.forEach(comment => {
      comment.children = [];
      commentMap.set(comment.id, comment);
    });

    const nestedComments: any[] = [];
    comments.forEach(comment => {
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.children.push(comment);
        }
      } else {
        nestedComments.push(comment);
      }
    });

    return nestedComments;
  }

  getTopLevelComments() {
    return this.post?.comments || [];
  }

  replyToComment(commentId: string) {
    this.replyingTo = commentId;
  }

  async addComment() {
    if (!this.newCommentContent) {
      alert('Comment content cannot be empty');
      return;
    }

    const payload = {
      postId: this.post.id,
      parentId: this.replyingTo,
      content: this.newCommentContent,
      author: localStorage.getItem('email'),
      createdAt: new Date().toISOString(),
    }

    if (!this.post.id) {
      console.error('Post ID is missing!');
      this.errorMsg = 'Invalid Post ID';
      return;
    }

    try{
      const response = await fetch('https://smooth-comfort-405104.uc.r.appspot.com/document/createorupdate/comments/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTg5YWFlY2FhNWVjNzQ5NDQxMThhNyIsInVzZXJuYW1lIjoicG91cnZhaGFieWFuYmFyeS5hQG5vcnRoZWFzdGVybi5lZHUiLCJpYXQiOjE3MzI1OTY2NjUsImV4cCI6MTczNDc1NjY2NX0.YB0DSMgueM3PgJmFYNHIbZBkbHICPFPztCblZixSI20",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('failed to add comment!');
      }

      alert('Comment added Successfully');
      this.newCommentContent = '';
      this.replyingTo = null;
      this.fetchPostDetails(this.post.id);
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    }
  }

  async toggleLike() {
    this.hasLiked = !this.hasLiked;

    const payload = {
      postId: this.post._id,
      userEmail: localStorage.getItem('email'),
      action: this.hasLiked ? 'like' : 'dislike', 
    };

    try {
      this.likeCount += this.hasLiked ? 1 : -1; 
    } catch (error) {
      console.error('Error toggling like/dislike: ', error);
      alert('Failed to update like/dislike. Please try again.');
    }
  }
  
  navigateToDashboard() {
  this.router.navigate(['/dashboard']);
  }
}
