import { AuthService } from '../../../auth/services/auth.service';
import { PostsService } from '../../postsService/posts.service';
import { Post } from '../../post.model';
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
  isUserAuthenticated = false;
  userId :string;

  private postsSubscription: Subscription
  private authStatusSubscription: Subscription;


  constructor(private postsService: PostsService , private authService:AuthService) { }

  ngOnInit(): void {

    this.isLoading = true;
    this.userId = this.authService.getUserId();

    this.postsService.getPosts(this.postsPerPage,this.currentPageNumber);

    this.postsSubscription = this.postsService.getPostUpdateListener()
    .subscribe((postData :{posts:Post[], postCount:number }) => {
      this.posts = postData.posts;
      this.totalPosts = postData.postCount;
      this.isLoading = false;
    });

    // first visit of the page
    this.isUserAuthenticated = this.authService.getIsAuth();
    // if any authentication change : useful on case of logout ,
    this.authStatusSubscription =this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated =>{
      this.isUserAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onDelete(postId:string){
    this.isLoading =true;
    this.postsService.deletePost(postId).subscribe(()=>{
        this.postsService.getPosts(this.postsPerPage,this.currentPageNumber);
    },error=>{
      this.isLoading = false;
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
        this.authStatusSubscription.unsubscribe();
      }

}
