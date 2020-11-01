import { PostsService } from './../postsService/posts.service';
import { Post } from './../post.model';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {mimeType} from "./mime-type.validator"
@Component({
  selector: 'post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  post: Post;
  isLoading = false;

  form: FormGroup;
  imagePreview;

  private mode = 'create'
  private postId: string;

  constructor(private postsService: PostsService, private route: ActivatedRoute) {
    this.post = { id: '', title: '', content: '' ,imagePath:'' };
  }

  ngOnInit() {

    this.intalizeForm()

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {

        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId)
          .subscribe(postData => {
        // console.log(JSON.stringify(postData));

            this.post = {
              id: postData._id,
               title: postData.title,
              content: postData.content ,
              imagePath: postData.imagePath
              };
            this.isLoading = false;

            // populate the form with intial values
            this.form.setValue(
              {
                'title': this.post.title,
                'content': this.post.content,
                'image':this.post.imagePath
              });
          })
      }
      else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }
  intalizeForm() {
    this.form = new FormGroup({
      'title': new FormControl( null,{validators:[Validators.required,Validators.minLength(3)]}),
      'content': new FormControl(null,{validators:[Validators.required]}),
      'image': new FormControl(null , {validators: [Validators.required],asyncValidators:[mimeType]})

    });

  }

  onImagePicked(event:Event){

    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({'image':file});
    this.form.get('image').updateValueAndValidity();  // tell angular to re evalute this form control , as i change the value

    const reader = new FileReader();
    // this fn will executed when done reading the file
    // it's async code , so we used callback fn asigned to onload
    reader.onload=()=>{
      this.imagePreview = reader.result
    }

    reader.readAsDataURL(file);


  }

  onSavePost() {

    if (this.form.invalid)
      return

    this.isLoading = true;

    this.post.title = this.form.value.title;
    this.post.content = this.form.value.content;

    if (this.mode === 'create')
      this.postsService.createPost(this.post,this.form.value.image);
    else
      this.postsService.updatePost(this.postId, this.post,this.form.value.image);

    // this.form.reset();

  }

}
