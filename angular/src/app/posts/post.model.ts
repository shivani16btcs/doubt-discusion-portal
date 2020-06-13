export interface Post {
  _id: string;
  postedBy: string;
  title: string;
  imagePath: string;
  creatorName: string;
  createdOn: Date;
  petType: string;
  comments?: {
  commentCount?: string;
  creatorId: string,
  creatorName: string,
    commentedOn: Date,
    comment: string
  };
  flagBy?: string[];
  unlikeCount?: number;
  unlikeBy?: string[];
  likeCount?: number;
  likeBy?: string[];
  flagCount?: number;
  featureCount?:number;
  
}
