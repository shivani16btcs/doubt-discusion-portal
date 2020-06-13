const express = require('express');
const PostController = require('../Controllers/post');
const extractFile = require('../Middlewares/multer');

router = express.Router();


router.post('/create', extractFile, PostController.createPost);


router.get('/getPosts', PostController.getPosts);


router.put('/updatePost/:id', extractFile, PostController.updatePost);
router.get('/getPost/:id', PostController.getPost);

router.put('/likes/:id', PostController.likePost);
router.put('/unlikes/:id', PostController.unlikePost);


router.put('/deletePost/:id', PostController.deletePost);


router.put('/flags/:id', PostController.flagPost);
router.put('/features/:id', PostController.featurePost);


router.post('/comment', PostController.addComment);


router.get('/comment/:id', PostController.getComments);



router.put('/deleteComment/:id', PostController.deleteComment);


module.exports = router;