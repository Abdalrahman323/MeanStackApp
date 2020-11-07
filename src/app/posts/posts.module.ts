import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {ReactiveFormsModule } from '@angular/forms'

import {PostListComponent } from './post-list/post-list.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { AngularMaterialModule } from '../angular-material/angular-material.module';




@NgModule({
  declarations: [
    PostCreateComponent,
    PostListComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
  ]
})
export class PostsModule { }
