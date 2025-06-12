import express from "express"
import mongoose from "mongoose"
import multer from "multer"
import { registerValidator, loginValidator, postCreateValidator, comentCreateValidator, userUpdateValidator } from './validations.js'
import {UserContoller, PostController, CommentController} from "./controllers/index.js"
import { checkAuth, handleValidationErrors } from './utils/index.js'
import cors from 'cors'



mongoose
    .connect('mongodb+srv://Anton:Grandmaster1@cluster0.rmgzudx.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err))



const app = express()


const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'upload');
    },
    filename: (_, file, cb)=>{
        cb(null, file.originalname);
    }
})

const upload = multer( { storage })


app.use(cors())
app.use(express.json())
app.use('/upload', express.static('upload'))
app.get('/', (req, res) => {
    res.send('2323hello world!')
});


app.post('/upload',  upload.single('image'), (req, res) => {
    res.json({
        url: `http://localhost:5000/upload/${req.file.originalname}`
    })
})

// ----------------- USER -----------------

app.post('/auth/register', registerValidator, handleValidationErrors, UserContoller.register)
app.post('/auth/login', loginValidator, handleValidationErrors, UserContoller.login)
app.get('/auth/me', checkAuth, UserContoller.getMe)
app.get('/user/:userId', UserContoller.getUser)
app.patch('/user/:userId', checkAuth, userUpdateValidator, handleValidationErrors,  UserContoller.updateUser)




//       ----------------- POST ------------------
app.get('/posts/tags', PostController.getLastTags)
app.post('/posts', checkAuth,  postCreateValidator, PostController.create)
app.get('/posts', PostController.getAll)
app.get('/posts/popular', PostController.getAllSortByPopulate)
app.get('/posts/tagpopular/:tag', PostController.getAllSortByTagAndPopular)
app.get('/posts/tagnew/:tag', PostController.getAllSortByTagAndNew)
app.get('/posts/:id', PostController.getOne)
app.delete('/posts/:id',checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidator, handleValidationErrors, PostController.update)
app.get('/posts/user/:userId', PostController.getAllByUser)


//       ----------------- Comments ------------------

app.post('/comments', checkAuth, comentCreateValidator, handleValidationErrors, CommentController.addComment)
app.delete('/comments', checkAuth, CommentController.deleteComment)
app.get('/comments/four', PostController.getFirstComments)



app.listen(5000, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log('новий мерс все ближче')
})