import { PostsService } from './../postsService/posts.service';
import { Post } from './../post.model';
import { Component, OnDestroy, OnInit, } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit , OnDestroy {

  totalPosts = 0;
  postsPerPage = 5;
  currentPageNumber =1;


  pageSizeOptions =[1,2,5,10];
  posts: Post[] = [];
  isLoading=false;
  postsSubscription: Subscription

  constructor(private postsService: PostsService) { }

  ngOnInit(): void {

    this.postsService.getPosts(this.postsPerPage,this.currentPageNumber);
    this.isLoading = true;
    this.postsSubscription = this.postsService.getPostUpdateListener()
    .subscribe((postData :{posts:Post[], postCount:number }) => {
      this.posts = postData.posts;
      this.totalPosts = postData.postCount;
      this.isLoading = false;
    })
  }

  onDelete(postId:string){
    this.isLoading =true;
    this.postsService.deletePost(postId).subscribe(()=>{
        this.postsService.getPosts(this.postsPerPage,this.currentPageNumber);
    });
  }
  OnChangePage(pageData:PageEvent){
    this.isLoading = true;
    this.currentPageNumber = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage,this.currentPageNumber);



  }
      ngOnDestroy() {
        this.postsSubscription.unsubscribe();
      }

}
