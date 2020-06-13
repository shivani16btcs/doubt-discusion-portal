const Post = require('../Model/post');
const User = require('../Model/user');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

exports.createPost = (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        postedBy: req.body.postedBy,
        title: req.body.title,
        imagePath: url + "/images/" + req.file.filename,
        creatorName: req.body.creatorName,
        createdOn: req.body.createdOn,
        petType: req.body.petType
    });
    post.save()
        .then(result => {
            res.status(200).json({ message: "Post Added" })
        })
        .catch(error => {
            return res.status(400).json({ isError:true,errCode:'UPDATION_FAILED',message:'Post not added'})
        });
}

exports.updatePost = (req, res, next) => {
    let image = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get("host");
        image = url + "/images/" + req.file.filename
    }
    Post.updateOne({ _id: req.params.id }, {
        $set: {
            title: req.body.title,
            imagePath: image,
            petType: req.body.petType
        }
    })
        .then(result => {
            res.status(200).json({ message: "post updated" })
        })
        .catch(error => {
            return res.status(400).json({ isError:true,errCode:'UPDATION_FAILED',message:'Post NOT UPDATED' })
        })
}

exports.getPosts = (req, res, next) => {
    const postsPerPage = +req.query.postsPerPage;
    const sortBy = req.query.sortBy;
     const petTypes = req.query.petType;
     const email = req.query.email;
    const currPage = +req.query.currPage;
    let sortQuery = {createdOn: -1};

    if (sortBy === 'latest') { sortQuery = { createdOn: -1 };}
    else if (sortBy === 'oldest') { sortQuery = { createdOn: 1};}
    else if (sortBy === 'mostLikes') { sortQuery = { likeCount: -1, createdOn: -1};}
    else if (sortBy === 'mostComments') { sortQuery = { commentCount: -1, createdOn: -1 }; } 
          else 
            {
             sortQuery = {flagCount: -1, createdOn: -1};
            }

    let postQuery;
    let dbQuery;
    let fetchedPosts;
    if (petTypes === 'flagged') {
        dbQuery = { flagBy: email,Isactive:true };
        postQuery = Post.find(dbQuery)
            .sort(sortQuery)                                  // { $and: [{ _id: req.params.id }, untypeBy] }
            .skip(postsPerPage * (currPage - 1))
            .limit(postsPerPage);
    } else if (petTypes === 'all') {
        postQuery = Post.find({Isactive:true})
            .sort(sortQuery)
            .skip(postsPerPage * (currPage - 1))
            .limit(postsPerPage);
        dbQuery = {Isactive:true};
       
    } else {
        dbQuery = { petType: petTypes,Isactive:true };
        postQuery = Post.find(dbQuery)
            .sort(sortQuery)
            .skip(postsPerPage * (currPage - 1))
            .limit(postsPerPage);
    }
    postQuery
        .then(posts => {
            fetchedPosts = posts;
            return Post.countDocuments(dbQuery);
        })
        .then(count => {
            console.log(count);
            res.status(200).json({posts: fetchedPosts,totalPosts: count,
                  
            }
             
            )
        })
        .catch(error => {
            return res.status(500).json({message: "unexpected error" })
        });
}
exports.deleteComment = (req, res, next) => {
    postId = req.params.id;
    commentId = req.body.commentId;
    Post.updateOne({ $and: [{ _id: postId }, { 'comments._id': commentId }] }, { $pull: {comments:{ _id: commentId}}, $inc: { commentCount: -1 } })
        .then(result => {
            if (!result) {
                return res.status(400).json({ message: "There are no comment" })
            }
            return res.status(200).json({ message: "Comments Deleted Successfully" })
        })
        .catch(error => {
            return res.status(500).json({  isError:true,errCode:'DELETION_FAILED',message:'Comment not deleted.' })
        });
}







exports.deletePost = (req, res, next) => {
  

    Post.findOne({ $and: [{ _id:req.params.id ,Isactive:true }]})
    .then(result => {
         Post.updateOne({ _id:req.params.id},{
            $set: {
              Isactive:false
            }
        }).then(result=>{

            res.status(200).json({message: "Post deleted"});
        })
    })
    .catch(error => {
        return req.status(500).json({ isError:true,errCode:'DELETION_FAILED',message:'deletion failed' })
    });

    // Post.deleteOne({ _id: req.params.id })
    //     .then(result => {
           
    //         res.status(200).json({ message: "Post deleted"});
    //     })
    //     .catch(error => {
    //         return req.status(500).json({ message: "unexpected error" })
    //     });
}

exports.likePost = (req, res, next) => {
    push = {$push:{likeBy:req.body.email},$inc:{likeCount:1}}
    pull = {$pull:{unlikeBy:req.body.email},$inc:{unlikeCount:-1}}
    typeBy = {likeBy: req.body.email};
    untypeBy = {unlikeBy: req.body.email};
    return Post.find({$and:[{ _id: req.params.id }, typeBy]})
        .then(result => {
        const [post] = result;
        if (!post) {
         return Post.updateOne({ _id: req.params.id },push)
         .then(result => {
            return Post.updateOne({ $and: [{ _id: req.params.id }, untypeBy] }, pull)
             .then(update => {
                 res.status(200).json({
                     message: "Post liked",updateStatus: update.n})
                     })
              });
            }
        }).catch(error => {
            return res.status(500).json({  isError:true,errCode:'UNEXP_ERR',message: "Unexpected error" });
        });

}

exports.unlikePost = (req, res, next) => {
    pull = { $pull: { likeBy: req.body.email }, $inc: { likeCount: -1 } }
    push = { $push: { unlikeBy: req.body.email }, $inc: { unlikeCount: 1 } }
    untypeBy = { likeBy: req.body.email };
    typeBy = { unlikeBy: req.body.email };

    return Post.find({ $and: [{ _id: req.params.id }, typeBy] })
        .then(result => {
            const [post] = result;
         if (!post) {
          return Post.updateOne({ _id: req.params.id }, push)
         .then(result => {
          return Post.updateOne({ $and: [{ _id: req.params.id }, untypeBy] }, pull)
          .then(update => {
                            res.status(200).json({ message: "Post unliked",updateStatus: update.n })
                          })
                    });
            }
        }).catch(error => {
            return res.status(500).json({ isError:true,errCode:'UNEXP_ERR',message: "unable to unlike."});
        });

}

exports.getPost = (req, res, next) => {
    id = req.params.id;
    viewCount = req.query.viewCount
    Post.aggregate([ { $match: { _id: { "$in": [mongoose.Types.ObjectId(id)]}}}, {$project: {comments: 0}}])
        .then(post => {
            [fetchedPost] = post;
            res.status(200).json({ message: "Post fetched", post: fetchedPost})
        })
        .catch(error => {
            return res.status(500).json({
                isError:true,errCode:'UNEXP_ERR',message: "Failure in post fetching."
            })
        })
}

exports.getComments = (req, res, next) => {
    id = req.params.id;
    limitComment = (+req.query.commentLimit)*3;
    Post.aggregate([
        { $match: { _id: { "$in": [mongoose.Types.ObjectId(id)] } } }, 
        { $project: { comments: 1,_id:0}},
        { $unwind: '$comments' },
        { $sort: { 'comments._id':-1}},
        { $limit: limitComment}])
        .then(comments => {
            if (!comments) {return res.status(400).json({ message: "No comments"})}
            res.status(200).json({message: "comment fetched",comments:comments})
        })
        .catch(error => {
            return res.status(500).json({isError:true,errCode:'UNEXP_ERR',message: "failed to fetch comment."})
        });
}

exports.addComment = (req, res, next) => {
    postId = req.body.postId;
    newComment = {
        creatorId: req.body.creatorId,
        creatorName: req.body.creatorName,
        comment: req.body.comment,
        commentedOn: req.body.commentedOn
    };

   

    Post.updateOne({ _id: postId }, { $inc: { commentCount: 1 }, $push: { comments: newComment } })
        .then(result => {
            res.status(200).json({message: "comment added", })
        })
        .catch(error => { res.status(500).json({ message: "unexpected error" })
        });
}

exports.featurePost=(req,res,next)=>{
    id = req.params.id,
    email = req.body.email
    Post.findOne({ _id: id, featureBy: email })
    .then(post => {
        if (post === null) {
            Post.updateOne({ _id: id }, { $push: { featureBy: email }, $inc: { featureCount: 1 } })
                .then(result => {
                    return res.status(200).json({ message: "featured" })
                }) .catch(error => {
                    res.status(500).json({message: "unexpected error"})
                });
        } else {
            Post.updateOne({ _id: id }, { $pull: { featureBy: email }, $inc: { featureCount: -1 } })
                .then(result => {
                    return res.status(200).json({ message: "features" })
                }) .catch(error => {
                    res.status(500).json({message: "unexpected error"})
                });
        }
    })
    .catch(error => {
        res.status(500).json({message: "unexpected error"})
    });
}

exports.flagPost = (req, res, next) => {
    id = req.params.id,
        email = req.body.email
    Post.findOne({ _id: id, flagBy: email })
        .then(post => {
            if (post === null) {
                Post.updateOne({ _id: id }, { $push: { flagBy: email }, $inc: { flagCount: 1 } })
                    .then(result => {
                        return res.status(200).json({ message: "flagged" })
                    }) .catch(error => {
                        res.status(500).json({message: "unexpected error"})
                    });
            } else {
                Post.updateOne({ _id: id }, { $pull: { flagBy: email }, $inc: { flagCount: -1 } })
                    .then(result => {
                        return res.status(200).json({ message: "flags" })
                    }) .catch(error => {
                        res.status(500).json({message: "unexpected error"})
                    });
            }
        })
        .catch(error => {
            res.status(500).json({message: "unexpected error"})
        });
}

