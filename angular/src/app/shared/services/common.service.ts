import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService{
  private postId = '';
  public myProfileListener = new Subject<boolean>();
  public isPostSelectedListener = new Subject<string>();

  constructor() {  }

  setPostSelected( id: string ) {
    this.postId = id;
  }

  getPostSelected() {
    return this.postId;
  }

}
