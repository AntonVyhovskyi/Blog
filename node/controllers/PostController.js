import PostModel from '../models/Post.js'

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();

        const tags = posts.map(obj => obj.tags)
            .flat()
            .slice(0, 5)
        res.json(tags)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'не удалось загрузить статьи',
        })
    }
}

export const getFirstComments = async (req, res) => {
    try {
        const posts = await PostModel.find()
            .sort({ createdAt: -1 })
            .populate('user', '-passwordHash')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'fullName email avatarUrl'
                }
            })
            .limit(20).exec();

        const comments = posts.map(obj => obj.comments[0])
        const commentsWithoutNull = comments.filter((e) => e)
        console.log(commentsWithoutNull);
        const firstFourComments = commentsWithoutNull.slice(0, 4)
        res.json(firstFourComments)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'download comments error',
        })
    }
}

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user', '-passwordHash').sort({ createdAt: -1 }).exec();

        res.json(posts)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'не удалось загрузить статьи',
        })
    }
}
export const getAllSortByPopulate = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user', '-passwordHash').sort({ viewsCount: -1 }).exec();

        res.json(posts)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'не удалось загрузить статьи',
        })
    }
}
export const getAllSortByTagAndPopular = async (req, res) => {
    try {
        const { tag } = req.params
        if (!tag) {
            return res.status(400).json({
                message: "где тег?"
            })
        }
        const posts = await PostModel.find({ tags: { $in: [tag] } }).populate('user', '-passwordHash').sort({ viewsCount: -1 }).exec();

        res.json(posts)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'не удалось загрузить статьи',
        })
    }
}

export const getAllSortByTagAndNew = async (req, res) => {
    try {
        const { tag } = req.params
        if (!tag) {
            return res.status(400).json({
                message: "где тег?"
            })
        }
        const posts = await PostModel.find({ tags: { $in: [tag] } }).populate('user', '-passwordHash').sort({ createdAt: -1 }).exec();

        res.json(posts)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'не удалось загрузить статьи',
        })
    }
}

export const getAllByUser = async (req, res) => {
    try {
        const { userId } = req.params
        console.log(userId);
        if (!userId) {
            return res.status(400).json({
                message: "user is undefined"
            })
        }

        const posts = await PostModel.find({ user: userId }).populate('user', '-passwordHash').sort({ createdAt: -1 }).exec();

        if (posts.length > 0) {
            return res.status(200).json(posts);
        } else {
            return res.status(404).json({
                message: "No posts found"
            });
        }
        
    } catch (error) {
        
    }
}



export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;


        const post = await PostModel.findOneAndUpdate(
            { _id: postId },
            { $inc: { viewsCount: 1 } },
            { new: true }).populate('user', '-passwordHash')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'fullName email avatarUrl'
                }
            });
        if (!post) {
            return res.status(404).json({
                message: 'Статья не найдена',
            });
        }

        res.json(post);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'не удалось загрузить статьи',
        })
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await PostModel.findById(postId).populate('user', '-passwordHash')

        if (!post) {
            return res.status(404).json({
                message: "Статья не найдена"
            });
        }


        if (post.user._id.toString() !== req.userId.toString()) {
            return res.status(403).json({
                message: 'єто не ваша статья',
                postUserId: post.user._id,
                userId: req.userId

            })
        }

        const removedPost = await PostModel.findByIdAndDelete(postId);

        if (!removedPost) {
            return res.status(404).json({
                message: "Статья не найдена"
            });
        }

        res.json({
            success: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось удалить. Что то пошло не так.',
        })
    }
}

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,

        });

        const post = await doc.save();
        res.json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'не удалось создать статью',
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await PostModel.findById(postId).populate('user', '-passwordHash')

        if (!post) {
            return res.status(404).json({
                message: "Статья не найдена"
            });
        }


        if (post.user._id.toString() !== req.userId.toString()) {
            return res.status(403).json({
                message: 'єто не ваша статья',
                postUserId: post.user._id,
                userId: req.userId

            })
        }
        await PostModel.updateOne(
            { _id: postId },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                user: req.userId,
            }
        );
        res.json({
            success: true
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'не удалось изменить статью',
        })
    }
}