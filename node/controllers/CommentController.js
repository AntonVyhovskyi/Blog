import CommentModel from "../models/Comment.js"
import PostModel from '../models/Post.js'

export const addComment = async (req,res) => {
    try {

        const doc = new CommentModel({
            text: req.body.text,
            user: req.userId,
            post: req.body.postId
        })

  

        const savedComment = await doc.save();


        const postId = req.body.postId
        const post = await PostModel.findById(postId)
        

        if (!post) {
            return res.status(404).json({message:'post undefined'})
        }
        post.comments.push(savedComment._id)

        await post.save()

        res.status(201).json({ message: "Comment add sucesfull", comment: savedComment });
     
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error with comment add' });
    }
}

export const deleteComment = async (req,res) => {
    try {

        const comment = await CommentModel.findById(req.body.id)
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
       
        if(req.userId !== comment.user._id.toString()) {
            return res.status(402).json({ message: 'You are not allowed delete this' });
        }

        const post = await PostModel.findById(comment.post)
        post.comments = post.comments.filter((e)=> e._id.toString() !== req.body.id)
        await post.save()

        await CommentModel.findByIdAndDelete(req.body.id)
        res.status(200).json({ message: "Comment delete sucesfull"});
     
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error with comment delete' });
    }
}