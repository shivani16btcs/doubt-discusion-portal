const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
postedBy:{type: mongoose.Schema.Types.ObjectId,ref: 'User'},
    title: {
        type: String,
        required: true
    },
    Isactive:{
        type:Boolean,
        default:true
    }
    ,
imagePath: {
        type: String,
        required: true
    },
creatorImage: {
        type: String
    },
creatorName: {
        type: String,
    },
createdOn: {
        type: Date,
    },
petType: {
        type: String,
    },
comments:
    [
      {
         creatorId: { type: String,default: ''},
                    creatorName:{type: String,},
                    comment: {
                                type: String},
                    commentedOn: {
                                type: Date,
                                  }
            }
    ], 
    commentCount: {
        type: Number,
        default: 0
    },
    likeBy: [
        {
            type: String
        }
    ],
    likeCount: {
        type: Number,
        default: 0
    },
    unlikeBy: [
        {
            type: String
        }
    ],
    unlikeCount: {
        type: Number,
        default: 0
    },
    flagCount: {
        type: Number,
        default: 0
    },
    flagBy: [
        {
            type: String
        }
    ] ,
    featureCount: {
        type: Number,
        default: 0
    },
    featureBy: [
        {
            type: String
        }
    ] 

})

module.exports = mongoose.model('Post', postSchema);