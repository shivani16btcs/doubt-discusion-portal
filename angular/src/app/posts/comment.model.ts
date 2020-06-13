export interface CommentSchema {
  comments: {
    _id: string;
    creatorId: string;
    creatorName: string;
    comment: string;
    commentedOn: Date;
  }
}
