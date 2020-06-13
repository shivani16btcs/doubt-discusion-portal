import { CommentSchema } from './../comment.model';
import { CommonService } from 'src/app/shared/services/common.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from './../post.model';
import { PostCreateComponent } from './../post-create/post-create.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from './../../auth/auth.service';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription, concat } from 'rxjs';
import { PostService } from '../post.service';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from './../../shared/services/localStorage.service';


@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css']
})
export class PostsListComponent implements OnInit, OnDestroy {
 //petType;
  role ='user';
  isAdmin=false;
  isAuthenticated = false;
  isLoading = true;
  isAuthenticatedListener: Subscription;
  posts: Post[] = [];
  currPage = 1;
  username:string
  totalPosts: number;
  postsPerPage = 2;
  likeStatus: string[] = [];
  unlikeStatus: string[] = [];
  flagStatus: string[] = [];
  featureStatus:string[] = [];
  featureArr:Post[] = [];
  sortByTime = 'latest';
  loadPage =  'homeSection';
  sortBySelected = 'latest';
  comment = '';
  postComments: CommentSchema[];
  showPostCount = 4;
  commentCountMultiplier = 1;
  isChecked = false;
  myProfile = false;
  myProfileListener: Subscription;
  isCommentSelected = false;
  selectedCommentId = '';
  currPost: Post = {_id: '',
    postedBy: '',
    title: '',
    imagePath: '',
    creatorName: '',
    createdOn: null,
    petType: ''};

  constructor(private lclsrc:LocalStorageService,private toastr: ToastrService ,private authService: AuthService, private postService: PostService,
              private commonService: CommonService,
              private router: Router,
              private route: ActivatedRoute ,
              private dialog: MatDialog,
              ) { }

  ngOnInit(): void {
    
    const date = new Date();
    this.username = this.lclsrc.getUsername();
    this.role = this.authService.getRole();
  console.log(this.role);
    console.log(new Date(date.getUTCDate()));
    this.isAuthenticated = this.authService.getIsAuth();
    this.isAuthenticatedListener = this.authService.getIsAuthListener()
      .subscribe( auth => {
        this.isAuthenticated = auth;
        if ( this.isAuthenticated === false ) {
          this.router.navigate(['/login']);
        }
      } );
    this.commentPage();
    this.postService.getPosts( this.postsPerPage, this.currPage, 'all' );
    this.postService.postsListener
      .subscribe( postsData => {
        this.isLoading = false;
        this.posts = postsData;
       // console.log(this.role);
        this.totalPosts = this.postService.getTotalPosts();
        this.postsPerPage = 2 > this.totalPosts ? this.totalPosts : 2;
        this.likeStatus = [];
        this.unlikeStatus = [];
        this.flagStatus = [];
        this.featureStatus =[];
        this.posts.forEach( post => {
            this.setLikeUnlikeFlag( post );
          } );
      } );
    if ( this.isAuthenticated === false ) {
        this.router.navigate(['/login']);
      }
    if(this.role==='admin')
    {
      this.isAdmin=true;
    }
    
    this.myProfileListener =  this.commonService.myProfileListener
      .subscribe( status => {
        if ( status ) {
          this.myProfile = true;
        } else {
          this.myProfile = false;
        }
      } );
  }



  

  onClickFeatured()
  {
    this.posts.forEach( post => {
      if ( post.featureCount === 1 ) {
          this.featureArr.push(post);
          console.log(post)
          }
        } );
  }  





  
  filterPosts( petType: string ) {
    this.currPage=1;
    //this.petType = petType;
    if ( petType === "all" ) {
      this.postsPerPage = 2;
    }
    this.sortBySelected = 'latest';
    this.postService.getPosts( this.postsPerPage, 1, petType );
  }

  uploadPost() {
    this.isLoading = true;
    this.dialog.open( PostCreateComponent );
    this.isLoading = false;
  }

  likePosts(id: string, index: number ) {
    this.postService.onLikePost(id, this.authService.getEmail())
    .subscribe( result => {
      if ( +result.updateStatus === 1 ) {
        this.posts.find( post => {
          if ( post._id === id ) {
            post.unlikeCount = post.unlikeCount - 1;
            this.unlikeStatus[index] = 'unlikes';
          }
        } );
      }
      this.posts.find( post => {
        if (post._id === id) {
          post.likeCount = post.likeCount + 1;
          this.likeStatus[index] = 'Liked';
        }
      } );
    } );
  }

unlikePosts(id: string, index: number) {
    this.postService.onUnlikePost(id, this.authService.getEmail())
    .subscribe( result => {
      if ( +result.updateStatus === 1 ) {
        this.posts.map( post => {
          if ( post._id === id ) {
            post.likeCount = post.likeCount - 1;
            this.likeStatus[index] = 'likes';
          }
        } );
      }
      this.posts.find( post => {
        if (post._id === id) {
          post.unlikeCount = post.unlikeCount + 1;
          this.unlikeStatus[index] = 'Unliked';
        }
      } );
    } );
  }

  sortBy( type: string ) {
    this.postService.getPosts(2, 1, "all", type);
    this.sortBySelected = type;
  }

  featurePost(id:string, index:number){
    this.postService.onFeaturedPost(id,this.authService.getEmail())
    .subscribe(result=>{
           this.posts.find(post=>{ 
            if (post._id === id) {
              if ( result.message === 'features' ) {
                post.featureCount = post.featureCount - 1;
                this.featureStatus[index] = 'features';
              } else {
                post.featureCount = post.featureCount + 1;
                this.featureStatus[index] = 'featured';
              }
            }
           })
    })
  }

  flagPost(id: string, index: number ) {
    this.postService.onFlagPost( id, this.authService.getEmail() )
      .subscribe( result => {
        console.log(result.message);
        this.posts.find( post => {
          if (post._id === id) {
            if ( result.message === 'flags' ) {
              post.flagCount = post.flagCount - 1;
              this.flagStatus[index] = 'flags';
            } else {
              post.flagCount = post.flagCount + 1;
              this.flagStatus[index] = 'flagged';
            }
          }
        } );
      } );
  }

  onChangedPage(pageEvent: PageEvent) {
    this.currPage = pageEvent as unknown as number;
    this.postService.getPosts( this.postsPerPage, pageEvent as unknown as number, 'all' , this.sortBySelected );
  }

  submitComment( comment: string ) {
    this.postService.onSubmitComment(this.currPost._id, comment )
      .subscribe( result => {
      this.comment = '';
      this.commentPage();
      } );
  }

  onEnterPress( comment: string, event: any) {
    if ( this.comment === '') {
      return;
    }
    if ( event.key === 'Enter' ) {
      this.submitComment( comment );
    }
  }

  viewMoreComments() {
    this.commentCountMultiplier++;
    this.getComments( this.commentCountMultiplier );
  }

  commentPage() {
    this.route.paramMap
      .subscribe( (paramMap: ParamMap) => {
        if ( paramMap.has( 'postId' ) ) {
          this.isLoading = true;
          this.loadPage = 'commentSection';
          this.postService.getPost( paramMap.get('postId') )
            .subscribe( post => {
              this.isLoading = false;
              this.postComments = [];
              this.commentCountMultiplier = 1;
              this.currPost = post.post;
              this.getComments(this.commentCountMultiplier);
            } );
        }
      } );
  }

  getComments( commentLimit: number ) {
    this.postService.onGetComments( this.currPost._id, commentLimit )
      .subscribe( result => {
        this.postComments = result.comments;
        console.log(this.postComments[0].comments);
      } );
  }

  setLikeUnlikeFlag(post: Post) {
    let flag = false;
    post.likeBy.forEach( user => {
              if ( user === this.authService.getEmail() ) {
                  flag = true;
                  this.likeStatus.push('Liked');
                  }
                } );
    if ( !flag ) {
                  this.likeStatus.push('likes');
                }
    flag = false;
    post.unlikeBy.forEach( user => {
              if ( user === this.authService.getEmail() ) {
                flag = true;
                this.unlikeStatus.push('Unliked');
              }
            } );
    if ( !flag ) {
              this.unlikeStatus.push('unlikes');
            }
    flag = false;
    post.flagBy.forEach( user => {
              if ( user === this.authService.getEmail() ) {
                flag = true;
                this.flagStatus.push('flagged');
              }
            } );
    if ( !flag ) {
              this.flagStatus.push('flags');
            }
  }

  onFlagCheckChange(event: any) {
    //this.currPage=1;
    if (event.target.checked) {
      this.filterPosts('flagged');
    } else {
      this.postService.getPosts();
    }
  }

  myProfileUpdate() {
    this.router.navigate(['/register', this.authService.getEmail()]);
  }

  selectComment(id: string  ) {
    this.postComments.map( comment => {
      if ( comment.comments._id === id ) {
        if ( comment.comments.creatorId === this.authService.getUserId() ) {
          this.isCommentSelected = true;
          this.selectedCommentId = id;
        }
      }
    } );
  }

deleteComment( commentId: string ) {
    this.postComments.map( comment => {
      if ( comment.comments._id === commentId ) {
        if ( comment.comments.creatorId === this.authService.getUserId() ) {
          const deleteValue = confirm('Delete comment');
          if ( deleteValue ) {
            this.postService.onDeleteComment( this.currPost._id, commentId )
              .subscribe( result => {
                  this.commentPage();
              } );
          } else {
            this.isCommentSelected = false;
          }
        }
      }
    } );
  }

selectPost( id: string ) {
    this.posts.map( post => {
      if (post.postedBy === this.authService.getUserId()) {
        console.log( post.postedBy + " " + this.authService.getUserId());
        this.dialog.open( PostCreateComponent );
        this.commonService.setPostSelected( id );
      }
    } );
  }

ngOnDestroy() {
    this.isAuthenticatedListener.unsubscribe();
    this.myProfileListener.unsubscribe();
  }
}
