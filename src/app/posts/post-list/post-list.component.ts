import { PostsService } from './../postsService/posts.service';
import { Post } from './../post.model';
import { Component, OnDestroy, OnInit, } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit , OnDestroy {


  posts: Post[] = [];
  isLoading=false;
  postsSubscription: Subscription

  constructor(private postsService: PostsService) { }

  ngOnInit(): void {

    this.postsService.getPosts();
    this.isLoading = true;
    this.postsSubscription = this.postsService.getPostUpdateListener()
    .subscribe((posts: Post[]) => {
      this.posts = posts;
      this.isLoading = false;
    })
  }

  onDelete(postId:string){

    this.postsService.deletePost(postId);
  }
      ngOnDestroy() {
        this.postsSubscription.unsubscribe();
      }

}
