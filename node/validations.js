 import {body} from 'express-validator'

 export const registerValidator = [
    body('email', 'Email incorect').isEmail(),
    body('password', 'password min 5 symbols').isLength({min: 5}),
    body('fullName', 'Full name min 3 symbols').isLength({min: 3}),
    body('avatarUrl').optional().isLength({min: 3}),
 ]

 export const loginValidator = [
   body('email', 'Email incorect').isEmail(),
   body('password', 'password min 5 symbols').isLength({min: 5}),
]

export const postCreateValidator = [
   body('title', 'Введите заголовок статьи').isLength({min: 3}).isString(),
   body('text', 'Введите текст статьи').isLength({min: 10}).isString(),
   body('tags', 'Невернй формат тегов (укажите масив)').optional().isArray(),
   body('imageUrl', 'неверная ссылка на изображение').optional().isString(),
]

export const comentCreateValidator = [
   body('text', 'Введите текст статьи').isLength({min: 1}).isString(),

]

export const userUpdateValidator = [
   body('fullName', 'error validation fullName').isLength({min: 3, max: 30}).isString(),
   body('avatarUrl', 'error validation url').optional().isString(),

]