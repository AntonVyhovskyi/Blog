import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt"

import userModel from '../models/User.js'




export const register = async (req, res) => {
    try {
       

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const doc = new userModel({
            fullName: req.body.fullName,
            email: req.body.email,
            passwordHash: hash,
            avatarUrl: req.body.avatarUrl,
        })

        const user = await doc.save();

        const token = jwt.sign({
            _id: user._id,
        }, 'secret123',
            {
                expiresIn: '30d',
            })

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'не удалось зарегестрироватся'
        })
    }
}

export const login = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email })
        if (!user) {
            return res.status(404).json({
                message: "Юзер не найден",
            })
        }
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if (!isValidPass) {
            return res.status(400).json({
                message: "Неверний логин или пароль"
            })
        }
        const token = jwt.sign({
            _id: user._id,
        }, 'secret123',
            {
                expiresIn: '30d',
            })

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'не удалось Авторизоватся'
        })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: 'пользователь не найден'
            })
        }

        const { passwordHash, ...userData } = user._doc;

        res.json(userData)
    } catch (error) {
        
    }
}

export const getUser = async (req, res) => {
    try {
        console.log(req.params.userId);
        const user = await userModel.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({
                message: 'пользователь не найден'
            })
        }

        const { passwordHash, ...userData } = user._doc;

        res.json(userData)
    } catch (error) {
        res.status(500).json({
            message: 'Произошла ошибка при получении данных пользователя'
        });
    }
}

export const updateUser = async (req, res) => {
    try {
        const {avatarUrl, fullName} = req.body
        const user = await userModel.findById(req.userId)
        if (!user) {
            return res.status(404).json({
                message: 'пользователь не найден'
            })
        }
        await userModel.findByIdAndUpdate({_id: req.userId},
            {
                fullName: fullName,
                avatarUrl: avatarUrl,
            }
        );

        const userWithNewData = await userModel.findById(req.userId)

        const { passwordHash, ...userData } = userWithNewData._doc;

        res.json(userData)
    } catch (error) {
        
    }
}