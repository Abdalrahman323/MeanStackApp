import { Post } from './../post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { Router } from '@angular/router';
import { identifierModuleUrl } from '@angular/compiler';

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
            id: post._id,
            imagePath: post.imagePath
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
    return this.httpclient.get<{ _id: string, title: string, content: string, imagePath: string }>(
      "http://localhost:3000/api/posts/" + postId
      );
    }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  createPost(post: Post , image:File ) {
    const postData = new FormData();
    postData.append("title",post.title);
    postData.append("content",post.content);
    postData.append("image",image,post.title)


    this.httpclient.post<{ message: string; post: Post }>
    ("http://localhost:3000/api/posts", postData)
      .subscribe(resData => {
        const createdPost:Post = {
          id:resData.post.id,
          title:post.title,
          content :post.content,
          imagePath: resData.post.imagePath
        };

        this.posts.push(createdPost);
        // push notification
        this.postUpdated.next([... this.posts]);
        this.router.navigate(["/"])
      })
  }

  updatePost (postId:string , post:Post , image:File | string) {
    let postData : Post | FormData;
    if(typeof(image) ==='object'){ // case uploading a new post
      postData = new FormData();
      postData.append("id",postId);
      postData.append("title",post.title);
      postData.append("content",post.content);
      postData.append("image",image,post.title);
    } else{  // case not uploading a new image

      postData ={
        id: postId,
        title:post.title,
        content:post.content,
        imagePath:image
      }

    }
    this.httpclient.put("http://localhost:3000/api/posts/" + postId,postData)
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
