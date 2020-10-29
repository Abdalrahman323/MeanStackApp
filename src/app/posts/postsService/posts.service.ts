import { Post } from './../post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(private httpclient: HttpClient , private router:Router) { }

  getPosts() {
    this.httpclient.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
      .pipe(map((postData => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          };

        });
      })))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postUpdated.next([...this.posts]);
      });

    // return [...this.posts];
  }

  getPost(postId) {
    return this.httpclient.get<{_id:string; title:string;content:string}>("http://localhost:3000/api/posts/"+ postId);
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  addPost(post: Post) {
    this.httpclient.post<{ message: string, postId: string }>("http://localhost:3000/api/posts", post)
      .subscribe(resData => {
        const id = resData.postId;
        post.id = id;  // generated id from MongoDb
        this.posts.push(post);
        // push notification
        this.postUpdated.next([... this.posts]);
        this.router.navigate(["/"])
      })
  }

  updatePost (postId:string , post:Post){
    this.httpclient.put("http://localhost:3000/api/posts/" + postId,post)
    .subscribe((res) =>{
      //  No need for it ;as when we visit postList page we call backend

      //  const updatedPosts=[...this.posts];
      //  const updatedPostIndex = this.posts.findIndex(postObj => postObj.id === post.id)
      //  this.updatePost[updatedPostIndex]= post;
      //  this.posts = updatedPosts;
      //  this.postUpdated.next([...this.posts])
      this.router.navigate(["/"])

    });


  }

  deletePost(postId: string) {
    this.httpclient.delete("http://localhost:3000/api/posts/" + postId)
      .subscribe(() => {
        // update posts
        this.posts = this.posts.filter(post => post.id !== postId);
        this.postUpdated.next([...this.posts]);
      })
  }
}
