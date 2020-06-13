import { AuthService } from './../auth/auth.service';
import { Router } from '@angular/router';
import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  posts: Post[];
  filteredPosts: Post[] = [];
  postsListener = new Subject<Post[]>();
  totalPost: number;
  currentPage = 1;

  constructor( private http: HttpClient, private authService: AuthService, private router: Router ) {}

  getTotalPosts() {
    return this.totalPost;
  }
  createPost( createPost: Post ) {
    const postData = new FormData();
    postData.append('postedBy', createPost.postedBy );
    postData.append('title', createPost.title );
    postData.append('image', createPost.imagePath, createPost.title );
    postData.append('creatorName', createPost.creatorName );
    postData.append('createdOn', createPost.createdOn.toISOString() );
    postData.append('petType', createPost.petType);
  //  console.log(createPost);
    this.http.post( 'http://localhost:3000/post/create', postData )
      .subscribe( result => {
        this.router.navigate(['/post/home']);
        this.getPosts(2, this.currentPage);
      } );
  }
  onUpdatePost(id: string, uploadPost: Post) {
    let postData: Post | FormData;
    if (typeof uploadPost.imagePath === 'object' ) {
      postData = new FormData();
      postData.append('postedBy', uploadPost.postedBy );
      postData.append('title', uploadPost.title );
      postData.append('image', uploadPost.imagePath, uploadPost.title );
      postData.append('creatorName', uploadPost.creatorName);
      postData.append('createdOn', uploadPost.createdOn.toISOString() );
      postData.append('petType', uploadPost.petType);
    } else {
      postData = uploadPost;
    }
    console.log(uploadPost);
    this.http
      .put( 'http://localhost:3000/post/updatePost/'+id, postData )
      .subscribe( result => {
        this.router.navigate(['/post/home']);
        this.getPosts(2, this.currentPage);
      } );
  }

  
  onLikePost(id: string, email: string) {
    return this.http
      .put<{message: string, updateStatus: string}>('http://localhost:3000/post/likes/' + id, { email: email } );
  }

  onUnlikePost(id: string, email: string) {
    return this.http
      .put<{ message: string, updateStatus: string }>( 'http://localhost:3000/post/unlikes/' + id, { email: email } );
  }

  onFlagPost(id: string, email: string) {
    return this.http
      .put<{ message: string }>( 'http://localhost:3000/post/flags/' + id, { email: email } );
  }

  onFeaturedPost(id:string,email:string)
  { 
    return this.http
      .put<{ message: string }>( 'http://localhost:3000/post/features/' + id, { email: email } );
  
  }

  getPost( id: string ) {
     return this.http
      .get<{message: string, post: any}>('http://localhost:3000/post/getPost/' + id );
  }

  onSubmitComment(id: string, commented: string ) {
    const date = new Date();
    const newComment = {
      postId: id,
      creatorId: this.authService.getUserId(),
      creatorName: this.authService.getUsername(),
      comment: commented,
      commentedOn: date,
    };
    return this.http
      .post( 'http://localhost:3000/post/comment', newComment );
  }

getPosts(postsPerPage: number= 2, currPage: number = 1, petType: string = 'all', sortBy = 'latest') {
  const queryParams = `?postsPerPage=${postsPerPage}&currPage=${currPage}&petType=${petType}&email=${this.authService.getEmail()}&sortBy=${sortBy}`;
    this.currentPage = currPage;
    this.http
      .get<{ message: string, posts: any, totalPosts: number }>('http://localhost:3000/post/getPosts' +queryParams)
      .subscribe( documents => {
        this.totalPost = documents.totalPosts;
        this.posts = documents.posts;
        this.postsListener.next(this.posts.slice());
      }, error => {
        console.log( error );
      } );
  }





  onGetComments(id: string, commentlimit: number) {
    const queryParam = `?commentLimit=${commentlimit}`;
    return this.http
      .get<{message: string, comments: any}>( 'http://localhost:3000/post/comment/' + id + queryParam );
  }

  onDeleteComment( postId: string, commentId: string ) {
    return this.http
      .put<{ message: string }>( 'http://localhost:3000/post/deleteComment/' + postId, { commentId: commentId } );
  }

  onDeletePost(id: string) {
    this.http
      .put('http://localhost:3000/post/deletePost/' + id, {})
      .subscribe( result => {
        console.log(result);
      } );
  }

}
