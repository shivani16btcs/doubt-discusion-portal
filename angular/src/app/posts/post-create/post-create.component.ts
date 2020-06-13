import { CommonService } from 'src/app/shared/services/common.service';
import { Post } from './../post.model';
import { PostService } from './../post.service';
import { mimeType } from './mime-type.validator';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from './../../auth/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {
  form: FormGroup;
  imageSelect = true;
  isAuthenticated = false;

  showPopUp: Boolean = true;
  isAuthenticatedListener: Subscription;
  postAction = 'Upload';
  selectedPostId = '';
  imagePreview: string;

  constructor( private authService: AuthService,
               private postService: PostService,
               private commonService: CommonService,
               private router: Router,
               private dialog: MatDialog ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(
        null,
        { validators: [Validators.required]}
      ),
      image: new FormControl(
        null,
        { validators: [Validators.required],
          asyncValidators: [ mimeType ] }
      ),
      petType: new FormControl(
        '',
        { validators: [Validators.required]}
      )
    });

    this.isAuthenticated = this.authService.getIsAuth();
    this.isAuthenticatedListener = this.authService.getIsAuthListener()
      .subscribe( auth => {
        this.isAuthenticated = true;
      } );

    this.selectedPostId =  this.commonService.getPostSelected();
    if ( this.selectedPostId ) {
      this.postAction = 'Update';
      this.postService.getPost( this.selectedPostId )
        .subscribe( result => {
          this.form.patchValue({
            title: result.post.title,
            image: result.post.imagePath,
            petType: result.post.petType
          });
          this.imagePreview = result.post.imagePath;
        } );
    }
  }

  onPostUpload() {
    if ( this.form.invalid ) {
      if ( !this.form.value.image ) {
        this.imageSelect = false;
      }
      return;
    }
    this.showPopUp = false;
    const date = new Date();
    const createPost: Post = {
      _id: null,
      postedBy: this.authService.getUserId(),
      title: this.form.value.title,
      imagePath: this.form.value.image,
      creatorName: this.authService.getUsername(),
      createdOn: new Date(date.getTime()),
      petType: this.form.value.petType
    };

    if (!this.selectedPostId) {
      this.postService.createPost( createPost );
    } else {
      this.postService.onUpdatePost(this.selectedPostId, createPost);
    }

    this.commonService.setPostSelected('');
    location.reload();
  }

  closePopUp() {
    location.reload();
  }

  omImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      image: file
    });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imageSelect = true;
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  deletePost() {
    this.postService.onDeletePost(this.selectedPostId);
    location.reload();
  }

  ngOnDestroy() {
    this.isAuthenticatedListener.unsubscribe();
  }
}
